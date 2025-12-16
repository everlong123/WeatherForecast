// Fetch locations from backend API with caching
import api from '../utils/api';

let provincesCache = null;
let districtsCache = {};
let wardsCache = {};

export const getProvinces = async () => {
  if (provincesCache) return provincesCache;
  try {
    const response = await api.get('/locations/provinces');
    provincesCache = response.data;
    return response.data;
  } catch (error) {
    console.error('Error fetching provinces:', error);
    return [];
  }
};

export const getDistricts = async (province) => {
  if (!province) return [];
  
  if (districtsCache[province]) return districtsCache[province];
  
  try {
    const response = await api.get('/locations/districts', { params: { province } });
    districtsCache[province] = response.data;
    return response.data;
  } catch (error) {
    console.error('Error fetching districts:', error);
    return [];
  }
};

export const getWards = async (province, district) => {
  if (!province || !district) return [];
  
  const cacheKey = `${province}_${district}`;
  if (wardsCache[cacheKey]) return wardsCache[cacheKey];
  
  try {
    const response = await api.get('/locations/wards', { 
      params: { province, district } 
    });
    wardsCache[cacheKey] = response.data;
    return response.data;
  } catch (error) {
    console.error('Error fetching wards:', error);
    return [];
  }
};
