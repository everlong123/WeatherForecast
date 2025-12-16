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

async function tryOnce(){
  const provinces = await get('/api/locations/provinces');
  console.log('Provinces count:', Object.keys(provinces).length);
}

(async()=>{
  for(let i=0;i<15;i++){
    try{
      await tryOnce();
      console.log('Endpoints reachable');
      process.exit(0);
    }catch(e){
      console.log('Attempt',i+1,'failed:', e.message||e);
      await new Promise(r=>setTimeout(r,2000));
    }
  }
  console.error('Endpoints still unreachable after retries');
  process.exit(2);
})();
