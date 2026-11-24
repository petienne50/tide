from pathlib import Path
from PIL import Image,ImageOps
import shutil,json,re,hashlib
root=Path(__file__).resolve().parent
target=root.parent/'tide-sites-review'
out=target/'dist'
out.mkdir(parents=True,exist_ok=True)
mapping={}
for file in (root/'out').rglob('*'):
    if not file.is_file(): continue
    rel=file.relative_to(root/'out')
    url='/'+str(rel).replace('\\','/')
    if file.suffix.lower() in ['.jpg','.jpeg','.png','.bmp']:
        name=hashlib.sha256(url.encode()).hexdigest()[:16]+'.webp'
        dest=out/'images'/name
        dest.parent.mkdir(exist_ok=True)
        with Image.open(file) as raw:
            im=ImageOps.exif_transpose(raw)
            im.thumbnail((1600,1600),Image.Resampling.LANCZOS)
            im.save(dest,'WEBP',quality=74,method=4)
        mapping[url]='/images/'+name
    elif file.suffix.lower() in ['.pdf','.docx','.pptx','.mp4']:
        mapping[url]='https://tidebelize.org'+url
    elif file.suffix.lower() not in ['.html']:
        dest=out/rel;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(file,dest)
assets=json.loads((root/'resources.json').read_text())
for u,v in assets.items():
    if v.startswith('/assets/'):mapping[v]=u
for file in (root/'out').rglob('*.html'):
    text=file.read_text(encoding='utf-8')
    text=re.sub(r'(src|href)="([^"]+)"',lambda m:m[1]+'="'+mapping.get(m[2],m[2])+'"',text)
    dest=out/file.relative_to(root/'out');dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text(text,encoding='utf-8')
(target/'.openai').mkdir(exist_ok=True)
(target/'.openai'/'hosting.json').write_text(json.dumps({'project_id':'appgprj_6b04f35ccdbc81918ec34858c3b303c1','static':{'directory':'dist'}},indent=2))
print('Review copy:',sum(f.stat().st_size for f in out.rglob('*') if f.is_file()),'bytes')
