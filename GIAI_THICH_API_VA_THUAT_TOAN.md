# Giải Thích Các API Thời Tiết và Thuật Toán

## 📋 Mục Lục
1. [Tổng Quan Hệ Thống](#tổng-quan-hệ-thống)
2. [Các API Thời Tiết](#các-api-thời-tiết)
3. [Các Thuật Toán](#các-thuật-toán)
4. [Luồng Xử Lý](#luồng-xử-lý)

---

## 🌐 Tổng Quan Hệ Thống

Hệ thống sử dụng kiến trúc **Fallback Chain** (chuỗi dự phòng) để đảm bảo luôn có dữ liệu thời tiết, với thứ tự ưu tiên từ cao đến thấp:

```
API Chính → API Dự Phòng → ML Service → Mock Data
```

---

## 🔌 Các API Thời Tiết

### 1. **GET /api/weather/current** - Lấy Thời Tiết Hiện Tại

#### Luồng Xử Lý:

```
┌─────────────────────────────────────────────────────────┐
│  1. Nhận Request (lat/lng hoặc city/district/ward)     │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  2. Nếu không có lat/lng → Geocoding                   │
│     Ưu tiên: Open-Meteo → Nominatim → OpenWeather      │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  3. Lấy dữ liệu từ Database                            │
└──────────────────┬──────────────────────────────────────┘
                   │
         ┌─────────┴─────────┐
         │                   │
         ▼                   ▼
    ┌────────┐         ┌──────────┐
    │  Có    │         │  Không   │
    └───┬────┘         └────┬─────┘
        │                   │
        │                   ▼
        │         ┌─────────────────────┐
        │         │  4. Open-Meteo API  │
        │         │     (Miễn phí)      │
        │         └─────────┬───────────┘
        │                   │
        │          ┌────────┴─────────┐
        │          │                  │
        │          ▼                  ▼
        │     ┌────────┐         ┌──────────┐
        │     │  Có    │         │  Không   │
        │     └───┬────┘         └────┬─────┘
        │         │                   │
        │         │                   ▼
        │         │         ┌─────────────────────┐
        │         │         │  5. OpenWeather API │
        │         │         │     (Cần API key)   │
        │         │         └─────────┬───────────┘
        │         │                   │
        │         │          ┌────────┴─────────┐
        │         │          │                  │
        │         │          ▼                  ▼
        │         │     ┌────────┐         ┌──────────┐
        │         │     │  Có    │         │  Không   │
        │         │     └───┬────┘         └────┬─────┘
        │         │         │                   │
        │         │         │                   ▼
        │         │         │         ┌─────────────────┐
        │         │         │         │  6. Mock Data   │
        │         │         │         │   (Fallback)    │
        │         │         │         └────────┬────────┘
        │         │         │                  │
        └─────────┴─────────┴──────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────────┐
        │  7. Thêm gợi ý hành động            │
        │     (WeatherDecisionService)        │
        └─────────────────┬───────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────────┐
        │  8. Trả về WeatherDataDTO           │
        └─────────────────────────────────────┘
```

#### Ví dụ Request:
```http
GET /api/weather/current?lat=10.762622&lng=106.660172
GET /api/weather/current?city=Ho Chi Minh&district=Quan 1&ward=Ben Nghe
```

#### Response:
```json
{
  "temperature": 28.5,
  "humidity": 75.0,
  "pressure": 1013.25,
  "windSpeed": 5.2,
  "mainWeather": "Rain",
  "description": "Mưa vừa 🌧️",
  "suggestedAction": "Có mưa đang xảy ra. Bạn có gặp vấn đề gì liên quan đến mưa không?",
  "suggestedIncidentType": "Mưa"
}
```

---

### 2. **GET /api/weather/forecast** - Dự Báo Thời Tiết

#### Luồng Xử Lý:

```
┌─────────────────────────────────────────────────────────┐
│  Request: lat, lng, hoursAhead (mặc định 24h)          │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  BƯỚC 1: OpenWeatherMap One Call API 3.0               │
│  ✅ Ưu tiên cao nhất (chính xác nhất)                  │
│  ❌ Cần subscription                                    │
└──────────────────┬──────────────────────────────────────┘
                   │
          ┌────────┴─────────┐
          │                  │
          ▼                  ▼
     ┌────────┐         ┌──────────┐
     │  Có    │         │  Không   │
     └───┬────┘         └────┬─────┘
         │                   │
         │                   ▼
         │         ┌─────────────────────┐
         │         │  BƯỚC 2:            │
         │         │  Open-Meteo API     │
         │         │  ✅ Miễn phí        │
         │         │  ✅ Không cần key   │
         │         └─────────┬───────────┘
         │                   │
         │          ┌────────┴─────────┐
         │          │                  │
         │          ▼                  ▼
         │     ┌────────┐         ┌──────────┐
         │     │  Có    │         │  Không   │
         │     └───┬────┘         └────┬─────┘
         │         │                   │
         │         │                   ▼
         │         │         ┌─────────────────────┐
         │         │         │  BƯỚC 3:            │
         │         │         │  ML Service         │
         │         │         │  (Python backend)   │
         │         │         └─────────┬───────────┘
         │         │                   │
         │         │          ┌────────┴─────────┐
         │         │          │                  │
         │         │          ▼                  ▼
         │         │     ┌────────┐         ┌──────────┐
         │         │     │  Có    │         │  Không   │
         │         │     └───┬────┘         └────┬─────┘
         │         │         │                   │
         └─────────┴─────────┴───────────────────┘
                          │
                          ▼
            ┌─────────────────────────────┐
            │  Trả về [] nếu tất cả fail  │
            └─────────────────────────────┘
```

#### Ví dụ Request:
```http
GET /api/weather/forecast?lat=10.762622&lng=106.660172&hoursAhead=24
```

#### Response:
```json
[
  {
    "datetime": "2025-01-15T14:00:00",
    "temperature": 29.5,
    "humidity": 70.0,
    "windSpeed": 4.5,
    "mainWeather": "Partly Cloudy",
    "description": "Ít mây ⛅",
    "icon": "http://openweathermap.org/img/w/02d.png"
  },
  {
    "datetime": "2025-01-15T15:00:00",
    "temperature": 30.0,
    "humidity": 68.0,
    "windSpeed": 5.0,
    "mainWeather": "Rain",
    "description": "Mưa nhẹ 🌧️",
    "icon": "http://openweathermap.org/img/w/10d.png"
  }
  // ... 24 giờ tiếp theo
]
```

---

### 3. **GET /api/weather/history** - Lịch Sử Thời Tiết

Lấy dữ liệu lịch sử từ database. Nếu không đủ dữ liệu (< 10 bản ghi), tự động tạo thêm.

---

## 🧮 Các Thuật Toán

### 1. **Thuật Toán Haversine - Tính Khoảng Cách**

#### Mục đích:
Tính khoảng cách giữa 2 điểm trên bề mặt Trái Đất (tính bằng km).

#### Công thức:

```
a = sin²(Δlat/2) + cos(lat1) × cos(lat2) × sin²(Δlng/2)
c = 2 × atan2(√a, √(1-a))
d = R × c
```

Trong đó:
- `R = 6371 km` (bán kính Trái Đất)
- `lat1, lng1`: Tọa độ điểm 1 (radian)
- `lat2, lng2`: Tọa độ điểm 2 (radian)
- `Δlat = lat2 - lat1`
- `Δlng = lng2 - lng1`

#### Minh Họa:

```
            Trái Đất (R = 6371 km)
                   │
                   │
        ┌──────────┼──────────┐
       ╱           │           ╲
      ╱            │            ╲
     ╱             │             ╲
    ╱              │              ╲
   ╱        d      │               ╲
  ╱    ────────────┼────────────    ╲
 ╱                 │                 ╲
╱                  │                  ╲
└──────────────────┴──────────────────┘
  Point 1          │          Point 2
  (lat1,lng1)      │         (lat2,lng2)
```

#### Code Implementation:

```java
public static double calculateDistance(double lat1, double lng1, 
                                      double lat2, double lng2) {
    // Chuyển độ sang radian
    double lat1Rad = Math.toRadians(lat1);
    double lat2Rad = Math.toRadians(lat2);
    double deltaLatRad = Math.toRadians(lat2 - lat1);
    double deltaLngRad = Math.toRadians(lng2 - lng1);
    
    // Công thức Haversine
    double a = Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
               Math.cos(lat1Rad) * Math.cos(lat2Rad) *
               Math.sin(deltaLngRad / 2) * Math.sin(deltaLngRad / 2);
    
    double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return EARTH_RADIUS_KM * c; // Kết quả: km
}
```

#### Ứng Dụng:
- Kiểm tra khoảng cách khi user vote báo cáo (tối đa 10km)
- Lọc báo cáo theo vị trí GPS

---

### 2. **Thuật Toán Trust Score - Điểm Tin Cậy Người Dùng**

#### Mục đích:
Đánh giá độ tin cậy của người dùng dựa trên lịch sử báo cáo.

#### Cách Tính:

```
Trust Score = Sum(Điểm từ các hành động)
```

**Điểm Thưởng/Phạt:**
- ✅ Report được **APPROVE**: +5 điểm
- ❌ Report bị **REJECT**: -3 điểm
- 📊 **Tối thiểu**: 0 điểm (không thể âm)
- 🚀 **Tối đa**: Không giới hạn

#### Trust Levels:

```
┌─────────────────────────────────────────────────┐
│ Trust Score → Trust Level                       │
├─────────────────────────────────────────────────┤
│ ≥ 100 điểm → EXPERT (Chuyên gia) 🟣           │
│ ≥ 50 điểm  → ADVANCED (Cao cấp) 🟢            │
│ ≥ 30 điểm  → INTERMEDIATE (Trung cấp) 🔵       │
│ < 30 điểm  → BEGINNER (Sơ cấp) 🟡              │
└─────────────────────────────────────────────────┘
```

#### Ví dụ Tính Toán:

```
User A:
- Tạo 10 reports
- 8 reports được APPROVE: 8 × 5 = +40 điểm
- 2 reports bị REJECT: 2 × (-3) = -6 điểm
→ Trust Score = 40 - 6 = 34 điểm → INTERMEDIATE

User B:
- Tạo 25 reports
- 23 reports được APPROVE: 23 × 5 = +115 điểm
- 2 reports bị REJECT: 2 × (-3) = -6 điểm
→ Trust Score = 115 - 6 = 109 điểm → EXPERT
```

#### Code Implementation:

```java
// Khi report được approve
public void onReportApproved(WeatherReport report) {
    User user = report.getUser();
    int newScore = user.getTrustScore() + APPROVE_POINTS; // +5
    user.setTrustScore(newScore);
    userRepository.save(user);
}

// Khi report bị reject
public void onReportRejected(WeatherReport report) {
    User user = report.getUser();
    int newScore = Math.max(MIN_TRUST_SCORE, // Tối thiểu 0
                            user.getTrustScore() + REJECT_POINTS); // -3
    user.setTrustScore(newScore);
    userRepository.save(user);
}
```

---

### 3. **Thuật Toán Admin Suggestion - Priority Score**

#### Mục đích:
Tính điểm ưu tiên để gợi ý admin duyệt/từ chối báo cáo.

#### Công Thức:

```
Priority Score = 
    Severity Weight (40%) +
    Community Confirmation (30%) +
    Time Factor (20%) +
    Has Images (10%) +
    User Trust Score (20%) -
    Reject Penalty
```

#### Chi Tiết Từng Thành Phần:

##### 1. Severity Weight (40 điểm tối đa):

```
CRITICAL → +40 điểm
HIGH     → +30 điểm
MEDIUM   → +20 điểm
LOW      → +10 điểm
```

##### 2. Community Confirmation (30 điểm tối đa):

```
confirmRatio = confirmCount / (confirmCount + rejectCount)
score = confirmRatio × 30

Bonus: Nếu confirmCount ≥ 5 → +10 điểm
```

**Ví dụ:**
- 10 confirms, 2 rejects → ratio = 10/12 = 0.83 → 0.83 × 30 = 24.9 điểm
- Có bonus vì ≥ 5 confirms → +10 điểm
- **Tổng**: 34.9 điểm

##### 3. Time Factor (20 điểm tối đa):

```
< 24 giờ  → +20 điểm (Rất mới)
< 72 giờ  → +15 điểm (Mới)
< 168 giờ → +10 điểm (Vừa, 1 tuần)
≥ 168 giờ → +5 điểm (Cũ)
```

##### 4. Has Images (10 điểm):

```
Có ảnh → +10 điểm
Không có → +0 điểm
```

##### 5. User Trust Score (20 điểm tối đa):

```
Nếu trustScore ≥ 100 → +20 điểm (max)
Nếu trustScore < 100 → (trustScore / 100) × 20 điểm
```

**Ví dụ:**
- Trust Score = 50 → 50/100 × 20 = 10 điểm
- Trust Score = 150 → 20 điểm (max)

##### 6. Reject Penalty:

```
rejectCount ≥ 3 → -20 điểm
rejectCount = 2 → -10 điểm
rejectCount ≤ 1 → -0 điểm
```

#### Đề Xuất Hành Động:

```
Priority Score ≥ 70 → APPROVE (Nên duyệt)
Priority Score ≥ 40 → REVIEW (Cần xem xét kỹ)
Priority Score < 40 → REJECT (Nên từ chối)
```

#### Ví dụ Tính Toán:

**Report A:**
- Severity: HIGH → +30
- 8 confirms, 1 reject → ratio = 8/9 = 0.89 → 26.7 + 10 bonus = +36.7
- Tạo 12 giờ trước → +20
- Có ảnh → +10
- User trust score = 75 → 75/100 × 20 = +15
- Reject penalty: 1 reject → -0
- **Tổng**: 30 + 36.7 + 20 + 10 + 15 = **111.7 điểm → APPROVE**

**Report B:**
- Severity: LOW → +10
- 1 confirm, 4 rejects → ratio = 1/5 = 0.2 → 6
- Tạo 200 giờ trước → +5
- Không có ảnh → +0
- User trust score = 5 → 5/100 × 20 = +1
- Reject penalty: 4 rejects → -20
- **Tổng**: 10 + 6 + 5 + 0 + 1 - 20 = **2 điểm → REJECT**

#### Code Implementation:

```java
public double calculatePriorityScore(WeatherReport report) {
    double score = 0.0;
    
    // 1. Severity (40%)
    switch (report.getSeverity()) {
        case CRITICAL: score += 40.0; break;
        case HIGH: score += 30.0; break;
        case MEDIUM: score += 20.0; break;
        case LOW: score += 10.0; break;
    }
    
    // 2. Community Confirmation (30%)
    Long confirmCount = voteRepository.countConfirmsByReport(report);
    Long rejectCount = voteRepository.countRejectsByReport(report);
    if (confirmCount + rejectCount > 0) {
        double confirmRatio = confirmCount / (double)(confirmCount + rejectCount);
        score += confirmRatio * 30.0;
        if (confirmCount >= 5) score += 10.0; // Bonus
    }
    
    // 3. Time Factor (20%)
    long hoursSinceCreation = ChronoUnit.HOURS.between(
        report.getCreatedAt(), LocalDateTime.now());
    if (hoursSinceCreation < 24) score += 20.0;
    else if (hoursSinceCreation < 72) score += 15.0;
    else if (hoursSinceCreation < 168) score += 10.0;
    else score += 5.0;
    
    // 4. Has Images (10%)
    if (report.getImages() != null && !report.getImages().isEmpty()) {
        score += 10.0;
    }
    
    // 5. Trust Score (20%)
    int trustScore = report.getUser().getTrustScore();
    double trustScorePoints = trustScore >= 100 
        ? 20.0 
        : (trustScore / 100.0) * 20.0;
    score += trustScorePoints;
    
    // 6. Reject Penalty
    if (rejectCount >= 3) score -= 20.0;
    else if (rejectCount >= 2) score -= 10.0;
    
    // Normalize về 0-100
    return Math.max(0, Math.min(100, score));
}
```

---

### 4. **Thuật Toán Weather Decision Service - Gợi ý Hành Động**

#### Mục đích:
Phân tích thời tiết hiện tại và gợi ý loại sự cố người dùng nên báo cáo.

#### Quy Tắc (Rule-Based):

```
┌─────────────────────────────────────────────────────────┐
│  RULE 1: Mưa lớn (> 10mm)                               │
│  → Gợi ý: "Lũ lụt" - Priority: HIGH                     │
├─────────────────────────────────────────────────────────┤
│  RULE 2: Gió mạnh (> 15 m/s)                            │
│  → Gợi ý: "Bão" - Priority: HIGH                        │
├─────────────────────────────────────────────────────────┤
│  RULE 3: Nhiệt độ cực cao (> 38°C)                      │
│  → Gợi ý: "Nhiệt độ cực đoan" - Priority: MEDIUM       │
├─────────────────────────────────────────────────────────┤
│  RULE 4: Nhiệt độ cực thấp (< 5°C)                      │
│  → Gợi ý: "Nhiệt độ cực đoan" - Priority: MEDIUM       │
├─────────────────────────────────────────────────────────┤
│  RULE 5: Mưa vừa (5-10mm)                               │
│  → Gợi ý: "Mưa" - Priority: LOW                         │
├─────────────────────────────────────────────────────────┤
│  RULE 6: Độ ẩm > 90% + Mưa nhẹ (< 5mm)                  │
│  → Gợi ý: "Sương mù" - Priority: LOW                    │
├─────────────────────────────────────────────────────────┤
│  RULE 7: Gió mạnh vừa (10-15 m/s)                       │
│  → Gợi ý: "Gió mạnh" - Priority: MEDIUM                 │
├─────────────────────────────────────────────────────────┤
│  RULE 8: Thời tiết có sét (thunderstorm)                │
│  → Gợi ý: "Sét" - Priority: HIGH                        │
└─────────────────────────────────────────────────────────┘
```

#### Ví dụ:

**Trường hợp 1:**
```
Temperature: 28°C
Rain Volume: 15mm
Wind Speed: 5 m/s
→ Kích hoạt RULE 1 (mưa lớn)
→ Suggested Action: "Có mưa lớn đang xảy ra. Bạn có gặp tình trạng ngập lụt không?"
→ Suggested Incident Type: "Lũ lụt"
→ Priority: HIGH
```

**Trường hợp 2:**
```
Temperature: 25°C
Rain Volume: 0mm
Wind Speed: 18 m/s
→ Kích hoạt RULE 2 (gió mạnh)
→ Suggested Action: "Gió rất mạnh đang thổi. Bạn có thấy dấu hiệu bão hoặc lốc xoáy không?"
→ Suggested Incident Type: "Bão"
→ Priority: HIGH
```

#### Code Implementation:

```java
public Map<String, Object> analyzeWeatherAndSuggestAction(WeatherDataDTO weatherData) {
    Map<String, Object> result = new HashMap<>();
    
    Double rainVolume = weatherData.getRainVolume();
    Double windSpeed = weatherData.getWindSpeed();
    Double temperature = weatherData.getTemperature();
    Double humidity = weatherData.getHumidity();
    String mainWeather = weatherData.getMainWeather();
    
    // Rule 1: Mưa lớn
    if (rainVolume != null && rainVolume > 10.0) {
        result.put("suggestedAction", "Có mưa lớn đang xảy ra...");
        result.put("suggestedIncidentType", "Lũ lụt");
        result.put("priority", "HIGH");
        return result;
    }
    
    // Rule 2: Gió mạnh
    if (windSpeed != null && windSpeed > 15.0) {
        result.put("suggestedAction", "Gió rất mạnh đang thổi...");
        result.put("suggestedIncidentType", "Bão");
        result.put("priority", "HIGH");
        return result;
    }
    
    // ... các rules khác
    
    return result; // Không có gợi ý
}
```

---

### 5. **Thuật Toán ML Prediction Service - Dự Đoán Thời Tiết**

#### Mục đích:
Dự đoán thời tiết trong tương lai bằng Machine Learning.

#### Luồng Xử Lý:

```
┌─────────────────────────────────────────────────────────┐
│  1. Lấy thời tiết hiện tại                              │
│     (từ API/DB)                                         │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  2. Chuẩn bị Input cho ML Service                       │
│     {                                                   │
│       temperature, humidity, pressure,                  │
│       windSpeed, cloudiness,                            │
│       latitude, longitude,                              │
│       hoursAhead                                        │
│     }                                                   │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  3. Gọi Python ML Service                               │
│     POST http://localhost:5000/predict                  │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  4. Nhận Predictions từ ML                              │
│     [                                                   │
│       {datetime, temperature, humidity, ...},           │
│       {datetime, temperature, humidity, ...},           │
│       ...                                               │
│     ]                                                   │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  5. Trả về Forecast cho Frontend                        │
└─────────────────────────────────────────────────────────┘
```

#### Code Implementation:

```java
public List<Map<String, Object>> predictWeather(WeatherDataDTO currentWeather, 
                                                  int hoursAhead) {
    // Chuẩn bị request body
    Map<String, Object> requestBody = new HashMap<>();
    requestBody.put("temperature", currentWeather.getTemperature());
    requestBody.put("humidity", currentWeather.getHumidity());
    requestBody.put("pressure", currentWeather.getPressure());
    requestBody.put("windSpeed", currentWeather.getWindSpeed());
    requestBody.put("cloudiness", currentWeather.getCloudiness());
    requestBody.put("latitude", currentWeather.getLatitude());
    requestBody.put("longitude", currentWeather.getLongitude());
    requestBody.put("hoursAhead", hoursAhead);
    
    // Gọi Python service
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    HttpEntity<Map<String, Object>> request = 
        new HttpEntity<>(requestBody, headers);
    
    String url = pythonServiceUrl + "/predict";
    ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
    
    if (response.getBody() != null && 
        Boolean.TRUE.equals(response.getBody().get("success"))) {
        return (List<Map<String, Object>>) response.getBody().get("predictions");
    }
    
    return null;
}
```

---

### 6. **Thuật Toán Vote System với Distance Check**

#### Mục đích:
Chỉ cho phép user vote các báo cáo trong bán kính cho phép (mặc định 10km).

#### Luồng Xử Lý:

```
┌─────────────────────────────────────────────────────────┐
│  1. User request vote (CONFIRM/REJECT)                  │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  2. Kiểm tra: User có phải owner không?                 │
│     → Nếu có: Từ chối (không thể vote báo cáo của mình)│
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  3. Tính khoảng cách:                                   │
│     distance = Haversine(                               │
│       userLat, userLng,                                 │
│       reportLat, reportLng                              │
│     )                                                   │
└──────────────────┬──────────────────────────────────────┘
                   │
          ┌────────┴─────────┐
          │                  │
          ▼                  ▼
     ┌────────┐         ┌──────────┐
     │ ≤ 10km │         │  > 10km  │
     └───┬────┘         └────┬─────┘
         │                   │
         │                   ▼
         │         ┌─────────────────────┐
         │         │   Từ chối vote      │
         │         │   (Quá xa)          │
         │         └─────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│  4. Kiểm tra vote cũ:                                   │
│     → Nếu có và cùng loại: Xóa vote (toggle off)       │
│     → Nếu có và khác loại: Cập nhật vote               │
│     → Nếu không có: Tạo vote mới                       │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  5. Trả về vote counts mới                              │
└─────────────────────────────────────────────────────────┘
```

#### Code Implementation:

```java
public void voteReport(Long reportId, String username, 
                      ReportVote.VoteType voteType,
                      Double userLatitude, Double userLongitude) {
    WeatherReport report = reportRepository.findById(reportId)
        .orElseThrow(() -> new RuntimeException("Report not found"));
    
    User user = userRepository.findByUsername(username)
        .orElseThrow(() -> new RuntimeException("User not found"));
    
    // Không cho vote báo cáo của chính mình
    if (report.getUser().getId().equals(user.getId())) {
        throw new RuntimeException("You cannot vote on your own report");
    }
    
    // Kiểm tra khoảng cách
    if (userLatitude != null && userLongitude != null && 
        report.getLatitude() != null && report.getLongitude() != null) {
        double distance = DistanceCalculator.calculateDistance(
            userLatitude, userLongitude,
            report.getLatitude(), report.getLongitude()
        );
        
        if (distance > maxVoteDistanceKm) { // mặc định 10km
            throw new RuntimeException(
                String.format("Báo cáo này quá xa vị trí của bạn (%.1f km)...", 
                    distance, maxVoteDistanceKm)
            );
        }
    }
    
    // Tìm vote cũ
    ReportVote existingVote = voteRepository
        .findByReportAndUser(report, user).orElse(null);
    
    if (existingVote != null) {
        if (existingVote.getVoteType() == voteType) {
            // Cùng loại → xóa (toggle off)
            voteRepository.delete(existingVote);
        } else {
            // Khác loại → cập nhật
            existingVote.setVoteType(voteType);
            voteRepository.save(existingVote);
        }
    } else {
        // Tạo vote mới
        ReportVote vote = new ReportVote();
        vote.setReport(report);
        vote.setUser(user);
        vote.setVoteType(voteType);
        voteRepository.save(vote);
    }
}
```

---

## 🔄 Luồng Xử Lý Tổng Thể

### Luồng Tạo Báo Cáo:

```
User tạo báo cáo
    ↓
Lấy thời tiết hiện tại (WeatherController.getCurrentWeather)
    ↓
Phân tích và gợi ý (WeatherDecisionService)
    ↓
Lưu báo cáo vào DB với status = PENDING
    ↓
Admin xem danh sách báo cáo
    ↓
Tính priority score (AdminSuggestionService)
    ↓
Gợi ý hành động: APPROVE/REVIEW/REJECT
    ↓
Admin quyết định duyệt/từ chối
    ↓
Cập nhật trust score (TrustScoreService)
```

### Luồng Vote Báo Cáo:

```
User xem báo cáo
    ↓
User vote (CONFIRM/REJECT)
    ↓
Kiểm tra khoảng cách (Haversine)
    ↓
Lưu vote vào DB
    ↓
Cập nhật vote counts (confirmCount, rejectCount)
    ↓
Priority score được tính lại (nếu admin xem lại)
```

---

## 📊 Tóm Tắt Các Thuật Toán

| Thuật Toán | Độ Phức Tạp | Mục Đích | Kết Quả |
|------------|-------------|----------|---------|
| **Haversine** | O(1) | Tính khoảng cách 2 điểm | Khoảng cách (km) |
| **Trust Score** | O(1) | Đánh giá độ tin cậy | Điểm số (0-∞) |
| **Priority Score** | O(1) | Gợi ý duyệt báo cáo | Điểm số (0-100) |
| **Weather Decision** | O(1) | Gợi ý loại sự cố | Loại sự cố + Priority |
| **ML Prediction** | O(n) | Dự đoán thời tiết | Danh sách forecast |

---

## 🎯 Kết Luận

Hệ thống sử dụng nhiều thuật toán và API để:
1. **Lấy dữ liệu thời tiết** từ nhiều nguồn (fallback chain)
2. **Tính toán khoảng cách** chính xác (Haversine)
3. **Đánh giá độ tin cậy** người dùng (Trust Score)
4. **Gợi ý hành động** cho admin (Priority Score)
5. **Gợi ý loại sự cố** dựa trên thời tiết (Weather Decision)
6. **Dự đoán thời tiết** bằng ML (nếu API không có forecast)

Tất cả các thuật toán đều được thiết kế để đảm bảo tính chính xác, công bằng và hiệu quả trong hệ thống báo cáo thời tiết cộng đồng.

