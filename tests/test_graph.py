import networkx as nx

from analyzer.graph import get_impact


def test_get_impact_handles_missing_changed_file():
    G = nx.DiGraph()
    G.add_edge("a.py", "b.py")

    affected = get_impact(G, "missing.py")

    assert affected == set()
