const fs=require('node:fs'),path=require('node:path');
const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function createRenderer(root){
  const base=path.resolve(root),cache=new Map();
  function render(name,values={},stack=[]){
    const file=path.resolve(base,name);
    if(!file.startsWith(base+path.sep)||!file.endsWith('.html'))throw Error('Invalid template path: '+name);
    if(stack.includes(file))throw Error('Circular template include: '+[...stack,file].map(p=>path.relative(base,p)).join(' -> '));
    if(!cache.has(file))cache.set(file,fs.readFileSync(file,'utf8'));
    return cache.get(file).replace(/\{\{>\s*([^}]+?)\s*\}\}|\{\{\{\s*(\w+)\s*\}\}\}|\{\{\s*(\w+)\s*\}\}/g,(_,include,raw,escaped)=>{
      if(include)return render(include.trim(),values,[...stack,file]);
      const key=raw||escaped;
      if(!Object.hasOwn(values,key))throw Error('Missing template value '+key+' in '+name);
      return raw?String(values[key]??''):escapeHtml(values[key]);
    });
  }
  return render;
}
module.exports={createRenderer};
