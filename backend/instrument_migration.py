file_path = 'backend/app/db/migrations/versions/de379822be81_initial_schema.py'
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
in_upgrade = False
for i, line in enumerate(lines):
    if 'from sqlalchemy.dialects import postgresql' in line:
        new_lines.append(line)
        new_lines.append('import logging\n')
        new_lines.append('logger = logging.getLogger("alembic.migration")\n\n')
        continue
    
    if 'def upgrade() -> None:' in line:
        in_upgrade = True
    
    if in_upgrade and 'def downgrade()' in line:
        in_upgrade = False
        
    if in_upgrade:
        if 'op.execute("CREATE EXTENSION' in line or 'op.execute(\'CREATE EXTENSION' in line:
            ext_name = 'postgis' if 'postgis' in line else 'uuid-ossp'
            new_lines.append(f'    logger.info("Executing extension creation for {ext_name}...")\n')
            new_lines.append(line)
            new_lines.append(f'    logger.info("Executed extension creation for {ext_name}.")\n')
            continue
            
        if '.create(op.get_bind(), checkfirst=True)' in line:
            enum_var = line.split('.create(')[0].strip()
            new_lines.append(f'    logger.info("Creating enum {enum_var}...")\n')
            new_lines.append(line)
            new_lines.append(f'    logger.info("Enum {enum_var} created.")\n')
            continue
            
        if 'op.create_table(' in line:
            tbl_line = lines[i+1].strip()
            tbl_name = tbl_line.strip('",')
            new_lines.append(f'    logger.info("Creating table {tbl_name}...")\n')
            new_lines.append(line)
            continue
            
        if 'op.create_index(' in line:
            new_lines.append(f'    logger.info("Creating index...")\n')
            new_lines.append(line)
            continue
            
        if line == '    )\n':
            new_lines.append(line)
            new_lines.append(f'    logger.info("Table block closed.")\n')
            continue

    new_lines.append(line)

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
