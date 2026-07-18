import os
import sys

def get_size(start_path):
    total_size = 0
    if not os.path.exists(start_path):
        return 0
    if os.path.isfile(start_path):
        return os.path.getsize(start_path)
    for dirpath, dirnames, filenames in os.walk(start_path):
        for f in filenames:
            fp = os.path.join(dirpath, f)
            if not os.path.islink(fp):
                total_size += os.path.getsize(fp)
    return total_size

def analyze_site_packages(path):
    if not os.path.exists(path):
        print(f"Path not found: {path}")
        return
    
    packages = []
    for item in os.listdir(path):
        item_path = os.path.join(path, item)
        if os.path.isdir(item_path) and not item.endswith('.dist-info') and not item.endswith('.egg-info'):
            size_mb = get_size(item_path) / (1024 * 1024)
            packages.append((item, size_mb))
            
    packages.sort(key=lambda x: x[1], reverse=True)
    
    print(f"--- Top 20 Packages in {path} ---")
    for name, size in packages[:20]:
        print(f"{name}: {size:.2f} MB")

analyze_site_packages('backend/.venv/Lib/site-packages')
analyze_site_packages('ai-engine/.venv/Lib/site-packages')
