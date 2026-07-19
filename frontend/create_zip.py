import os
import zipfile
import fnmatch

def should_exclude(root, filename):
    # Exclude patterns for files and directories
    excludes = [
        'node_modules', 'dist', '.git', '.github', '.vscode', '.idea',
        'coverage', 'logs', '*.log', '.DS_Store', 'frontend_webclient.zip',
        'tsconfig.tsbuildinfo', 'create_zip.py', '__pycache__', 'test_build_dir'
    ]
    
    # Check if any part of the path matches an exclude pattern
    full_path = os.path.join(root, filename)
    rel_path = os.path.relpath(full_path, '.')
    
    parts = rel_path.split(os.sep)
    for part in parts:
        for pattern in excludes:
            if fnmatch.fnmatch(part, pattern):
                return True
    return False

def create_zip():
    zip_filename = 'frontend_webclient.zip'
    if os.path.exists(zip_filename):
        os.remove(zip_filename)
        
    with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk('.'):
            # Modify dirs in-place to skip excluded directories entirely
            dirs[:] = [d for d in dirs if not should_exclude(root, d)]
            
            for file in files:
                if not should_exclude(root, file):
                    file_path = os.path.join(root, file)
                    arcname = os.path.relpath(file_path, '.')
                    zipf.write(file_path, arcname)
                    
    # Verification
    print("Files in ZIP:")
    with zipfile.ZipFile(zip_filename, 'r') as zipf:
        namelist = zipf.namelist()
        for name in namelist:
            print(f"- {name}")
            
        if 'package.json' in namelist:
            print("\nSUCCESS: package.json is at the root of the ZIP.")
        else:
            print("\nERROR: package.json is NOT at the root of the ZIP.")
            
        if 'client-package.json' in namelist:
            print("SUCCESS: client-package.json is at the root of the ZIP.")
        else:
            print("ERROR: client-package.json is NOT at the root of the ZIP.")
            
        if 'package-lock.json' in namelist:
            print("SUCCESS: package-lock.json is present.")
        else:
            print("ERROR: package-lock.json is NOT present.")
            
    size_bytes = os.path.getsize(zip_filename)
    size_mb = size_bytes / (1024 * 1024)
    print(f"\nFinal ZIP size: {size_bytes} bytes ({size_mb:.2f} MB)")
    
    if size_mb > 50:
        print("\nWARNING: ZIP exceeds 50 MB.")

if __name__ == '__main__':
    create_zip()
