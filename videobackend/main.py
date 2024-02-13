import os
from threading import Thread

import uvicorn
from dotenv.main import load_dotenv
from fastapi import FastAPI

from videobackend.letter.thread.tasks import download_assets, encode_letter, \
    upload_letter, delete_assets
from videobackend.letter.controller.letter_video_controller import letter_video_router

load_dotenv()
PORT_NUMBER = os.environ.get("PORT_NUMBER")

download_assets_thread = Thread(target=download_assets)
encode_letter_thread = Thread(target=encode_letter)
upload_letter_thread = Thread(target=upload_letter)
delete_assets_thread = Thread(target=delete_assets)

download_assets_thread.start()
encode_letter_thread.start()
upload_letter_thread.start()
delete_assets_thread.start()

app = FastAPI()

app.include_router(letter_video_router, prefix="/video")
