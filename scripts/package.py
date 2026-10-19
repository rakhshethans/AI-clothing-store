"""Package this project without private data, caches or generated snapshots."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import hashlib

root = Path(__file__).resolve().parent.parent
output = root.parent / 'Threadline-startup-project.zip'
excluded = {'node_modules', 'private-data', 'snapshots', '__pycache__', '.git'}
with ZipFile(output, 'w', ZIP_DEFLATED) as archive:
    for item in sorted(root.rglob('*')):
        relative = item.relative_to(root)
        if item.is_file() and not any(part in excluded for part in relative.parts) and item.name not in {'.env', '.env.local'} and not item.name.endswith(('.log', '.staged')):
            archive.write(item, Path('threadline') / relative)
with ZipFile(output) as archive:
    assert archive.testzip() is None
    names = archive.namelist()
    assert 'threadline/Threadline.html' in names
    assert 'threadline/.github/workflows/check.yml' in names
    assert 'threadline/IMPLEMENTATION_LOG.md' in names
print(str(output))
print(f'{len(names)} files; {output.stat().st_size} bytes; SHA256 {hashlib.sha256(output.read_bytes()).hexdigest()}')
