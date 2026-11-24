const fs=require('fs'),path=require('path'),cp=require('child_process'),ch=require('cheerio');
const root=path.resolve(__dirname,'..');const walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(p,e.name)):[path.join(p,e.name)]);
const files=walk(path.join(root,'out')).filter(f=>f.endsWith('.html'));
const originals=new Map(files.map(f=>[f,fs.readFileSync(f,'utf8')]));
const targets=['partials/header.html','partials/menu.html','partials/footer.html','pages/paynes-creek-national-park.html'];
const saved=new Map(targets.map(f=>[f,fs.readFileSync(path.join(root,f),'utf8')]));
function build(){cp.execFileSync(process.execPath,['build.cjs'],{cwd:root,env:{...process.env,TIDE_CONTENT_ONLY:'1'},stdio:'pipe'})}
try{
  for(let i=0;i<targets.length;i++)fs.appendFileSync(path.join(root,targets[i]),`\n<!-- shared-layout-check-${i} -->\n`);
  build();
  for(const f of files){let html=fs.readFileSync(f,'utf8');for(let i=0;i<3;i++)if(!html.includes(`shared-layout-check-${i}`))throw Error('Shared partial did not reach '+path.relative(root,f));let custom=html.includes('shared-layout-check-3');if(custom!==(path.relative(path.join(root,'out'),f).replaceAll('\\','/')==='paynes-creek-national-park/index.html'))throw Error('Page customization reached the wrong page');}
  console.log('Shared header/menu/footer reached all '+files.length+' pages; individual page edit stayed isolated.');
}finally{for(const [f,text]of saved)fs.writeFileSync(path.join(root,f),text);build()}
for(const [f,html]of originals){if(fs.readFileSync(f,'utf8')!==html)throw Error('Restoring templates changed output '+f)}
for(const f of files){let $=ch.load(fs.readFileSync(f));if($('body>header').length!==1||$('body>footer').length!==1||$('main#main').length!==1)throw Error('Missing or repeated page sections '+f)}
console.log('Restored production templates. Every page has one header, main section, and footer.');
