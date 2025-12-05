import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Glasses, Monitor } from 'lucide-react';
import HUDOverlay from '../components/HUDOverlay';

const FaceRecognition = () => {
    const [mode, setMode] = useState('standard'); // 'standard' or 'rayban'

    // Recognition State
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [recognitionResult, setRecognitionResult] = useState(null);
    const intervalRef = useRef(null);
    const [debugStatus, setDebugStatus] = useState("Init...");
    const lastResultRef = useRef(null);
    const timeoutRef = useRef(null);

    const [subtitle, setSubtitle] = useState("");
    
    // Start Camera
    const startCamera = async () => {
        try {
            setDebugStatus("Requesting Camera...");
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                // Wait for video metadata to load before playing
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current.play().catch(err => {
                        console.error("Error playing video:", err);
                        setDebugStatus(`Play Err: ${err.message}`);
                    });
                    setDebugStatus("Camera Active");
                };
            } else {
                setDebugStatus("Err: No Video Ref");
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            setDebugStatus(`Cam Err: ${err.message}`);
        }
    };

    const isProcessingRef = useRef(false);
    const loopActiveRef = useRef(false);

    const captureFrame = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            if (video.videoWidth === 0 || video.videoHeight === 0) return null;

            // Resize to max 640px width to reduce bandwidth and server load
            const MAX_WIDTH = 640;
            let width = video.videoWidth;
            let height = video.videoHeight;

            if (width > MAX_WIDTH) {
                height = Math.round((height * MAX_WIDTH) / width);
                width = MAX_WIDTH;
            }

            canvas.width = width;
            canvas.height = height;
            context.drawImage(video, 0, 0, width, height);

            return new Promise(resolve => {
                canvas.toBlob(blob => {
                    resolve(blob);
                }, 'image/jpeg', 0.8); // Add quality compression
            });
        }
        return null;
    };

    const calculatePosition = (bbox) => {
        if (!videoRef.current || !bbox) return null;

        const video = videoRef.current;
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;
        
        const MAX_WIDTH = 640;
        let sentWidth = videoWidth;
        let sentHeight = videoHeight;
        if (videoWidth > MAX_WIDTH) {
            sentHeight = Math.round((videoHeight * MAX_WIDTH) / videoWidth);
            sentWidth = MAX_WIDTH;
        }

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        // Calculate scale to maintain aspect ratio (object-cover)
        const scale = Math.max(screenWidth / videoWidth, screenHeight / videoHeight);
        
        // bbox is [x1, y1, x2, y2] based on sentWidth/sentHeight
        const [x1, y1, x2, y2] = bbox;

        // Normalize to 0..1
        const nX1 = x1 / sentWidth;
        const nY1 = y1 / sentHeight;
        const nX2 = x2 / sentWidth;
        const nY2 = y2 / sentHeight;

        // Map to video element scale (which matches screen via object-cover usually)
        // But object-cover cuts off parts.
        
        // Let's go step by step:
        // 1. Video frame scaling to screen
        const scaledWidth = videoWidth * scale; // Width of video on screen
        const scaledHeight = videoHeight * scale; // Height of video on screen
        const xOffset = (screenWidth - scaledWidth) / 2;
        const yOffset = (screenHeight - scaledHeight) / 2;

        // 2. Map normalized coords to scaled video dimensions
        const screenX = nX1 * scaledWidth + xOffset;
        const screenY = nY1 * scaledHeight + yOffset;
        const screenW = (nX2 - nX1) * scaledWidth;
        const screenH = (nY2 - nY1) * scaledHeight;

        return {
            left: screenX,
            top: screenY,
            width: screenW,
            height: screenH
        };
    };

    // --- Audio / ASR Logic ---
    const audioContextRef = useRef(null);
    const processorRef = useRef(null);
    const audioInputRef = useRef(null);
    const wsRef = useRef(null);
    const isRecordingRef = useRef(false);

    const startRecording = async (profileId) => {
        if (isRecordingRef.current) return;
        
        try {
            console.log("Starting ASR for:", profileId);
            isRecordingRef.current = true;
            
            // Connect WebSocket
            // Use standard WS URL construction based on current page or env
            const wsUrl = `ws://localhost:8000/asr/${encodeURIComponent(profileId)}`;
            wsRef.current = new WebSocket(wsUrl);
            
            wsRef.current.onopen = () => {
                console.log("ASR WS Open");
            };
            
            wsRef.current.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === 'subtitle') {
                         setSubtitle(data.text);
                    }
                } catch (e) {
                    console.error("WS Parse Err", e);
                }
            };
            
            wsRef.current.onerror = (e) => {
                console.error("ASR WS Error", e);
            };

            // Start Audio
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
            audioInputRef.current = audioContextRef.current.createMediaStreamSource(stream);
            
            // Create ScriptProcessor (bufferSize, inputChannels, outputChannels)
            processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);
            
            processorRef.current.onaudioprocess = (e) => {
                if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
                
                const inputData = e.inputBuffer.getChannelData(0);
                // Send raw float32 data
                wsRef.current.send(inputData);
            };
            
            audioInputRef.current.connect(processorRef.current);
            processorRef.current.connect(audioContextRef.current.destination); // Needed for processing to happen
            
        } catch (err) {
            console.error("Error starting audio:", err);
            isRecordingRef.current = false;
        }
    };

    const stopRecording = () => {
        if (!isRecordingRef.current) return;
        
        console.log("Stopping ASR...");
        isRecordingRef.current = false;
        
        // Clear subtitle shortly after stopping, or keep it?
        // Let's keep it for a bit then clear
        setTimeout(() => setSubtitle(""), 3000);
        
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
        
        if (processorRef.current) {
            processorRef.current.disconnect();
            processorRef.current = null;
        }
        
        if (audioInputRef.current) {
            audioInputRef.current.disconnect(); 
            audioInputRef.current = null;
        }
        
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
    };

    // --- End Audio Logic ---

    useEffect(() => {
        return () => {
             stopRecording(); // Cleanup on unmount
        }
    }, []);

    // ... existing refs and logic ...

    const processFrame = async () => {
        if (!loopActiveRef.current) return;
        
        if (isProcessingRef.current) {
            requestAnimationFrame(processFrame);
            return;
        }

        if (!videoRef.current || videoRef.current.paused || videoRef.current.ended || videoRef.current.readyState < 2) {
             setTimeout(processFrame, 100);
             return;
        }

        isProcessingRef.current = true;
        
        try {
            const blob = await captureFrame();
            if (!blob) {
                isProcessingRef.current = false;
                setTimeout(processFrame, 100);
                return;
            }

            const formData = new FormData();
            formData.append('file', blob, 'frame.jpg');

            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/face/recognize`, formData);
            const data = response.data;

            const results = Array.isArray(data) ? data : [data];
            const validResults = results.filter(r => r);

            const processedResults = validResults.map((result) => {
                if (result.bbox) {
                    return { ...result, position: calculatePosition(result.bbox) };
                }
                return result;
            });

            if (processedResults.length > 0) {
                setRecognitionResult(processedResults);
                lastResultRef.current = processedResults;
                
                // --- ASR Trigger ---
                // If we detect a face, start recording if not already
                // Use the name of the first person detected as ID
                const name = processedResults[0]?.name || "Unknown";
                if (!isRecordingRef.current) {
                    startRecording(name);
                    setDebugStatus(`REC: ${name}`);
                }
                // -------------------

                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                    timeoutRef.current = null;
                }
            } else {
                setRecognitionResult([]);
                 if (lastResultRef.current && !timeoutRef.current) {
                    timeoutRef.current = setTimeout(() => {
                        lastResultRef.current = null;
                        timeoutRef.current = null;
                        setDebugStatus("Cleared (Timeout)");
                        
                        // --- ASR Stop ---
                        stopRecording();
                        // ----------------
                        
                    }, 1000);
                    setDebugStatus("Persisting");
                } else if (!lastResultRef || !lastResultRef.current) {
                     setDebugStatus("No Faces");
                     
                     // --- ASR Stop (Immediate if no persist) ---
                     if (isRecordingRef.current) {
                         stopRecording();
                     }
                     // ------------------------------------------
                }
            }
        } catch (err) {
            setDebugStatus(`Err: ${err.message}`);
        } finally {
            isProcessingRef.current = false;
            if (loopActiveRef.current) {
                requestAnimationFrame(processFrame);
            }
        }
    };

    const startRecognitionLoop = () => {
        if (loopActiveRef.current) return;
        loopActiveRef.current = true;
        setDebugStatus("Loop Started (Flow Control)");
        processFrame(); 
    };

    useEffect(() => {
        startCamera();
        startRecognitionLoop();
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <div className="relative h-screen w-screen overflow-hidden bg-black">
            {/* Video Feed */}
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* HUD Overlay */}
            <HUDOverlay mode={mode} recognitionResult={recognitionResult} debugStatus={debugStatus} subtitle={subtitle} />

            {/* Controls - Only visible in Standard Mode or on hover */}
            <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 transition-opacity duration-300 ${mode === 'rayban' ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
                <button
                    onClick={() => setMode('standard')}
                    className={`p-4 rounded-2xl backdrop-blur-md border transition-all ${mode === 'standard'
                        ? 'bg-white text-indigo-600 border-white shadow-lg scale-110'
                        : 'bg-white/20 border-white/30 text-white hover:bg-white/30'
                        }`}
                    title="Standard View"
                >
                    <Monitor className="w-6 h-6" />
                </button>

                <button
                    onClick={() => setMode('rayban')}
                    className={`p-4 rounded-2xl backdrop-blur-md border transition-all ${mode === 'rayban'
                        ? 'bg-white text-indigo-600 border-white shadow-lg scale-110'
                        : 'bg-white/20 border-white/30 text-white hover:bg-white/30'
                        }`}
                    title="Ray-Ban Meta Mode"
                >
                    <Glasses className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default FaceRecognition;
