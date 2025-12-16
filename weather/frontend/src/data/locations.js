// Load locations from JSON files (vietnam-provinces-main)

let provincesDataCache = null;
let provincesTreeCache = null;
let districtsTreeCache = null;
let provincesCache = null;
let districtsCache = {};
let wardsCache = {};

// Load dữ liệu từ JSON files
const loadProvincesData = async () => {
  if (!provincesDataCache) {
    try {
      const response = await fetch('/provinces.json');
      provincesDataCache = await response.json();
    } catch (error) {
      console.error('Error loading provinces data:', error);
      provincesDataCache = [];
    }
  }
  return provincesDataCache;
};

const loadTreeData = async () => {
  if (!provincesTreeCache || !districtsTreeCache) {
    try {
      const [provincesTreeRes, districtsTreeRes] = await Promise.all([
        fetch('/provincesTree.json'),
        fetch('/districtsTree.json')
      ]);
      provincesTreeCache = await provincesTreeRes.json();
      districtsTreeCache = await districtsTreeRes.json();
    } catch (error) {
      console.error('Error loading tree data:', error);
      provincesTreeCache = {};
      districtsTreeCache = {};
    }
  }
};

// Tìm province code từ province name
const findProvinceCode = async (provinceName) => {
  if (!provinceName) return null;
  const data = await loadProvincesData();
  const province = data.find(p => p.name === provinceName);
  return province ? province.code : null;
};

// Tìm district code từ district name và province
const findDistrictCode = async (districtName, provinceName) => {
  if (!districtName || !provinceName) return null;
  await loadTreeData();
  const provinceCode = await findProvinceCode(provinceName);
  if (!provinceCode || !provincesTreeCache[provinceCode]) return null;
  
  const districts = provincesTreeCache[provinceCode] || [];
  const district = districts.find(d => d.name === districtName);
  return district ? district.code : null;
};

export const getProvinces = async () => {
  if (provincesCache) return provincesCache;
  try {
    const data = await loadProvincesData();
    // Trả về danh sách tên các tỉnh/thành phố
    provincesCache = data.map(p => p.name);
    return provincesCache;
  } catch (error) {
    console.error('Error loading provinces:', error);
    return [];
  }
};

export const getDistricts = async (province) => {
  if (!province) return [];
  
  if (districtsCache[province]) return districtsCache[province];
  
  try {
    await loadTreeData();
    const provinceCode = await findProvinceCode(province);
    if (!provinceCode || !provincesTreeCache[provinceCode]) {
      return [];
    }
    
    // Trả về danh sách tên các quận/huyện
    const districts = provincesTreeCache[provinceCode].map(d => d.name);
    districtsCache[province] = districts;
    return districts;
  } catch (error) {
    console.error('Error loading districts:', error);
    return [];
  }
};

export const getWards = async (province, district) => {
  if (!province || !district) return [];
  
  const cacheKey = `${province}_${district}`;
  if (wardsCache[cacheKey]) return wardsCache[cacheKey];
  
  try {
    await loadTreeData();
    const districtCode = await findDistrictCode(district, province);
    if (!districtCode || !districtsTreeCache[districtCode]) {
      return [];
    }
    
    // Trả về danh sách tên các phường/xã
    const wards = districtsTreeCache[districtCode].map(w => w.name);
    wardsCache[cacheKey] = wards;
    return wards;
  } catch (error) {
    console.error('Error loading wards:', error);
    return [];
  }
};
