from threading import Thread

from dotenv.main import load_dotenv
from fastapi import FastAPI

from videobackend.letter.thread.tasks import download_assets, encode_letter, \
    upload_letter, delete_assets
from videobackend.letter.controller.letter_video_controller import letter_video_router

load_dotenv(dotenv_path="./.env")

thread1 = Thread(target=download_assets)
thread2 = Thread(target=encode_letter)
thread3 = Thread(target=upload_letter)
thread4 = Thread(target=delete_assets)

thread1.start()
thread2.start()
thread3.start()
thread4.start()

app = FastAPI()

app.include_router(letter_video_router, prefix="/video")
