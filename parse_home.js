const parser = require('@babel/parser');
const fs = require('fs');
const src = fs.readFileSync('src/pages/Home.js', 'utf8');
try {
  parser.parse(src, { sourceType: 'module', plugins: ['jsx'] });
  console.log('parse ok');
} catch (e) {
  console.error(e.message);
  console.error(e.loc);
  process.exit(1);
}
