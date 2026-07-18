import os
import zipfile

def create_zip():
    exclude_dirs = {'.git', '__pycache__', 'node_modules', 'tests', '.venv', '.pytest_cache', '.mypy_cache', '.ruff_cache', 'venv'}
    exclude_files = {'backend_deployment.zip', 'create_zip.py'}
    
    with zipfile.ZipFile('backend_deployment.zip', 'w', zipfile.ZIP_DEFLATED) as zipf:
        # We need to zip the contents of the 'backend' folder into the root of the ZIP.
        backend_dir = os.path.abspath('backend')
        for root, dirs, files in os.walk(backend_dir):
            # Exclude directories
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            
            for file in files:
                if file in exclude_files:
                    continue
                file_path = os.path.join(root, file)
                # Calculate the relative path within the zip file (relative to backend folder)
                arcname = os.path.relpath(file_path, backend_dir)
                zipf.write(file_path, arcname)

if __name__ == "__main__":
    create_zip()
    print("ZIP created successfully.")
