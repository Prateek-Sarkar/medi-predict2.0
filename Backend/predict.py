import os

# Use legacy Keras 2 (tf_keras) for compatibility with saved models
os.environ['TF_USE_LEGACY_KERAS'] = '1'

import numpy as np
import tensorflow as tf
from PIL import Image

# Base directory
BASE_DIR = os.path.dirname(__file__)

# Model paths
eye_model_path = os.path.join(BASE_DIR, "models", "Classifir_image_model.h5")
disease_model_path = os.path.join(BASE_DIR, "models", "DenseNet121_model.h5")

# Load models
eye_classifier = tf.keras.models.load_model(eye_model_path)
disease_model = tf.keras.models.load_model(disease_model_path)

IMG_SIZE = 224

# Disease classes
disease_classes = [
"Cataract",
"Central Serous Chorioretinopathy",
"Conjunctivitis",
"Diabetic Retinopathy",
"Disc Edema",
"Eyelid",
"Glaucoma",
"Healthy_Eye",
"Healthy_Eye1",
"Macular Scar",
"Myopia",
"Pterygium",
"Retinal Detachment",
"Retinitis Pigmentosa",
"Strabismus",
"Uveitis"
]


def preprocess_image(image_path):

    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image not found: {image_path}")

    img = Image.open(image_path).convert("RGB")
    img = img.resize((IMG_SIZE, IMG_SIZE))

    img = np.array(img) / 255.0
    img = np.expand_dims(img, axis=0)

    return img


def predict_image(image_path):

    img = preprocess_image(image_path)

    # -------- Step 1: Eye / Non-Eye classifier --------
    eye_prob = eye_classifier.predict(img)[0][0]

    print("Eye classifier probability:", eye_prob)

    # Mapping from training:
    # 0 → Non-eye
    # 1 → Eye

    threshold = 0.5

    if eye_prob < threshold:
        return {
            "status": "error",
            "message": "Please upload a valid fundus eye image."
        }

    # -------- Step 2: Disease prediction --------
    disease_pred = disease_model.predict(img)
    disease_pred_probs = disease_pred[0]
    top_3_indices = np.argsort(disease_pred_probs)[-3:][::-1]

    top_predictions = []
    for idx in top_3_indices:
        disease_name = disease_classes[idx]
        if disease_name in ["Healthy_Eye", "Healthy_Eye1"]:
            disease_name = "Healthy Eye"
        else:
            disease_name = disease_name.replace("_", " ")
            
        confidence = float(disease_pred_probs[idx])
        top_predictions.append({
            "disease": disease_name,
            "confidence": round(confidence * 100, 2)
        })

    return {
        "status": "success",
        "top_predictions": top_predictions
    }