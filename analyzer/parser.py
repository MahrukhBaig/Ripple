import ast
import os

def get_local_imports(file_path, project_root):
    """
    Ek Python file ko padhta hai aur dhundta hai
    ke woh kaunsi PROJECT files ko import karti hai.
    External libraries (flask, os, etc.) ignore karta hai.
    """
    imports = []

    with open(file_path, "r", encoding="utf-8") as f:
        source = f.read()

    tree = ast.parse(source)

    for node in ast.walk(tree):
        if isinstance(node, ast.ImportFrom):
            if node.module and node.level > 0:
                imports.append(node.module)

    return imports


def scan_project(project_root):
    """
    Poore project ki saari Python files scan karta hai
    aur har file ke imports return karta hai.
    """
    all_imports = {}

    for dirpath, dirnames, filenames in os.walk(project_root):
        for filename in filenames:
            if filename.endswith(".py"):
                full_path = os.path.join(dirpath, filename)
                imports = get_local_imports(full_path, project_root)
                all_imports[filename] = imports

    return all_imports