import sys
import json

def predict(data):
    # simple logic (placeholder for ML model)

    grid = data.get("gridPosition", 0)
    form = data.get("driverForm", 0)
    team = data.get("teamPerformance", 0)
    track = data.get("trackAffinity", 0)

    score = (0.4 * grid) + (0.3 * form) + (0.2 * team) + (0.1 * track)

    predicted_position = max(1, 20 - score)

    return {
        "predictedPosition": round(predicted_position, 2),
        "confidence": "MEDIUM"
    }

if __name__ == "__main__":
    try:
        # 🔥 FIX: handle PowerShell + multi-arg input properly
        input_json = " ".join(sys.argv[1:])

        # Debug (optional - remove later)
        # print("RAW INPUT:", input_json)

        data = json.loads(input_json)

        result = predict(data)

        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({
            "error": str(e)
        }))

        