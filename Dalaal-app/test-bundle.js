const http = require('http');
http.get('http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.routerRoot=src%2Fapp&transform.reactCompiler=true', res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const lines = data.split('\n');
    let found = false;
    lines.forEach((l, i) => {
      if (l.includes('import.meta')) {
        console.log('MATCH at line', i, ':', l);
        console.log(lines.slice(Math.max(0, i-2), i+3).join('\n'));
        console.log('---');
        found = true;
      }
    });
    if (!found) console.log('No import.meta found');
  });
}).on('error', err => console.log(err.message));
