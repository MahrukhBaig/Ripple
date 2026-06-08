import ast
import os
import tempfile
import zipfile
import urllib.request


def clone_repo(github_url):
    """
    Clone a GitHub repository by downloading as ZIP.
    This avoids needing git or libgit2 binaries.
    Returns the path to the cloned repo.
    """
    temp_dir = tempfile.mkdtemp()
    
    # Convert GitHub URL to raw ZIP download URL
    # https://github.com/user/repo -> https://github.com/user/repo/archive/refs/heads/main.zip
    if github_url.endswith('.git'):
        github_url = github_url[:-4]
    
    zip_url = f"{github_url}/archive/refs/heads/main.zip"
    zip_path = os.path.join(temp_dir, "repo.zip")
    
    # Download the ZIP
    urllib.request.urlretrieve(zip_url, zip_path)
    
    # Extract it
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(temp_dir)
    
    # Find the extracted folder and move its contents to temp_dir root
    extracted_folders = [f for f in os.listdir(temp_dir) if os.path.isdir(os.path.join(temp_dir, f)) and f != '__pycache__']
    if extracted_folders:
        extracted_folder = os.path.join(temp_dir, extracted_folders[0])
        for item in os.listdir(extracted_folder):
            src = os.path.join(extracted_folder, item)
            dst = os.path.join(temp_dir, item)
            if os.path.isdir(src):
                import shutil
                shutil.move(src, dst)
            else:
                os.rename(src, dst)
        os.rmdir(extracted_folder)
    
    os.remove(zip_path)
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