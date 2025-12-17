"""
Script để generate tọa độ cho tất cả provinces, districts, và wards
Chạy script này để tạo file location_coordinates.json đầy đủ
"""

import json
import os
from pathlib import Path

# Tọa độ các tỉnh/thành phố
PROVINCE_COORDS = {
    "Thành phố Hà Nội": [21.0285, 105.8542],
    "Tỉnh Hà Giang": [22.8026, 104.9785],
    "Tỉnh Cao Bằng": [22.6657, 106.2577],
    "Tỉnh Bắc Kạn": [22.1470, 105.8348],
    "Tỉnh Tuyên Quang": [21.8183, 105.2117],
    "Tỉnh Lào Cai": [22.4866, 103.9750],
    "Tỉnh Điện Biên": [21.3926, 103.0160],
    "Tỉnh Lai Châu": [22.3867, 103.4567],
    "Tỉnh Sơn La": [21.3257, 103.9160],
    "Tỉnh Yên Bái": [21.7050, 104.8726],
    "Tỉnh Hoà Bình": [20.8136, 105.3383],
    "Tỉnh Thái Nguyên": [21.5942, 105.8432],
    "Tỉnh Lạng Sơn": [21.8537, 106.7613],
    "Tỉnh Quảng Ninh": [21.0064, 107.2925],
    "Tỉnh Bắc Giang": [21.2731, 106.1946],
    "Tỉnh Phú Thọ": [21.3087, 105.3131],
    "Tỉnh Vĩnh Phúc": [21.3609, 105.5474],
    "Tỉnh Bắc Ninh": [21.1861, 106.0763],
    "Tỉnh Hải Dương": [20.9373, 106.3146],
    "Tỉnh Hải Phòng": [20.8449, 106.6881],
    "Tỉnh Hưng Yên": [20.6564, 106.0519],
    "Tỉnh Thái Bình": [20.4463, 106.3366],
    "Tỉnh Hà Nam": [20.5433, 105.9229],
    "Tỉnh Nam Định": [20.4208, 106.1683],
    "Tỉnh Ninh Bình": [20.2506, 105.9744],
    "Tỉnh Thanh Hóa": [19.8067, 105.7852],
    "Tỉnh Nghệ An": [18.6796, 105.6813],
    "Tỉnh Hà Tĩnh": [18.3428, 105.9057],
    "Tỉnh Quảng Bình": [17.4687, 106.6227],
    "Tỉnh Quảng Trị": [16.7500, 107.2000],
    "Tỉnh Thừa Thiên Huế": [16.4637, 107.5909],
    "Tỉnh Đà Nẵng": [16.0544, 108.2022],
    "Tỉnh Quảng Nam": [15.8801, 108.3380],
    "Tỉnh Quảng Ngãi": [15.1167, 108.8000],
    "Tỉnh Bình Định": [13.7750, 109.2233],
    "Tỉnh Phú Yên": [13.0880, 109.3200],
    "Tỉnh Khánh Hòa": [12.2388, 109.1967],
    "Tỉnh Ninh Thuận": [11.5643, 108.9886],
    "Tỉnh Bình Thuận": [10.9286, 108.0993],
    "Tỉnh Kon Tum": [14.3545, 108.0076],
    "Tỉnh Gia Lai": [13.9833, 108.0167],
    "Tỉnh Đắk Lắk": [12.6675, 108.0377],
    "Tỉnh Đắk Nông": [12.0047, 107.6877],
    "Tỉnh Lâm Đồng": [11.9404, 108.4583],
    "Tỉnh Bình Phước": [11.7510, 106.7234],
    "Tỉnh Tây Ninh": [11.3130, 106.0987],
    "Tỉnh Bình Dương": [11.3254, 106.4770],
    "Tỉnh Đồng Nai": [10.9574, 106.8429],
    "Tỉnh Bà Rịa - Vũng Tàu": [10.3460, 107.0843],
    "Tỉnh Hồ Chí Minh": [10.8231, 106.6297],
    "Tỉnh Long An": [10.6599, 106.2076],
    "Tỉnh Tiền Giang": [10.3548, 106.3648],
    "Tỉnh Bến Tre": [10.2405, 106.3753],
    "Tỉnh Trà Vinh": [9.9346, 106.3457],
    "Tỉnh Vĩnh Long": [10.2530, 105.9722],
    "Tỉnh Đồng Tháp": [10.5177, 105.6323],
    "Tỉnh An Giang": [10.5216, 105.1258],
    "Tỉnh Kiên Giang": [9.9581, 105.1311],
    "Thành phố Cần Thơ": [10.0452, 105.7469],
    "Tỉnh Hậu Giang": [9.7840, 105.4710],
    "Tỉnh Sóc Trăng": [9.6004, 105.9718],
    "Tỉnh Bạc Liêu": [9.2942, 105.7271],
    "Tỉnh Cà Mau": [9.1769, 105.1528],
}

