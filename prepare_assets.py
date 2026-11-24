from pathlib import Path
from PIL import Image,ImageOps
import shutil,json
root=Path(__file__).resolve().parent
source=root/'dist'/'wp-content'
dest=root/'out'/'wp-content'
deferred=[];count=0
for file in source.rglob('*'):
    if not file.is_file(): continue
    out=dest/file.relative_to(source)
    out.parent.mkdir(parents=True,exist_ok=True)
    try:
        if file.suffix.lower() in ['.jpg','.jpeg','.png','.bmp']:
            with Image.open(file) as raw:
                im=ImageOps.exif_transpose(raw)
                im.thumbnail((2400,2400),Image.Resampling.LANCZOS)
                if file.suffix.lower() in ['.jpg','.jpeg']:
                    im.convert('RGB').save(out,quality=86,optimize=True,progressive=True)
                else: im.save(out,optimize=True)
        elif file.stat().st_size>25*1024*1024:
            deferred.append({'path':'/wp-content/'+str(file.relative_to(source)).replace('\\','/'),'bytes':file.stat().st_size,'reason':'Exceeds static hosting single-file size limit; original preserved locally.'})
            continue
        else: shutil.copy2(file,out)
        count+=1
    except Exception as e:
        deferred.append({'path':str(file),'reason':str(e)})
(root/'archive'/'large-files.json').write_text(json.dumps(deferred,indent=2))
print(f'Prepared {count} public assets. {len(deferred)} large files preserved in downloads only.')
