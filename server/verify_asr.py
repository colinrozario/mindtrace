import time
import collections
import numpy as np
import sys
import os
import torch

# Limit CPU threads to prevent resource exhaustion/crashes
torch.set_num_threads(4)

# Add server directory to path so we can import app modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from ai_engine.asr import AudioStream, VADEngine, ASREngine, ConversationStore, ConversationLinker

def verify_asr():
    print("Initializing ASR System...")
    
    # Initialize components
    audio_stream = AudioStream()
    vad_engine = VADEngine()
    asr_engine = ASREngine(model_size="tiny") # Use 'tiny' for speed/memory in verification
    store = ConversationStore()
    linker = ConversationLinker(store)
    
    print("\n--- ASR Verification ---")
    print("Please speak into the microphone. Press Ctrl+C to stop.")
    print("Listening...")
    
    audio_stream.start_stream()
    
    # Buffer for audio frames
    buffer = collections.deque()
    triggered = False
    silence_frames = 0
    
    try:
        while True:
            frame_data = audio_stream.get_frame()
            if frame_data is None:
                continue
                
            is_speech = vad_engine.is_speech(frame_data.tobytes())
            
            if is_speech:
                if not triggered:
                    print("\n[Speech Detected] Recording...", end="", flush=True)
                    triggered = True
                buffer.append(frame_data)
                silence_frames = 0
                sys.stdout.write(".")
                sys.stdout.flush()
            else:
                if triggered:
                    # Silence detected while recording
                    silence_frames += 1
                    buffer.append(frame_data) # Keep recording silence for a bit
                    
                    # Calculate silence duration
                    silence_duration_ms = silence_frames * 30 # Approx 30ms per frame
                    
                    if silence_duration_ms > 1000: # Wait for 1 second of silence
                        # Speech ended
                        print("\n[Silence Detected] Processing...")
                        triggered = False
                        silence_frames = 0
                        
                        # Convert buffer to single numpy array
                        if len(buffer) > 0:
                            # Stack frames into a single array
                            # frame_data is int16, we need float32 for Whisper
                            audio_int16 = np.concatenate(list(buffer))
                            audio_float32 = audio_int16.astype(np.float32) / 32768.0
                            
                            # Save to file for debugging/stability
                            from scipy.io import wavfile
                            
                            # Ensure data dir exists
                            data_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
                            os.makedirs(data_dir, exist_ok=True)
                            wav_path = os.path.join(data_dir, "debug_audio.wav")
                            
                            print(f"Saving to {wav_path}...", end="", flush=True)
                            wavfile.write(wav_path, 16000, audio_int16) # Write original int16 data
                            print(" Done.")
                            
                            # Transcribe
                            try:
                                print(f"Transcribing in-memory audio...", end="", flush=True)
                                # Transcribe raw float32 array instead of file to avoid ffmpeg dependency
                                transcript = asr_engine.transcribe_audio_chunk(audio_float32)
                                print(" Done.")
                                print(f"Transcript: \"{transcript}\"")
                                
                                # Save (using a dummy profile ID)
                                if transcript:
                                    linker.link_and_save("verification_user", transcript)
                                    print("Saved to conversation store.")
                            except Exception as e:
                                print(f"Error during transcription: {e}")
                            
                            buffer.clear()
                    
    except KeyboardInterrupt:
        print("\nStopping...")
    finally:
        audio_stream.stop_stream()
        print("Done.")

if __name__ == "__main__":
    verify_asr()
