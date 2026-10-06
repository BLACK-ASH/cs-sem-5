import sys
import tensorflow as tf
from keras.applications import MobileNetV2
from keras.applications.imagenet_utils import decode_predictions
from keras.applications.mobilenet_v2 import preprocess_input

DOG_CLASS = range(151,269)
CAT_CLASS = range(281,286)

model = MobileNetV2(weights="imagenet")

def main(path):
    img = tf.image.decode_image(tf.io.read_file(path),channels=3)
    img = tf.image.resize(img,(224,224)) 

    x = tf.expand_dims(preprocess_input(img),0)
    preds = model.predict(x,verbose=0)

    idx = preds.argmax()
    name = decode_predictions(preds,top=1)[0][0][1]

    if idx in CAT_CLASS:
        label = "cat"
    elif idx in DOG_CLASS:
        label = "dog"
    else:
        label = "neither"

    print(f"{name} : {label}")

if __name__ == "__main__":
    main(sys.argv[1])

# RUN - python filename.py image-name.py
