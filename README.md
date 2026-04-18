# 🏎️ F1 Pulse — AI-Powered Race Intelligence System

F1 Pulse is a full-stack AI-driven platform that analyzes Formula 1 race data and generates intelligent predictions, insights, and simulations for driver performance.

---

## 🚀 Features

### 🧠 AI Intelligence Engine

* Dual-model architecture:

  * **XGBoost** → Race outcome prediction
  * **Random Forest** → Performance trend analysis
* AI Orchestrator combines both models for:

  * Prediction comparison
  * Conflict detection
  * Insight generation

### 📊 Smart Insights

* Confidence scoring (Low / Medium / High)
* Simulation impact analysis (Positive / Negative / Neutral)
* Context-aware insights:

  * Consistency detection
  * Performance instability
  * Model disagreement handling

---

## 🏗️ Architecture

```
Spring Boot Backend → Python ML Layer → AI Orchestrator → Response Engine
```

### Flow:

1. Fetch race data from database
2. Compute statistical features
3. Send structured JSON to Python ML
4. Run multiple models
5. Generate predictions + insights
6. Return enriched response via API

---

## ⚙️ Tech Stack

### Backend

* Java + Spring Boot
* REST APIs
* JPA / Hibernate
* PostgreSQL

### Machine Learning

* Python
* XGBoost
* Random Forest
* NumPy / Pandas
* Joblib (model loading)

### Integration

* Java ↔ Python using ProcessBuilder
* JSON-based communication (STDIN / STDOUT)

---

## 🧪 Example API

### GET /api/ai/driver-intelligence/{driverId}

Response:

```json
{
  "driverId": 47,
  "rfPrediction": 7.83,
  "xgbPrediction": 1.88,
  "confidence": 0.001,
  "confidenceLabel": "low",
  "simulationImpact": "positive",
  "finalInsight": "Model predictions are conflicting — race outcome is highly uncertain"
}
```

---

## 🧠 Key Engineering Highlights

* Built a **multi-model AI system**, not just a single model
* Designed a **custom orchestration layer** for ML decision-making
* Implemented **cross-language execution (Java ↔ Python)**
* Developed **feature engineering pipeline** from raw race data
* Added **explainability layer** (confidence + insights)

---

## ⚠️ Challenges Solved

* Handling Python subprocess execution from Java
* Fixing JSON input/output pipeline issues
* Preventing null/empty responses from ML layer
* Ensuring robust error handling across services

---

## 🔮 Future Improvements

* Frontend dashboard (React + Tailwind)
* Feature importance visualization
* Real-time race simulation
* Deployment (Docker + Cloud)

---

## 👨‍💻 Author

**Mohammad Adnan Shakil**

* GitHub: https://github.com/Mohammad-Adnan-Shakil
* LinkedIn: https://linkedin.com/in/Mohammad-Adnan-Shakil
