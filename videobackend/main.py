from dotenv import load_dotenv
from fastapi import FastAPI

from videobackend.letter.controller.LetterVideoController import \
    letter_video_router

load_dotenv(dotenv_path="./.env")

app = FastAPI()

app.include_router(letter_video_router, prefix="/video")
