const fs = require('fs');

const subpages = [
  'src/components/Services.tsx',
  'src/components/Loans.tsx',
  'src/components/Security.tsx',
  'src/components/AboutUs.tsx',
  'src/components/Contact.tsx',
  'src/app/not-found.tsx',
  'src/app/unauthorized/page.tsx',
  'src/app/login/page.tsx',
  'src/app/register/page.tsx',
];

for (const file of subpages) {
  if (fs.existsSync(file)) {
    const c = fs.readFileSync(file, 'utf8');
    const hrefs = c.match(/href=["'][^"']+["']/g) || [];
    console.log(`\n=== ${file} (${hrefs.length} links) ===`);
    console.log(Array.from(new Set(hrefs)));
  }
}
