const fs = require('fs');
const path = require('path');

function walk(dir) {
  let res = [];
  for (const f of fs.readdirSync(dir)) {
    const fp = path.join(dir, f);
    if (fs.statSync(fp).isDirectory()) {
      if (!fp.includes('node_modules') && !fp.includes('.next') && !fp.includes('.git')) {
        res = res.concat(walk(fp));
      }
    } else if (fp.endsWith('.tsx') || fp.endsWith('.ts')) {
      res.push(fp);
    }
  }
  return res;
}

// 1. Collect all app pages (valid routes)
const appPages = new Set();
function findPages(dir, baseRoute = '') {
  for (const f of fs.readdirSync(dir)) {
    const fp = path.join(dir, f);
    if (fs.statSync(fp).isDirectory()) {
      if (f.startsWith('(') && f.endsWith(')')) {
        findPages(fp, baseRoute);
      } else if (!f.startsWith('.') && !f.startsWith('api')) {
        findPages(fp, baseRoute + '/' + f);
      }
    } else if (f === 'page.tsx' || f === 'page.ts') {
      appPages.add(baseRoute === '' ? '/' : baseRoute);
    }
  }
}
findPages('src/app');
console.log('Valid App Routes:');
console.log(Array.from(appPages).sort());

// 2. Scan all files for hrefs and router.push
const files = walk('src');
const linkReport = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  
  // href="..."
  const hrefMatches = content.matchAll(/href=["']([^"']+)["']/g);
  for (const match of hrefMatches) {
    linkReport.push({ file, type: 'href', target: match[1] });
  }

  // router.push(...) or redirect(...)
  const navMatches = content.matchAll(/(?:router\.push|redirect)\(["']([^"']+)["']\)/g);
  for (const match of navMatches) {
    linkReport.push({ file, type: 'push/redirect', target: match[1] });
  }
}

// Check validity
const broken = [];
const external = [];
const valid = [];
const anchors = [];

for (const item of linkReport) {
  const t = item.target;
  if (t.startsWith('http://') || t.startsWith('https://') || t.startsWith('mailto:') || t.startsWith('tel:')) {
    external.push(item);
    continue;
  }
  if (t.startsWith('#')) {
    anchors.push(item);
    continue;
  }

  const [route, hash] = t.split('#');
  const cleanRoute = route.split('?')[0];

  // Dynamic route check or static
  let exists = appPages.has(cleanRoute);
  if (!exists) {
    // Check if it matches dynamic routes like /dashboard/...
    for (const validRoute of appPages) {
      if (validRoute.includes('[') && validRoute.includes(']')) {
        const pattern = new RegExp('^' + validRoute.replace(/\[[^\]]+\]/g, '[^/]+') + '$');
        if (pattern.test(cleanRoute)) {
          exists = true;
          break;
        }
      }
    }
  }

  if (exists) {
    valid.push(item);
  } else {
    broken.push(item);
  }
}

console.log('\n--- BROKEN LINKS FOUND (' + broken.length + ') ---');
for (const b of broken) {
  console.log(`${b.file} -> [${b.type}] "${b.target}"`);
}
