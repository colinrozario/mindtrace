import insightface
from insightface.app import FaceAnalysis
import cv2
import numpy as np
import json
import os
import sys

# Add parent directory to path to import from app
# Add parent directory to path to import from app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import ChromaDB client
try:
    from app.chroma_client import get_face_collection
except ImportError:
    # Fallback for when running as script
    sys.path.append(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "app"))
    from app.chroma_client import get_face_collection

def load_models():
    """
    Load the RetinaFace and ArcFace models.
    Optimized for real-time multi-face detection with maximum performance.
    """
    app = FaceAnalysis(name="buffalo_l")
    # Use (384, 384) for maximum speed while maintaining acceptable accuracy
    # Smaller size = faster processing = smoother tracking
    app.prepare(ctx_id=0, det_size=(384, 384))
    return app

def detect_and_embed(app, image):
    """
    Detect all faces and return their embedding vectors.
    Optimized for real-time performance with minimal preprocessing.
    """
    # InsightFace expects BGR image (OpenCV format)
    if image is None:
        print("DEBUG: Image is None in detect_and_embed")
        return []
    
    # Ensure image is in correct format
    if len(image.shape) != 3 or image.shape[2] != 3:
        print(f"DEBUG: Invalid image shape: {image.shape}")
        return []
        
    print(f"DEBUG: Image shape: {image.shape}, dtype: {image.dtype}")
    
    # Direct detection for speed - skip enhancement for real-time performance
    faces = app.get(image)
    
    # Only try enhancement if no faces detected (fallback)
    if len(faces) == 0:
        print("DEBUG: No faces detected, trying enhanced image")
        lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
        l = clahe.apply(l)
        enhanced = cv2.merge([l, a, b])
        enhanced = cv2.cvtColor(enhanced, cv2.COLOR_LAB2BGR)
        faces = app.get(enhanced)
    
    print(f"DEBUG: Detected {len(faces)} faces")
    
    if len(faces) == 0:
        return []
    
    results = []
    for idx, face in enumerate(faces):
        bbox = face.bbox.tolist()
        # Add detection score for confidence filtering
        det_score = float(face.det_score) if hasattr(face, 'det_score') else 1.0
        print(f"DEBUG: Face {idx} bbox: {bbox}, score: {det_score:.3f}")
        results.append({
            "embedding": face.embedding.tolist(),
            "bbox": bbox,
            "det_score": det_score
        })
    
    print(f"DEBUG: Returning {len(results)} face embeddings")
    return results

def cosine_similarity(a, b):
    a, b = np.array(a), np.array(b)
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return np.dot(a, b) / (norm_a * norm_b)

