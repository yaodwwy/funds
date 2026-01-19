const fs = require('fs');
const path = require('path');

const packagePath = path.join(__dirname, '../package.json');
const manifestPath = path.join(__dirname, '../src/manifest.json');

function updateVersion(filePath) {
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const versionParts = content.version.split('.').map(Number);
  
  // 增加最后一位修订号
  versionParts[2] += 1;
  const newVersion = versionParts.join('.');
  
  content.version = newVersion;
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n');
  console.log(`Updated ${path.basename(filePath)} version to ${newVersion}`);
  return newVersion;
}

const newVer = updateVersion(packagePath);
updateVersion(manifestPath);

