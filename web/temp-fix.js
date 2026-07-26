const fs=require('fs');
const files=['admin/users/page.tsx','admin/users/brokers/page.tsx'];
files.forEach(f=>{
  let p='D:/LocalD/All-MyTest/ICT-Project/Dalaal/web/app/pages/'+f;
  let c=fs.readFileSync(p,'utf8');
  c=c.replace(/className=\\text-xs font-medium \}/g,'className="text-xs font-medium text-emerald-600"');
  c=c.replace(/\(?:u|b)\.status \|\|/g, function(m){return m[1]+'.isActive ?';});
  fs.writeFileSync(p,c);
  console.log('Fixed: '+f);
});
