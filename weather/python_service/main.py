from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import mysql.connector
from sklearn.linear_model import LinearRegression
import os

app = FastAPI(title="Weather Analysis Service")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database configuration
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': int(os.getenv('DB_PORT', 3306)),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),
    'database': os.getenv('DB_NAME', 'weather_db'),
}

def get_db_connection():
    return mysql.connector.connect(**DB_CONFIG)

class WeatherAnalysisRequest(BaseModel):
    district: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None

class RiskPredictionRequest(BaseModel):
    latitude: float
    longitude: float
    district: Optional[str] = None

@app.get("/")
def read_root():
    return {"message": "Weather Analysis Service", "status": "running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/analyze/trends")
def analyze_weather_trends(request: WeatherAnalysisRequest):
    """Phân tích xu hướng thời tiết theo khu vực"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        query = """
            SELECT recorded_at, temperature, humidity, wind_speed, rain_volume, district
            FROM weather_data
            WHERE 1=1
        """
        params = []
        
        if request.district:
            query += " AND district = %s"
            params.append(request.district)
        
        if request.start_date:
            query += " AND recorded_at >= %s"
            params.append(request.start_date)
        
        if request.end_date:
            query += " AND recorded_at <= %s"
            params.append(request.end_date)
        
        query += " ORDER BY recorded_at DESC LIMIT 1000"
        
        cursor.execute(query, params)
        data = cursor.fetchall()
        conn.close()
        
        if not data:
            return {"message": "No data found", "trends": []}
        
        df = pd.DataFrame(data)
        df['recorded_at'] = pd.to_datetime(df['recorded_at'])
        
        # Calculate trends
        trends = {
            "avg_temperature": float(df['temperature'].mean()) if 'temperature' in df.columns else None,
            "avg_humidity": float(df['humidity'].mean()) if 'humidity' in df.columns else None,
            "avg_wind_speed": float(df['wind_speed'].mean()) if 'wind_speed' in df.columns else None,
            "total_rain": float(df['rain_volume'].sum()) if 'rain_volume' in df.columns else None,
            "data_points": len(df),
            "date_range": {
                "start": df['recorded_at'].min().isoformat(),
                "end": df['recorded_at'].max().isoformat()
            }
        }
        
        return {"trends": trends}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/incidents")
def analyze_incident_patterns(request: WeatherAnalysisRequest):
    """Phân tích mẫu sự cố thời tiết"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        query = """
            SELECT r.created_at, r.severity, r.status, r.district, it.name as incident_type
            FROM weather_reports r
            JOIN incident_types it ON r.incident_type_id = it.id
            WHERE 1=1
        """
        params = []
        
        if request.district:
            query += " AND r.district = %s"
            params.append(request.district)
        
        if request.start_date:
            query += " AND r.created_at >= %s"
            params.append(request.start_date)
        
        if request.end_date:
            query += " AND r.created_at <= %s"
            params.append(request.end_date)
        
        cursor.execute(query, params)
        data = cursor.fetchall()
        conn.close()
        
        if not data:
            return {"message": "No data found", "patterns": {}}
        
        df = pd.DataFrame(data)
        df['created_at'] = pd.to_datetime(df['created_at'])
        
        patterns = {
            "total_incidents": len(df),
            "by_type": df['incident_type'].value_counts().to_dict(),
            "by_severity": df['severity'].value_counts().to_dict(),
            "by_status": df['status'].value_counts().to_dict(),
            "by_district": df['district'].value_counts().to_dict() if 'district' in df.columns else {},
            "daily_counts": df.groupby(df['created_at'].dt.date).size().to_dict()
        }
        
        return {"patterns": patterns}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/risk")
def predict_weather_risk(request: RiskPredictionRequest):
    """Dự đoán rủi ro thời tiết cho một khu vực"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Get historical weather data
        query = """
            SELECT temperature, humidity, wind_speed, rain_volume, pressure
            FROM weather_data
            WHERE latitude BETWEEN %s AND %s
            AND longitude BETWEEN %s AND %s
            ORDER BY recorded_at DESC
            LIMIT 100
        """
        lat_range = 0.1  # ~11km
        cursor.execute(query, [
            request.latitude - lat_range,
            request.latitude + lat_range,
            request.longitude - lat_range,
            request.longitude + lat_range
        ])
        weather_data = cursor.fetchall()
        
        # Get incident reports
        query = """
            SELECT COUNT(*) as count, AVG(CASE severity 
                WHEN 'CRITICAL' THEN 4 
                WHEN 'HIGH' THEN 3 
                WHEN 'MEDIUM' THEN 2 
                ELSE 1 END) as avg_severity
            FROM weather_reports
            WHERE latitude BETWEEN %s AND %s
            AND longitude BETWEEN %s AND %s
            AND status = 'APPROVED'
        """
        cursor.execute(query, [
            request.latitude - lat_range,
            request.latitude + lat_range,
            request.longitude - lat_range,
            request.longitude + lat_range
        ])
        incident_data = cursor.fetchone()
        conn.close()
        
        if not weather_data:
            return {
                "risk_score": 0.5,
                "risk_level": "UNKNOWN",
                "factors": ["Insufficient data"]
            }
        
        df = pd.DataFrame(weather_data)
        
        # Calculate risk factors
        risk_factors = []
        risk_score = 0.5  # Base score
        
        # Rain volume factor
        if 'rain_volume' in df.columns and df['rain_volume'].notna().any():
            avg_rain = df['rain_volume'].mean()
            if avg_rain > 10:
                risk_score += 0.2
                risk_factors.append("High rainfall")
            elif avg_rain > 5:
                risk_score += 0.1
                risk_factors.append("Moderate rainfall")
        
        # Wind speed factor
        if 'wind_speed' in df.columns and df['wind_speed'].notna().any():
            avg_wind = df['wind_speed'].mean()
            if avg_wind > 15:
                risk_score += 0.15
                risk_factors.append("Strong winds")
            elif avg_wind > 10:
                risk_score += 0.1
                risk_factors.append("Moderate winds")
        
        # Incident history factor
        if incident_data and incident_data['count'] > 0:
            incident_count = incident_data['count']
            avg_severity = incident_data['avg_severity'] or 2
            if incident_count > 10:
                risk_score += 0.2
                risk_factors.append(f"High incident frequency ({incident_count} reports)")
            elif incident_count > 5:
                risk_score += 0.1
                risk_factors.append(f"Moderate incident frequency ({incident_count} reports)")
            
            if avg_severity > 3:
                risk_score += 0.15
                risk_factors.append("High severity incidents")
        
        # Normalize risk score
        risk_score = min(1.0, max(0.0, risk_score))
        
        # Determine risk level
        if risk_score >= 0.7:
            risk_level = "HIGH"
        elif risk_score >= 0.4:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"
        
        return {
            "risk_score": round(risk_score, 2),
            "risk_level": risk_level,
            "factors": risk_factors if risk_factors else ["Normal conditions"],
            "location": {
                "latitude": request.latitude,
                "longitude": request.longitude,
                "district": request.district
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/stats/summary")
def get_statistics_summary():
    """Tổng hợp thống kê tổng quan"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Weather data stats
        cursor.execute("SELECT COUNT(*) as count, AVG(temperature) as avg_temp FROM weather_data")
        weather_stats = cursor.fetchone()
        
        # Report stats
        cursor.execute("""
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status = 'APPROVED' THEN 1 ELSE 0 END) as approved
            FROM weather_reports
        """)
        report_stats = cursor.fetchone()
        
        # User stats
        cursor.execute("SELECT COUNT(*) as count FROM users")
        user_stats = cursor.fetchone()
        
        conn.close()
        
        return {
            "weather_data_points": weather_stats['count'] if weather_stats else 0,
            "average_temperature": round(weather_stats['avg_temp'], 2) if weather_stats and weather_stats['avg_temp'] else None,
            "total_reports": report_stats['total'] if report_stats else 0,
            "pending_reports": report_stats['pending'] if report_stats else 0,
            "approved_reports": report_stats['approved'] if report_stats else 0,
            "total_users": user_stats['count'] if user_stats else 0
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

