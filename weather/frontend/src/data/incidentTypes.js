// Danh sách các loại sự cố thời tiết, chia theo category
export const incidentTypes = [
  // Mưa và Lũ lụt
  {
    id: 1,
    name: 'Mưa lớn',
    description: 'Mưa với cường độ cao, lượng mưa trên 50mm/giờ',
    icon: '🌧️',
    color: '#4A90E2',
    category: 'Mưa và Lũ lụt'
  },
  {
    id: 2,
    name: 'Mưa dông',
    description: 'Mưa kèm theo sấm sét và gió mạnh',
    icon: '⛈️',
    color: '#2C3E50',
    category: 'Mưa và Lũ lụt'
  },
  {
    id: 3,
    name: 'Lũ lụt',
    description: 'Nước dâng cao gây ngập lụt đường phố, nhà cửa',
    icon: '🌊',
    color: '#3498DB',
    category: 'Mưa và Lũ lụt'
  },
  {
    id: 4,
    name: 'Ngập úng',
    description: 'Nước đọng không thoát được gây ngập cục bộ',
    icon: '💧',
    color: '#5DADE2',
    category: 'Mưa và Lũ lụt'
  },
  {
    id: 5,
    name: 'Sạt lở đất',
    description: 'Đất đá sạt lở do mưa lớn kéo dài',
    icon: '⛰️',
    color: '#8B4513',
    category: 'Mưa và Lũ lụt'
  },

  // Gió và Bão
  {
    id: 6,
    name: 'Gió mạnh',
    description: 'Gió tốc độ trên 40km/h',
    icon: '💨',
    color: '#AED6F1',
    category: 'Gió và Bão'
  },
  {
    id: 7,
    name: 'Gió giật',
    description: 'Gió giật mạnh đột ngột, có thể gây nguy hiểm',
    icon: '🌪️',
    color: '#85C1E2',
    category: 'Gió và Bão'
  },
  {
    id: 8,
    name: 'Bão',
    description: 'Bão nhiệt đới với gió mạnh và mưa lớn',
    icon: '🌀',
    color: '#1B4F72',
    category: 'Gió và Bão'
  },
  {
    id: 9,
    name: 'Áp thấp nhiệt đới',
    description: 'Hệ thống thời tiết xấu với mưa và gió mạnh',
    icon: '🌬️',
    color: '#2874A6',
    category: 'Gió và Bão'
  },
  {
    id: 10,
    name: 'Lốc xoáy',
    description: 'Xoáy gió mạnh, có thể gây thiệt hại nghiêm trọng',
    icon: '🌪️',
    color: '#1A5276',
    category: 'Gió và Bão'
  },

  // Nắng nóng
  {
    id: 11,
    name: 'Nắng nóng cực đoan',
    description: 'Nhiệt độ trên 40°C, có thể gây say nắng',
    icon: '☀️',
    color: '#E74C3C',
    category: 'Nắng nóng'
  },
  {
    id: 12,
    name: 'Hạn hán',
    description: 'Thiếu mưa kéo dài, ảnh hưởng đến nguồn nước',
    icon: '🏜️',
    color: '#DC7633',
    category: 'Nắng nóng'
  },
  {
    id: 13,
    name: 'Cháy rừng',
    description: 'Cháy rừng do thời tiết khô hanh',
    icon: '🔥',
    color: '#C0392B',
    category: 'Nắng nóng'
  },
  {
    id: 14,
    name: 'Khô hạn',
    description: 'Độ ẩm thấp, thiếu nước tưới tiêu',
    icon: '🌵',
    color: '#D35400',
    category: 'Nắng nóng'
  },

  // Sương mù và Tầm nhìn
  {
    id: 15,
    name: 'Sương mù dày đặc',
    description: 'Sương mù làm giảm tầm nhìn dưới 100m',
    icon: '🌫️',
    color: '#BDC3C7',
    category: 'Sương mù và Tầm nhìn'
  },
  {
    id: 16,
    name: 'Mưa phùn kéo dài',
    description: 'Mưa phùn gây ẩm ướt và tầm nhìn kém',
    icon: '🌦️',
    color: '#95A5A6',
    category: 'Sương mù và Tầm nhìn'
  },
  {
    id: 17,
    name: 'Bụi mù',
    description: 'Bụi bẩn trong không khí làm giảm tầm nhìn',
    icon: '💨',
    color: '#7F8C8D',
    category: 'Sương mù và Tầm nhìn'
  },

  // Các sự cố khác
  {
    id: 18,
    name: 'Sấm sét',
    description: 'Sấm sét nguy hiểm, có thể gây cháy nổ',
    icon: '⚡',
    color: '#F39C12',
    category: 'Các sự cố khác'
  },
  {
    id: 19,
    name: 'Mưa đá',
    description: 'Mưa đá có thể gây thiệt hại về tài sản',
    icon: '🧊',
    color: '#ECF0F1',
    category: 'Các sự cố khác'
  },
  {
    id: 20,
    name: 'Tuyết rơi',
    description: 'Tuyết rơi (hiếm ở Việt Nam, chủ yếu vùng núi cao)',
    icon: '❄️',
    color: '#FFFFFF',
    category: 'Các sự cố khác'
  },
  {
    id: 21,
    name: 'Rét đậm rét hại',
    description: 'Nhiệt độ xuống thấp dưới 10°C',
    icon: '🧣',
    color: '#3498DB',
    category: 'Các sự cố khác'
  },
  {
    id: 22,
    name: 'Đường sá hư hỏng',
    description: 'Đường phố hư hỏng do thời tiết',
    icon: '🛣️',
    color: '#7F8C8D',
    category: 'Các sự cố khác'
  },
  {
    id: 23,
    name: 'Cây đổ',
    description: 'Cây cối bị đổ do gió mạnh hoặc mưa lớn',
    icon: '🌳',
    color: '#27AE60',
    category: 'Các sự cố khác'
  },
  {
    id: 24,
    name: 'Điện bị cắt',
    description: 'Mất điện do thời tiết xấu',
    icon: '⚡',
    color: '#F1C40F',
    category: 'Các sự cố khác'
  },
  {
    id: 25,
    name: 'Nước sinh hoạt thiếu',
    description: 'Thiếu nước do hạn hán hoặc lũ lụt',
    icon: '🚰',
    color: '#3498DB',
    category: 'Các sự cố khác'
  }
];

// Hàm để lấy danh sách theo category
export const getIncidentTypesByCategory = () => {
  const categories = {};
  incidentTypes.forEach(type => {
    if (!categories[type.category]) {
      categories[type.category] = [];
    }
    categories[type.category].push(type);
  });
  return categories;
};

// Hàm để lấy tất cả categories
export const getCategories = () => {
  return [...new Set(incidentTypes.map(type => type.category))];
};

