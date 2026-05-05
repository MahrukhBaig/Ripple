from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from analyzer.parser import scan_project
from analyzer.graph import build_graph, get_impact

app = FastAPI(
    title="Ripple API",
    description="AI-powered code impact analyzer",
    version="1.0.0"
)

# CORS — React frontend ko API se baat karne deta hai
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Ripple API is live 🌊"}

@app.post("/analyze")
def analyze(project_path: str, changed_file: str):
    """
    Koi bhi project path lo,
    changed file batao —
    impacted files return karo.
    """
    scan_result = scan_project(project_path)
    G = build_graph(scan_result)
    affected = get_impact(G, changed_file)

    return {
        "changed_file": changed_file,
        "affected_files": list(affected),
        "total_affected": len(affected)
    }

@app.get("/graph")
def graph(project_path: str):
    """
    Poora dependency graph return karta hai
    nodes aur edges ke saath.
    """
    scan_result = scan_project(project_path)
    G = build_graph(scan_result)

    return {
        "nodes": list(G.nodes()),
        "edges": [{"source": e[0], "target": e[1]} for e in G.edges()]
    }