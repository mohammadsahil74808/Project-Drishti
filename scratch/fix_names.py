import glob
import os

for f in glob.glob('app/**/*.py', recursive=True):
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    new_content = content.replace("VehicleCrimeRecord", "Vehicle").replace("MissingPersonRecord", "MissingPerson")
    if new_content != content:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(new_content)
