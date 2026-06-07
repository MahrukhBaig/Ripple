import ast
import os
import tempfile
import subprocess


def clone_repo(github_url):
    """
    Clone a GitHub repository into a temporary directory
    using subprocess git command.
    Returns the path to the cloned repo.
    """
    temp_dir = tempfile.mkdtemp()
    subprocess.run(
        ["git", "clone", "--depth=1", github_url, temp_dir],
        check=True,
        capture_output=True
    )
    return temp_dir


def get_local_imports(file_path):
    """
    Read a single Python file and find which
    project files it imports using relative imports.
    External libraries like flask, os etc are ignored.
    """
    imports = []

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            source = f.read()

        tree = ast.parse(source)

        for node in ast.walk(tree):
            if isinstance(node, ast.ImportFrom):
                if node.module and node.level > 0:
                    imports.append(node.module)

    except Exception:
        # Skip files that cannot be read or parsed
        pass

    return imports


def scan_project(project_root):
    """
    Walk through all Python files in the project,
    collect their local imports, and return a dictionary.
    Keys are filenames, values are lists of imported modules.
    """
    all_imports = {}

    for dirpath, dirnames, filenames in os.walk(project_root):
        # Skip irrelevant directories
        dirnames[:] = [d for d in dirnames if d not in [
            '__pycache__', '.git', 'venv', 'node_modules', '.env',
            'migrations', 'static', 'templates'
        ]]

        for filename in filenames:
            if filename.endswith(".py"):
                full_path = os.path.join(dirpath, filename)
                imports = get_local_imports(full_path)
                all_imports[filename] = imports

    return all_imports