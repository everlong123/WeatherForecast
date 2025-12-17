# Weather Prediction ML Service

Service Python sử dụng Machine Learning để dự đoán thời tiết.

## Cài đặt

1. Cài đặt Python 3.8+ và pip

2. Cài đặt dependencies:
```bash
pip install -r requirements.txt
```

## Chạy service

```bash
python app.py
```

Service sẽ chạy tại: http://localhost:5000

## API Endpoints

### 1. Health Check
```
GET /health
```

### 2. Dự đoán thời tiết
```
POST /predict
Content-Type: application/json

{
    "temperature": 28.5,
    "humidity": 75,
    "pressure": 1015,
    "windSpeed": 3.5,
    "cloudiness": 60,
    "latitude": 10.8231,
    "longitude": 106.6297,
    "hoursAhead": 24
}
```

Response:
```json
{
    "success": true,
    "predictions": [
        {
            "datetime": "2024-01-15 14:00:00",
            "temperature": 29.2,
            "humidity": 73,
            "windSpeed": 3.8,
            "pressure": 1015,
            "cloudiness": 65,
            "mainWeather": "Clouds",
            "description": "Có mây"
        }
    ]
}
```

### 3. Retrain Model
```
POST /retrain
Content-Type: application/json

{
    "historicalData": [
        {
            "temperature": 28.5,
            "humidity": 75,
            "pressure": 1015,
            "windSpeed": 3.5,
            "cloudiness": 60,
            "recordedAt": "2024-01-15T10:00:00"
        }
    ]
}
```

## Model

- **Algorithm**: Random Forest Regressor
- **Features**: Month, Hour, Humidity, Pressure, Wind Speed, Cloudiness
- **Target**: Temperature
- **Model file**: `models/weather_model.pkl`
- **Scaler file**: `models/scaler.pkl`

## Tích hợp với Spring Boot

Spring Boot backend sẽ gọi service này qua HTTP REST API.

