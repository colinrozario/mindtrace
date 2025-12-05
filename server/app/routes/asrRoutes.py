from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import numpy as np
import sys
import os
import torch
import logging

# Ensure we can import from ai_engine
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from ai_engine.asr import ASREngine, ConversationStore, ConversationLinker

router = APIRouter(
    prefix="/asr",
    tags=["ASR"]
)

# Initialize engines
# Use 'base.en' model which is optimized for English (better accuracy/speed than generic base)
try:
    asr_engine = ASREngine(model_size="base.en")
    print("ASR Engine initialized in routes.")
except Exception as e:
    print(f"Failed to initialize ASR Engine: {e}")
    asr_engine = None

store = ConversationStore()
linker = ConversationLinker(store)

@router.websocket("/{profile_id}")
async def websocket_asr(websocket: WebSocket, profile_id: str):
    await websocket.accept()
    print(f"ASR WebSocket connected for profile: {profile_id}")
    
    audio_buffer = []
    chunk_counter = 0
    TRANSCRIBE_INTERVAL_CHUNKS = 3 # Approx 0.75 second (Faster updates)
    RMS_THRESHOLD = 0.003 # Tuned for responsiveness vs noise

    try:
        while True:
            # Receive raw bytes (float32 PCM)
            data = await websocket.receive_bytes()
            
            # Convert bytes to numpy array (float32)
            chunk = np.frombuffer(data, dtype=np.float32)
            audio_buffer.append(chunk)
            chunk_counter += 1
            
            # --- Incremental Transcription for Subtitles ---
            if chunk_counter >= TRANSCRIBE_INTERVAL_CHUNKS and asr_engine:
                chunk_counter = 0
                try:
                    # Transcribe last 5 seconds (approx 80000 samples)
                    # or whatever is available
                    current_full = np.concatenate(audio_buffer)
                    
                    # Take last 80000 samples (5s) for context, or less if start
                    transcribe_window = current_full[-80000:] if len(current_full) > 80000 else current_full
                    
                    # VAD: Check Energy Level (RMS)
                    rms = np.sqrt(np.mean(transcribe_window**2))
                    if len(transcribe_window) > 4800 and rms > RMS_THRESHOLD:
                        transcript = asr_engine.transcribe_audio_chunk(transcribe_window)
                        if transcript:
                            await websocket.send_json({
                                "type": "subtitle",
                                "text": transcript
                            })
                except Exception as e:
                    print(f"Incremental transcribe error: {e}")
            # -----------------------------------------------

    except WebSocketDisconnect:
        print(f"ASR WebSocket disconnected for {profile_id}. Transcribing full conversation...")
        
        # Process the buffer if we have audio
        if audio_buffer and asr_engine:
            try:
                # Concatenate all chunks
                full_audio = np.concatenate(audio_buffer)
                
                print(f"Total audio samples: {len(full_audio)}")
                
                if len(full_audio) > 4800: # Ensure at least 0.3 seconds of audio
                    print(f"Final Processing of {len(full_audio)} samples")
                    transcript = asr_engine.transcribe_audio_chunk(full_audio)
                    print(f"Final Transcript: {transcript}")
                    
                    if transcript:
                        linker.link_and_save(profile_id, transcript)
                else:
                    print("Audio too short to transcribe.")
                    
            except Exception as e:
                print(f"Error processing audio buffer: {e}")
                import traceback
                traceback.print_exc()
        
    except Exception as e:
        print(f"WebSocket Error: {e}")

