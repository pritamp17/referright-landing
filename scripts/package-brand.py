"""Package the current public artwork after generating SVG and raster exports."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import shutil

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'public'
BRAND = PUBLIC / 'brand_assets'
archive_path = BRAND / 'downloads/rightrefer-logo-3-louize.zip'

with ZipFile(archive_path, 'w', ZIP_DEFLATED) as archive:
    for asset in sorted(BRAND.rglob('*')):
        if asset.suffix in {'.svg', '.png', '.webp', '.md'}:
            archive.write(asset, Path('brand_assets') / asset.relative_to(BRAND))

with ZipFile(archive_path) as archive:
    assert archive.testzip() is None
    count = len(archive.namelist())
shutil.copyfile(archive_path, ROOT / 'docs/brand/rightrefer-brand-kit.zip')
print(f'Packaged {count} files: {archive_path}')
