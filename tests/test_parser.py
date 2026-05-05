import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from analyzer.parser import scan_project
from analyzer.graph import build_graph, get_impact

project_root = r"C:\Users\MAHRUKH BAIG\Desktop\flask\examples\tutorial\flaskr"

# Step 1: Project scan karo
scan_result = scan_project(project_root)

# Step 2: Graph banao
G = build_graph(scan_result)

# Step 3: Graph print karo
print("=== NODES (files) ===")
for node in G.nodes():
    print(f"  {node}")

print("\n=== EDGES (connections) ===")
for edge in G.edges():
    print(f"  {edge[0]} --> {edge[1]}")

print("\n=== IMPACT ANALYSIS ===")
changed_file = "db.py"
affected = get_impact(G, changed_file)
print(f"Agar '{changed_file}' change ho toh affected files:")
for f in affected:
    print(f"  ⚠️  {f}")