const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, 'build');
const version = Date.now(); // or use package.json version

// Update index.html with versioned files
const indexPath = path.join(buildDir, 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

// Add version to CSS and JS files
indexContent = indexContent
  .replace(/(css\/.*?\.css)/g, `$1?v=${version}`)
  .replace(/(js\/.*?\.js)/g, `$1?v=${version}`);

fs.writeFileSync(indexPath, indexContent);
console.log('Files versioned successfully');