def find_province_coords(province_name):
    """Tìm tọa độ tỉnh từ tên"""
    if province_name in PROVINCE_COORDS:
        return PROVINCE_COORDS[province_name]
    
    # Partial match
    short_name = province_name.replace("Tỉnh ", "").replace("Thành phố ", "")
    for key, coords in PROVINCE_COORDS.items():
        key_short = key.replace("Tỉnh ", "").replace("Thành phố ", "")
        if key_short == short_name or key_short in province_name or province_name in key_short:
            return coords
    
    # Default: trung tâm Việt Nam
    return [16.0583, 108.2772]

def generate_coordinates(base_coords, name, level):
    """Generate tọa độ dựa trên hash của tên"""
    hash_val = hash(name)
    
    # Level 1: Province (offset = 0)
    # Level 2: District (offset ±0.5 độ ~55km)
    # Level 3: Ward (offset ±0.1 độ ~11km)
    max_offset = 0
    if level == 2:
        max_offset = 0.5
    elif level == 3:
        max_offset = 0.1
    
    # Tạo offset từ hash
    offset_lat = ((hash_val % 1000) / 1000.0 - 0.5) * max_offset
    offset_lng = (((hash_val * 7) % 1000) / 1000.0 - 0.5) * max_offset
    
    return [base_coords[0] + offset_lat, base_coords[1] + offset_lng]

def main():
    # Đường dẫn file
    base_dir = Path(__file__).parent.parent
    weather_dir = base_dir / "weather" / "src" / "main" / "resources"
    
    # Load JSON files
    print("Loading JSON files...")
    with open(weather_dir / "provinces.json", "r", encoding="utf-8") as f:
        provinces = json.load(f)
    
    with open(weather_dir / "districts.json", "r", encoding="utf-8") as f:
        districts = json.load(f)
    
    with open(weather_dir / "wards.json", "r", encoding="utf-8") as f:
        wards = json.load(f)
    
    # Build coordinate map
    result = {
        "provinces": {},
        "districts": {},
        "wards": {}
    }
    
    # Process provinces
    print("Processing provinces...")
    for province in provinces:
        province_name = province["name"]
        coords = find_province_coords(province_name)
        result["provinces"][province_name] = {
            "lat": round(coords[0], 6),
            "lng": round(coords[1], 6)
        }
    
    # Process districts
    print("Processing districts...")
    districts_by_province = {}
    for district in districts:
        province_code = district.get("provinceCode")
        if province_code:
            if province_code not in districts_by_province:
                districts_by_province[province_code] = []
            districts_by_province[province_code].append(district)
    
    for province in provinces:
        province_code = province["code"]
        province_name = province["name"]
        province_coords = find_province_coords(province_name)
        
        province_districts = districts_by_province.get(province_code, [])
        if province_districts:
            result["districts"][province_name] = {}
            
            for district in province_districts:
                district_name = district["name"]
                district_coords = generate_coordinates(province_coords, district_name, 2)
                result["districts"][province_name][district_name] = {
                    "lat": round(district_coords[0], 6),
                    "lng": round(district_coords[1], 6)
                }
    
    # Process wards
    print("Processing wards...")
    wards_by_district = {}
    for ward in wards:
        district_code = ward.get("districtCode")
        if district_code:
            if district_code not in wards_by_district:
                wards_by_district[district_code] = []
            wards_by_district[district_code].append(ward)
    
    for district in districts:
        district_code = district["code"]
        district_name = district["name"]
        province_name = district.get("provinceName", "")
        
        if not province_name:
            continue
            
        province_coords = find_province_coords(province_name)
        district_coords = generate_coordinates(province_coords, district_name, 2)
        
        district_wards = wards_by_district.get(district_code, [])
        if district_wards:
            key = f"{province_name}|{district_name}"
            result["wards"][key] = {}
            
            for ward in district_wards:
                ward_name = ward["name"]
                ward_coords = generate_coordinates(district_coords, ward_name, 3)
                result["wards"][key][ward_name] = {
                    "lat": round(ward_coords[0], 6),
                    "lng": round(ward_coords[1], 6)
                }
    
    # Write to file
    output_file = weather_dir / "location_coordinates.json"
    print(f"\nWriting to {output_file}...")
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    
    print("\nGenerated location_coordinates.json successfully!")
    print(f"   Provinces: {len(result['provinces'])}")
    print(f"   Districts: {sum(len(v) for v in result['districts'].values())}")
    print(f"   Wards: {sum(len(v) for v in result['wards'].values())}")

if __name__ == "__main__":
    main()

