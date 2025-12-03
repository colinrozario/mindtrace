import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.routers import face_routes

load_dotenv()

CLIENT_URL = os.getenv("CLIENT_URL", "http://localhost:5173")

app = FastAPI(
    title="MindTrace",
    version="1.0",
    description="API for RAG ChatBot",
)

origins = [
    CLIENT_URL,
    "http://localhost:5173",
    "http://localhost:5174", # glass-client might run here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.include_router(face_routes.router, prefix="/api/face", tags=["Face Recognition"])

@app.get("/")
def server_status():
    return JSONResponse(content={ "message": "Server is live" }, status_code=200)
