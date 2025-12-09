
import sys
import os
import time
import numpy as np

# Ensure we can import from ai_engine
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from ai_engine.asr import ASREngine

def test_asr():
    print("Initializing ASR Engine...")
    start_init = time.time()
    try:
        engine = ASREngine(model_size="base.en")
        print(f"ASR Init took: {time.time() - start_init:.2f}s")
    except Exception as e:
        print(f"ASR Init failed: {e}")
        return

    # Generate dummy audio (16kHz, 5 seconds of silence/noise)
    print("Generating 5s of dummy audio...")
    sr = 16000
    duration = 5
    # Sine wave at 440Hz
    t = np.linspace(0, duration, int(sr * duration), False)
    # A simple sentence "Hello world" is hard to synthesize, so we use pure tone
    # The model might transcribe it as music or hallucinate, but it checks if it runs.
    audio = np.sin(440 * 2 * np.pi * t).astype(np.float32)
    
    # Normalize like in code
    audio = audio / np.abs(audio).max() * 0.95

    print(f"Transcribing {duration}s audio...")
    start_trans = time.time()
    try:
        text = engine.transcribe_audio_chunk(audio)
        print(f"Transcription took: {time.time() - start_trans:.2f}s")
        print(f"Result: '{text}'")
    except Exception as e:
        print(f"Transcription failed: {e}")

if __name__ == "__main__":
    test_asr()
