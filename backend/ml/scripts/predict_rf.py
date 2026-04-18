import sys
import json
import joblib
import pandas as pd
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "models")

model = joblib.load(os.path.join(MODEL_DIR, "rf_model.pkl"))
le_driver = joblib.load(os.path.join(MODEL_DIR, "le_driver.pkl"))

try:
    input_json = json.loads(sys.stdin.read())
except Exception:
    print(json.dumps({"error": "Invalid input"}))
    sys.exit(1)


def encode_safe(le, val):
    try:
        return le.transform([val])[0]
    except:
        return 0


driver_encoded = encode_safe(le_driver, input_json["driver_id"])

features = pd.DataFrame([{
    "driver_id": driver_encoded,
    "avg_last_5": input_json["avg_last_5"],
    "std_last_5": input_json["std_last_5"],
    "avg_last_10": input_json["avg_last_10"],
    "std_last_10": input_json["std_last_10"],
    "last_race_position": input_json["last_race_position"]
}])

prediction = model.predict(features)[0]

output = {
    "predicted_next_position": round(float(prediction), 2)
}

print(json.dumps(output))