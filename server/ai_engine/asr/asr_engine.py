import whisper
import numpy as np
import torch
import os
from typing import Union

class ASREngine:
    def __init__(self, model_size: str = "base"):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"Loading Whisper model '{model_size}' on {self.device}...")
        self.model = whisper.load_model(model_size, device=self.device)
        print("Whisper model loaded.")

    def transcribe_audio_chunk(self, audio_data: Union[np.ndarray, str]) -> str:
        """
        Transcribe a chunk of audio data.
        
        Args:
            audio_data: Numpy array of audio samples (16kHz, mono, float32 normalized to -1.0 to 1.0) OR path to audio file
        
        Returns:
            Transcribed text.
        """
        if not isinstance(audio_data, str):
            if len(audio_data) == 0:
                return ""

            # Whisper expects float32 audio
            if audio_data.dtype != np.float32:
                audio_data = audio_data.astype(np.float32)

        # Use the high-level transcribe method which is more robust
        # fp16=True for CUDA (faster), False for CPU (required)
        use_fp16 = self.device == "cuda"
        # Force language to English as requested
        result = self.model.transcribe(audio_data, fp16=use_fp16, language="en")
        return result["text"].strip()
