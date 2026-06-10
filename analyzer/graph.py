import networkx as nx

def build_graph(scan_result):
    """
    parser.py ka output leta hai aur
    ek directed graph banata hai.
    Nodes = files
    Edges = dependencies (kaun kisse import karta hai)
    """
    G = nx.DiGraph()

    for file, imports in scan_result.items():
        G.add_node(file)
        for imp in imports:
            imported_file = imp + ".py"
            G.add_edge(file, imported_file)

    return G
def get_impact(G, changed_file):
    """
    Ek changed file leta hai aur batata hai
    kaunsi files affect hongi.
    BFS use karta hai — graph mein ripple effect trace karta hai.
    """
    if changed_file not in G:
        return set()

    affected = set()

    for node in G.nodes():
        if node != changed_file and nx.has_path(G, node, changed_file):
            affected.add(node)

    return affected
