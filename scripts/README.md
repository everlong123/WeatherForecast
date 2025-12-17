# Scripts

## generate_coordinates.py

Script để tự động generate tọa độ (lat/lng) cho tất cả các địa điểm trong Việt Nam.

### Mô tả

Script này đọc các file JSON:
- `provinces.json` - Danh sách tỉnh/thành phố
- `districts.json` - Danh sách quận/huyện
- `wards.json` - Danh sách xã/phường

Và tạo file `location_coordinates.json` chứa tọa độ cho:
- **63 tỉnh/thành phố** - Tọa độ chính xác
- **705 quận/huyện** - Tọa độ được generate dựa trên tỉnh (offset ±0.5 độ)
- **10,599 xã/phường** - Tọa độ được generate dựa trên quận/huyện (offset ±0.1 độ)

### Cách sử dụng

```bash
cd scripts
python generate_coordinates.py
```

### Output

File `weather/src/main/resources/location_coordinates.json` sẽ được tạo với cấu trúc:

```json
{
  "provinces": {
    "Thành phố Hà Nội": {
      "lat": 21.0285,
      "lng": 105.8542
    },
    ...
  },
  "districts": {
    "Thành phố Hà Nội": {
      "Quận Ba Đình": {
        "lat": 21.0333,
        "lng": 105.8167
      },
      ...
    },
    ...
  },
  "wards": {
    "Thành phố Hà Nội|Quận Ba Đình": {
      "Phường Phúc Xá": {
        "lat": 21.0333,
        "lng": 105.8167
      },
      ...
    },
    ...
  }
}
```

### Thuật toán

1. **Provinces**: Sử dụng tọa độ chính xác đã có sẵn
2. **Districts**: Tọa độ = Province coordinates + offset (dựa trên hash của tên district)
   - Offset: ±0.5 độ (~55km)
3. **Wards**: Tọa độ = District coordinates + offset (dựa trên hash của tên ward)
   - Offset: ±0.1 độ (~11km)

### Lưu ý

- Tọa độ được generate dựa trên hash, đảm bảo tính nhất quán (cùng tên → cùng tọa độ)
- Tọa độ districts và wards là ước tính, không phải tọa độ chính xác
- Có thể chạy lại script bất cứ lúc nào để regenerate file

