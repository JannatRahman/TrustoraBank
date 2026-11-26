const fs = require('fs');

const files = [
  'src/components/Banner.tsx',
  'src/components/LandingSections.tsx',
  'src/components/Contact.tsx',
];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const matches = content.match(/id="[^"]+"/g) || [];
  console.log(file, matches);
}