def recognize_face(app, image, threshold=0.42, user_id=None):
    """
    Compare input face embeddings to stored embeddings using ChromaDB.
    Optimized for real-time multi-face detection with confidence filtering.
    Returns a list of recognition results sorted by confidence.
    """
    # Get embedding and bbox for all faces
    detected_faces = detect_and_embed(app, image)
    print(f"DEBUG: recognize_face - Processing {len(detected_faces)} detected faces")
    
    if not detected_faces:
        return []

    # Filter out low-confidence detections for stability
    MIN_DET_SCORE = 0.4  # Slightly lower threshold for better detection
    detected_faces = [f for f in detected_faces if f.get("det_score", 1.0) >= MIN_DET_SCORE]
    print(f"DEBUG: After filtering: {len(detected_faces)} high-confidence faces")
    
    if not detected_faces:
        return []

    # Get ChromaDB collection
    try:
        collection = get_face_collection()
    except Exception as e:
        print(f"Error connecting to ChromaDB: {e}")
        return []

    results = []

    for idx, face_data in enumerate(detected_faces):
        current_emb = face_data["embedding"]
        current_bbox = face_data["bbox"]
        det_score = face_data.get("det_score", 1.0)

        # Query ChromaDB for top 3 matches to improve accuracy
        # Filter by user_id if provided
        where_filter = {"user_id": user_id} if user_id else None
        
        try:
            # Check if collection is empty first
            collection_count = collection.count()
            
            if collection_count == 0:
                print(f"DEBUG: Collection is empty, marking face {idx} as Unknown")
                query_result = None
            else:
                # Query for top 1 match for maximum speed
                n_results = 1
                query_result = collection.query(
                    query_embeddings=[current_emb],
                    n_results=n_results,
                    where=where_filter
                )
        except Exception as e:
            print(f"Error querying ChromaDB: {e}")
            query_result = None

        best_match = None
        best_score = -1
        
        # Process query results with improved matching logic
        if query_result and query_result['ids'] and len(query_result['ids'][0]) > 0:
            # Check all returned matches
            for i in range(len(query_result['ids'][0])):
                distance = query_result['distances'][0][i]
                similarity = 1.0 - distance
                metadata = query_result['metadatas'][0][i]
                
                print(f"DEBUG: Face {idx} candidate {i}: {metadata.get('name')} (sim: {similarity:.3f})")
                
                # Use the best match above threshold
                if similarity > threshold and similarity > best_score:
                    best_score = similarity
                    best_match = metadata

        if best_match is None:
            result = {
                "name": "Unknown", 
                "relation": "Unidentified Person", 
                "confidence": float(best_score) if best_score > 0 else 0.0,
                "bbox": current_bbox,
                "face_index": idx,
                "det_score": det_score
            }
            score_display = best_score if best_score > 0 else 0.0
            print(f"DEBUG: Face {idx} -> Unknown (best score: {score_display:.3f}, det: {det_score:.3f})")
            results.append(result)
        else:
            match_result = {
                "name": best_match["name"],
                "relation": best_match["relation"],
                "confidence": float(best_score),
                "bbox": current_bbox,
                "face_index": idx,
                "det_score": det_score
            }
            # Include contact_id if available
            if "contact_id" in best_match:
                match_result["contact_id"] = best_match["contact_id"]
            
            print(f"DEBUG: Face {idx} -> {best_match['name']} (confidence: {best_score:.3f}, det: {det_score:.3f})")
            results.append(match_result)
    
    # Sort results by confidence (highest first) for better display
    results.sort(key=lambda x: x.get("confidence", 0), reverse=True)
    
    print(f"DEBUG: recognize_face - Returning {len(results)} results")
    return results

def sync_embeddings_from_db(app, db_session):
    """
    Sync face embeddings from database contacts with profile photos.
    This is the ONLY way to register faces - all photos must be added through the contacts page.
    This function pushes embeddings to ChromaDB.
    """
    from app.models import Contact
    
    # Get all contacts with profile photos
    contacts = db_session.query(Contact).filter(
        Contact.profile_photo.isnot(None),
        Contact.is_active == True
    ).all()
    
    # Get ChromaDB collection
    try:
        collection = get_face_collection()
    except Exception as e:
        return {"success": False, "error": f"Failed to connect to ChromaDB: {str(e)}"}
    
    count = 0
    errors = []
    
    # Prepare batch data
    ids = []
    embeddings = []
    metadatas = []
    
    for contact in contacts:
        if not contact.profile_photo:
            print(f"Warning: No photo data for {contact.name}")
            continue
            
        # Convert binary data to OpenCV image
        nparr = np.frombuffer(contact.profile_photo, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            print(f"Error: Could not decode image for {contact.name}")
            continue
        
        # Extract embedding
        data_list = detect_and_embed(app, img)
        if not data_list:
            print(f"Error: No face detected for {contact.name}")
            continue
        
        # Use the first detected face for the profile
        data = data_list[0]
        
        # Add to batch
        ids.append(f"contact_{contact.id}")
        embeddings.append(data["embedding"])
        metadatas.append({
            "name": contact.name,
            "relation": contact.relationship_detail or contact.relationship,
            "contact_id": contact.id,
            "user_id": contact.user_id
        })
        count += 1
    
    # Upsert to ChromaDB
    if ids:
        try:
            collection.upsert(
                ids=ids,
                embeddings=embeddings,
                metadatas=metadatas
            )
            print(f"Successfully synced {len(ids)} face embeddings to ChromaDB")
            return {"success": True, "count": len(ids)}
        except Exception as e:
            print(f"Error upserting to ChromaDB: {e}")
            return {"success": False, "error": str(e)}
    else:
        return {"success": True, "count": 0}
