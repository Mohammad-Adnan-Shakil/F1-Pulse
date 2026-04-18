import sys
import json
import joblib
import numpy as np
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "models")

try:
    model = joblib.load(os.path.join(MODEL_DIR, "xgb_model.pkl"))
    le_constructor = joblib.load(os.path.join(MODEL_DIR, "le_constructor.pkl"))
    le_track = joblib.load(os.path.join(MODEL_DIR, "le_track.pkl"))
except Exception as e:
    print(json.dumps({"error": f"Model loading failed: {str(e)}"}))
    sys.exit(1)


try:
    input_json = json.loads(sys.stdin.read())
except Exception as e:
    print(json.dumps({"error": f"Invalid input: {str(e)}"}))
    sys.exit(1)


required_fields = [
    "qualifying_position",
    "constructor_id",
    "track_id",
    "season_year",
    "recent_avg_position_last_5",
    "recent_std_last_5",
    "grid_position",
    "is_home_race"
]

missing_fields = [f for f in required_fields if f not in input_json]

if missing_fields:
    print(json.dumps({"error": f"Missing fields: {missing_fields}"}))
    sys.exit(1)


def safe_encode(encoder, value):
    try:
        return encoder.transform([value])[0]
    except:
        return 0


constructor_encoded = safe_encode(le_constructor, input_json["constructor_id"])
track_encoded = safe_encode(le_track, input_json["track_id"])

try:
    features = np.array([[ 
        float(input_json["qualifying_position"]),
        float(constructor_encoded),
        float(track_encoded),
        float(input_json["season_year"]),
        float(input_json["recent_avg_position_last_5"]),
        float(input_json["recent_std_last_5"]),
        float(input_json["grid_position"]),
        float(input_json["is_home_race"])
    ]])

    prediction = float(model.predict(features)[0])

    # Confidence (heuristic)
    variance_proxy = float(np.std(features))
    confidence = 1 / (1 + variance_proxy)
    confidence = max(0.0, min(1.0, confidence))

    if confidence > 0.75:
        confidence_label = "high"
    elif confidence > 0.5:
        confidence_label = "medium"
    else:
        confidence_label = "low"

except Exception as e:
    print(json.dumps({"error": f"Prediction failed: {str(e)}"}))
    sys.exit(1)


output = {
    "predicted_position": round(prediction, 2),
    "confidence": round(confidence, 3),
    "confidence_label": confidence_label
}

print(json.dumps(output))