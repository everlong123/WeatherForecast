const http = require('http');

function get(path){
  return new Promise((resolve,reject)=>{
    http.get('http://localhost:8080'+path, res=>{
      let data='';
      res.on('data',c=>data+=c);
      res.on('end',()=>{
        try{resolve(JSON.parse(data));}catch(e){resolve(data);}        
      });
    }).on('error', reject);
  });
}

(async()=>{
  try{
    console.log('GET /api/locations/provinces');
    const provinces = await get('/api/locations/provinces');
    console.log('Provinces count:', Object.keys(provinces).length);
    const sampleProv = Object.keys(provinces)[0];
    console.log('Sample province:', sampleProv);

    console.log('\nGET /api/locations/districts?province='+encodeURIComponent(sampleProv));
    const districts = await get('/api/locations/districts?province='+encodeURIComponent(sampleProv));
    console.log('Districts count:', districts.length || Object.keys(districts).length);
    const sampleDist = Array.isArray(districts) ? districts[0] : Object.keys(districts)[0];
    console.log('Sample district:', sampleDist);

    console.log('\nGET /api/locations/wards?province='+encodeURIComponent(sampleProv)+'&district='+encodeURIComponent(sampleDist));
    const wards = await get('/api/locations/wards?province='+encodeURIComponent(sampleProv)+'&district='+encodeURIComponent(sampleDist));
    console.log('Wards count:', wards.length || Object.keys(wards).length);
    console.log('Sample wards (first 10):', (wards.slice? wards.slice(0,10) : wards));
  }catch(e){
    console.error('Error calling endpoints:', e.message||e);
    process.exit(2);
  }
})();
