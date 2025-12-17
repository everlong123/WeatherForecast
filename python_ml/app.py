"""
Flask API Server cho Weather Prediction Model
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from weather_predictor import predictor
import os

app = Flask(__name__)
CORS(app)  # Cho phép CORS để Spring Boot có thể gọi

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'message': 'Weather Prediction Service is running'})

@app.route('/predict', methods=['POST'])
def predict():
    """
    Dự đoán thời tiết
    
    Request body:
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
    
    Response:
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
            },
            ...
        ]
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400
        
        # Validate required fields
        required_fields = ['temperature', 'humidity', 'pressure', 'windSpeed', 'cloudiness']
        for field in required_fields:
            if field not in data:
                return jsonify({'success': False, 'error': f'Missing field: {field}'}), 400
        
        hours_ahead = data.get('hoursAhead', 24)
        if hours_ahead < 1 or hours_ahead > 168:  # Max 7 days
            hours_ahead = 24
        
        # Predict
        predictions = predictor.predict(data, hours_ahead)
        
        if predictions is None:
            return jsonify({'success': False, 'error': 'Model not available'}), 500
        
        return jsonify({
            'success': True,
            'predictions': predictions
        })
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/retrain', methods=['POST'])
def retrain():
    """
    Retrain model với dữ liệu lịch sử mới
    
    Request body:
    {
        "historicalData": [
            {
                "temperature": 28.5,
                "humidity": 75,
                "pressure": 1015,
                "windSpeed": 3.5,
                "cloudiness": 60,
                "recordedAt": "2024-01-15T10:00:00"
            },
            ...
        ]
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'historicalData' not in data:
            return jsonify({'success': False, 'error': 'No historical data provided'}), 400
        
        historical_data = data['historicalData']
        predictor.retrain_model(historical_data)
        
        return jsonify({
            'success': True,
            'message': 'Model retrained successfully'
        })
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    # Tạo thư mục models nếu chưa có
    os.makedirs('models', exist_ok=True)
    
    # Chạy server
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)

