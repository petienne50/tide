const fs=require('fs'),path=require('path'),ch=require('cheerio');
const base='https://tidebelize.org', root=__dirname;
const save=(p,d)=>{fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,d)};
async function get(u,binary=false){for(let i=0;i<3;i++)try{const r=await fetch(u,{signal:AbortSignal.timeout(90000)});if(!r.ok)throw Error('HTTP '+r.status);return binary?Buffer.from(await r.arrayBuffer()):await r.json()}catch(e){if(i===2)throw e}}
async function pool(items,fn,n=6){let i=0;await Promise.all(Array.from({length:n},async()=>{while(i<items.length){const item=items[i++];await fn(item)}}))}
(async()=>{
let pages=JSON.parse(fs.readFileSync(path.join(root,'pages-1.json'))),posts=JSON.parse(fs.readFileSync(path.join(root,'posts-1.json'))),media=JSON.parse(fs.readFileSync(path.join(root,'media-1.json')));
pages.push(...await get(base+'/wp-json/wp/v2/pages?per_page=100&page=2'));
await pool(Array.from({length:13},(_,i)=>i+2),async n=>{const m=await get(base+'/wp-json/wp/v2/media?per_page=100&page='+n);media.push(...m);console.log('Media inventory',n)},4);
save(path.join(root,'archive/content.json'),JSON.stringify({pages,posts,media}));
const urls=new Set();let records=[...pages,...posts].map(p=>{const $=ch.load(p.content.rendered);$('script,style').remove();$('img').each((_,e)=>{let src=$(e).attr('src');if(src)urls.add(new URL(src,base).href)});$('a[href]').each((_,e)=>{let u=$(e).attr('href');if(/\.(pdf|docx?|xlsx?|zip|pptx?|jpe?g|png|webp)(\?|$)/i.test(u))urls.add(new URL(u,base).href)});return {id:p.id,url:p.link,title:ch.load(p.title.rendered).text(),type:p.type,html:$.root().html()}});
for(const m of media){urls.add(m.source_url);let o=m.media_details?.original_image;if(o)urls.add(new URL(o,m.source_url).href)}
let map={},failures=[];let count=0;await pool([...urls],async u=>{try{let parsed=new URL(u);let local=decodeURIComponent(parsed.pathname);if(!local.startsWith('/wp-content/'))local='/assets/external/'+parsed.hostname+local;let out=path.join(root,'dist',local);if(!fs.existsSync(out)){let b=await get(u,true);save(out,b)}map[u]=local;if(++count%50===0)console.log('Downloaded',count,'of',urls.size)}catch(e){failures.push({url:u,error:e.message})}},8);
save(path.join(root,'archive/asset-map.json'),JSON.stringify(map,null,2));save(path.join(root,'archive/download-failures.json'),JSON.stringify(failures,null,2));save(path.join(root,'archive/records.json'),JSON.stringify(records));console.log('DONE',records.length,'pages/posts',Object.keys(map).length,'assets',failures.length,'failures');
})().catch(e=>{console.error(e);process.exitCode=1});
