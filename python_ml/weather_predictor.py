"""
Weather Prediction Model using Machine Learning
Dự đoán thời tiết dựa trên dữ liệu lịch sử
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import joblib
import os
from datetime import datetime, timedelta
import json

class WeatherPredictor:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.model_path = 'models/weather_model.pkl'
        self.scaler_path = 'models/scaler.pkl'
        self.load_or_create_model()
    
    def load_or_create_model(self):
        """Load model nếu có, nếu không thì tạo model mới"""
        if os.path.exists(self.model_path) and os.path.exists(self.scaler_path):
            try:
                self.model = joblib.load(self.model_path)
                self.scaler = joblib.load(self.scaler_path)
                print("Đã load model từ file")
            except:
                self.create_model()
        else:
            self.create_model()
    
    def create_model(self):
        """Tạo model mới với dữ liệu mẫu"""
        print("Đang tạo model mới...")
        
        # Tạo dữ liệu training mẫu (có thể thay thế bằng dữ liệu thực từ database)
        # Dữ liệu mẫu: nhiệt độ, độ ẩm, áp suất, gió, mây, tháng, giờ
        np.random.seed(42)
        n_samples = 1000
        
        # Tạo features
        months = np.random.randint(1, 13, n_samples)
        hours = np.random.randint(0, 24, n_samples)
        humidity = np.random.uniform(50, 95, n_samples)
        pressure = np.random.uniform(1010, 1020, n_samples)
        wind_speed = np.random.uniform(1, 8, n_samples)
        cloudiness = np.random.uniform(0, 100, n_samples)
        
        # Tạo target (nhiệt độ) dựa trên mùa và các yếu tố khác
        # Mùa mưa (5-10): nhiệt độ thấp hơn, mùa khô (11-4): nhiệt độ cao hơn
        base_temp = np.where((months >= 5) & (months <= 10), 
                             25 + np.random.uniform(-3, 7, n_samples),  # Mùa mưa: 22-32°C
                             20 + np.random.uniform(0, 15, n_samples))  # Mùa khô: 20-35°C
        
        # Điều chỉnh theo độ ẩm và mây
        temp = base_temp - (humidity - 70) * 0.1 - cloudiness * 0.05
        
        X = np.column_stack([months, hours, humidity, pressure, wind_speed, cloudiness])
        y = temp
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        # Train model
        self.model = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            random_state=42,
            n_jobs=-1
        )
        self.model.fit(X_scaled, y)
        
        # Lưu model
        os.makedirs('models', exist_ok=True)
        joblib.dump(self.model, self.model_path)
        joblib.dump(self.scaler, self.scaler_path)
        print("Đã tạo và lưu model mới")
    
    def predict(self, current_weather, hours_ahead=24):
        """
        Dự đoán thời tiết trong tương lai
        
        Args:
            current_weather: dict với các thông tin:
                - temperature: nhiệt độ hiện tại
                - humidity: độ ẩm
                - pressure: áp suất
                - windSpeed: tốc độ gió
                - cloudiness: mây
                - latitude: vĩ độ
                - longitude: kinh độ
            hours_ahead: số giờ muốn dự đoán (mặc định 24h)
        
        Returns:
            list: Danh sách dự đoán cho các giờ tiếp theo
        """
        if self.model is None:
            return None
        
        predictions = []
        now = datetime.now()
        
        for hour in range(1, hours_ahead + 1):
            future_time = now + timedelta(hours=hour)
            month = future_time.month
            hour_of_day = future_time.hour
            
            # Tạo features cho prediction
            # Sử dụng giá trị hiện tại làm base, có điều chỉnh nhẹ
            humidity = current_weather.get('humidity', 70)
            pressure = current_weather.get('pressure', 1015)
            wind_speed = current_weather.get('windSpeed', 3)
            cloudiness = current_weather.get('cloudiness', 50)
            
            # Điều chỉnh theo thời gian trong ngày
            if 6 <= hour_of_day <= 18:  # Ban ngày
                temp_adjustment = 2
            else:  # Ban đêm
                temp_adjustment = -2
            
            # Điều chỉnh theo mùa
            if 5 <= month <= 10:  # Mùa mưa
                season_adjustment = -1
            else:  # Mùa khô
                season_adjustment = 1
            
            # Tạo feature vector
            features = np.array([[month, hour_of_day, humidity, pressure, wind_speed, cloudiness]])
            features_scaled = self.scaler.transform(features)
            
            # Predict
            predicted_temp = self.model.predict(features_scaled)[0]
            predicted_temp = predicted_temp + temp_adjustment + season_adjustment
            
            # Dự đoán các yếu tố khác (đơn giản hóa)
            predicted_humidity = max(40, min(95, humidity + np.random.uniform(-5, 5)))
            predicted_wind = max(0, min(10, wind_speed + np.random.uniform(-1, 1)))
            
            # Xác định loại thời tiết
            if predicted_humidity > 80 and cloudiness > 60:
                weather_type = "Rain"
                description = "Có mưa"
            elif cloudiness > 70:
                weather_type = "Clouds"
                description = "Có mây"
            elif predicted_temp > 32:
                weather_type = "Clear"
                description = "Nắng nóng"
            else:
                weather_type = "Clear"
                description = "Trời quang"
            
            predictions.append({
                'datetime': future_time.strftime('%Y-%m-%d %H:%M:%S'),
                'temperature': round(predicted_temp, 1),
                'humidity': round(predicted_humidity, 1),
                'windSpeed': round(predicted_wind, 1),
                'pressure': round(pressure, 1),
                'cloudiness': round(cloudiness, 1),
                'mainWeather': weather_type,
                'description': description
            })
        
        return predictions
    
    def retrain_model(self, historical_data):
        """
        Retrain model với dữ liệu lịch sử mới
        
        Args:
            historical_data: list of dicts với các thông tin thời tiết
        """
        if not historical_data or len(historical_data) < 100:
            print("Không đủ dữ liệu để retrain (cần ít nhất 100 records)")
            return
        
        # Convert to DataFrame
        df = pd.DataFrame(historical_data)
        
        # Extract features
        df['month'] = pd.to_datetime(df['recordedAt']).dt.month
        df['hour'] = pd.to_datetime(df['recordedAt']).dt.hour
        
        X = df[['month', 'hour', 'humidity', 'pressure', 'windSpeed', 'cloudiness']].values
        y = df['temperature'].values
        
        # Scale và train
        X_scaled = self.scaler.fit_transform(X)
        self.model.fit(X_scaled, y)
        
        # Lưu model
        joblib.dump(self.model, self.model_path)
        joblib.dump(self.scaler, self.scaler_path)
        print("Đã retrain model với dữ liệu mới")


# Singleton instance
predictor = WeatherPredictor()

