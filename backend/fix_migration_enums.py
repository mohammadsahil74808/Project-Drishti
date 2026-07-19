import re
file_path = 'backend/app/db/migrations/versions/de379822be81_initial_schema.py'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# We want to replace name="<enum_name>" with name="<enum_name>", create_type=False
# ONLY if it's inside sa.Column(..., postgresql.ENUM(...)
# We can find all lines with postgresql.ENUM and if the line contains sa.Column or if the previous line contains sa.Column (actually ENUM can be multi-line).
# Let's do a simple regex that finds postgresql.ENUM(...) and if it doesn't have create_type=False, add it.
# BUT we must skip the explicit `.create` ones. The explicit ones look like:
# xxx_enum = postgresql.ENUM("a", "b", name="xxx")
# So if the line contains " = postgresql.ENUM", it is an explicit one. We should NOT touch it.

lines = content.split('\n')
new_lines = []
in_enum_def = False
for line in lines:
    if " = postgresql.ENUM(" in line:
        in_enum_def = True
        new_lines.append(line)
        continue
    
    if in_enum_def:
        if 'name="' in line:
            # this is the end of the explicit enum definition
            in_enum_def = False
            new_lines.append(line)
            continue
        else:
            new_lines.append(line)
            continue
            
    # If we are not in an explicit enum def, and we see name="...", we replace it if it's an enum
    # Actually, all inline ENUMs have name="xxx"
    if 'name="' in line and 'create_type=False' not in line:
        # Check if it's an ENUM inline
        # Usually it's like: name="user_role"
        line = re.sub(r'name="([^"]+)"', r'name="\1", create_type=False', line)
    new_lines.append(line)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(new_lines))
