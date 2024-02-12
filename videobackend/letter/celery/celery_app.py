from celery import Celery

from videobackend.letter.config.kafka_config import KAFKA_BOOTSTRAP_SERVERS

celery_app = Celery("tasks")