#!/usr/bin/env python3
"""
Race prediction entrypoint used by Spring Boot.
Loads ML models and returns a normalized response payload.
"""

import json
import sys
from pathlib import Path

import joblib
import numpy as np
import pandas as pd

BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "models"


class PredictionError(Exception):
    pass


def load_models():
    try:
        rf_model = joblib.load(MODEL_DIR / "rf_model.pkl")
        xgb_model = joblib.load(MODEL_DIR / "xgb_model.pkl")
        le_driver = joblib.load(MODEL_DIR / "le_driver.pkl")
        return rf_model, xgb_model, le_driver
    except Exception as exc:
        raise PredictionError(f"Model loading failed: {exc}") from exc


def safe_scale(value, fallback=0.0):
    try:
        return float(value)
    except Exception:
        return float(fallback)


def encode_driver(le_driver, value=0):
    try:
        return le_driver.transform([value])[0]
    except Exception:
        return 0


def clamp(value, low, high):
    return max(low, min(high, value))


def main():
    try:
        raw_input = sys.stdin.read().strip()
        if not raw_input:
            raise PredictionError("No input provided")

        payload = json.loads(raw_input)

        grid_position = clamp(safe_scale(payload.get("gridPosition"), 10), 1, 20)
        driver_form = clamp(safe_scale(payload.get("driverForm"), 5), 0, 10)
        team_performance = clamp(safe_scale(payload.get("teamPerformance"), 5), 0, 10)
        track_affinity = clamp(safe_scale(payload.get("trackAffinity"), 5), 0, 10)

        rf_model, xgb_model, le_driver = load_models()

        recent_avg_last_5 = clamp(20.0 - (driver_form * 1.5), 1, 20)
        recent_std_last_5 = max(0.2, (10.0 - driver_form) / 3.5)
        avg_last_10 = clamp((recent_avg_last_5 + grid_position) / 2.0, 1, 20)
        std_last_10 = max(recent_std_last_5, abs(grid_position - recent_avg_last_5) / 4.0)

        rf_features = pd.DataFrame([{
            "driver_id": encode_driver(le_driver, 0),
            "avg_last_5": recent_avg_last_5,
            "std_last_5": recent_std_last_5,
            "avg_last_10": avg_last_10,
            "std_last_10": std_last_10,
            "last_race_position": grid_position,
        }])

        xgb_features = np.array([[
            grid_position,
            0.0,
            0.0,
            2026.0,
            recent_avg_last_5,
            recent_std_last_5,
            grid_position,
            0.0,
        ]])

        rf_prediction = float(rf_model.predict(rf_features)[0])
        xgb_prediction = float(xgb_model.predict(xgb_features)[0])
        blended = clamp((rf_prediction + xgb_prediction) / 2.0, 1, 20)

        disagreement = abs(rf_prediction - xgb_prediction)
        input_quality = (driver_form + team_performance + track_affinity) / 30.0
        confidence = clamp((1.0 - disagreement / 20.0) * 0.7 + input_quality * 0.3, 0.2, 0.95)

        output = {
            "predictedPosition": round(blended, 2),
            "confidence": round(confidence, 3),
            "rf_prediction": round(rf_prediction, 2),
            "xgb_prediction": round(xgb_prediction, 2),
            "model_agreement": round(1.0 - clamp(disagreement / 20.0, 0, 1), 3),
        }

        print(json.dumps(output))

    except PredictionError as exc:
        print(json.dumps({"error": str(exc)}))
        sys.exit(1)
    except json.JSONDecodeError as exc:
        print(json.dumps({"error": f"Invalid JSON input: {exc}"}))
        sys.exit(1)
    except Exception as exc:
        print(json.dumps({"error": f"Prediction failed: {exc}"}))
        sys.exit(1)


if __name__ == "__main__":
    main()
