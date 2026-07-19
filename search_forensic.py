import os
import re

def search_repo():
    keywords = ['localhost', '127.0.0.1', 'postgresql://', 'postgresql+psycopg2://', 'sqlite://']
    results = {k: [] for k in keywords}
    
    ignore_dirs = ['node_modules', '.git', '.venv', '__pycache__', 'dist', 'temp_appsail', 'test_venv', 'test_deps_venv']
    
    for root, dirs, files in os.walk('.'):
        dirs[:] = [d for d in dirs if d not in ignore_dirs]
        for file in files:
            if file.endswith(('.py', '.json', '.md', '.yml', '.yaml', '.txt', '.tsx', '.ts', '.env', '.env.example', '.env.production.example', '.ini')):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        for i, line in enumerate(f):
                            for k in keywords:
                                if k in line:
                                    results[k].append(f"{filepath}:{i+1} -> {line.strip()}")
                except Exception:
                    pass
                    
    for k, v in results.items():
        print(f"--- {k} ---")
        for line in v:
            print(line)

if __name__ == '__main__':
    search_repo()
