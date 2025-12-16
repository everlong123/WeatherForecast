const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const srcDir = path.join(repoRoot, 'vietnam-provinces-main', 'vietnam-provinces-main', 'src', 'jsonFiles');
const outPath = path.join(repoRoot, 'weather', 'src', 'main', 'resources', 'locations.json');

function stripPrefix(name) {
  if (!name) return name;
  return name.replace(/^Tỉnh |^Thành phố |^Thành phố |^Thị xã |^Thị xã /, '').trim();
}

function main() {
  if (!fs.existsSync(srcDir)) {
    console.error('Source jsonFiles directory not found:', srcDir);
    process.exit(2);
  }

  const wards = JSON.parse(fs.readFileSync(path.join(srcDir, 'wards.json'), 'utf8'));

  const mapping = {};

  for (const w of wards) {
    const provRaw = w.provinceName || w.province_name || '';
    const distRaw = w.districtName || w.district_name || '';
    const wardName = w.name || w.ward_name || '';

    const prov = stripPrefix(provRaw);
    const dist = distRaw.replace(/^Quận |^Huyện |^Thị xã |^Thành phố |^Phường |^Xã /, '').trim() || distRaw;

    if (!mapping[prov]) mapping[prov] = {};
    if (!mapping[prov][dist]) mapping[prov][dist] = [];
    mapping[prov][dist].push(wardName);
  }

  // Sort and deduplicate ward lists
  for (const p of Object.keys(mapping)) {
    for (const d of Object.keys(mapping[p])) {
      const arr = Array.from(new Set(mapping[p][d]));
      arr.sort((a,b)=>a.localeCompare(b,'vi'));
      mapping[p][d] = arr;
    }
  }

  // Write output
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(mapping, null, 2), 'utf8');
  console.log('Wrote locations.json to', outPath);
}

main();
