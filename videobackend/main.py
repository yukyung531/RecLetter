from fastapi import FastAPI

from videobackend.LetterVideoController import letter_video_router

app = FastAPI()

app.include_router(letter_video_router, prefix="/video")
