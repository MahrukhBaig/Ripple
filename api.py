import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from analyzer.parser import scan_project
from analyzer.graph import build_graph, get_impact
from analyzer.bob import explain_impact

load_dotenv()

# Allowed origins — production mein sirf apna frontend
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🌊 Ripple API starting...")
    yield
    print("🌊 Ripple API shutting down...")

app = FastAPI(
    title="Ripple API",
    description="AI-powered code impact analyzer",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization"],
)

@app.get("/")
async def root():
    return {"message": "Ripple API is live 🌊", "version": "1.0.0"}

@app.post("/analyze")
async def analyze(project_path: str, changed_file: str):
    """
    Project scan karo, impact trace karo,
    aur AI se explanation lo.
    """
    try:
        # Step 1: Project scan
        scan_result = scan_project(project_path)

        if not scan_result:
            raise HTTPException(
                status_code=404,
                detail=f"No Python files found at: {project_path}"
            )

        # Step 2: Graph banao
        G = build_graph(scan_result)

        # Step 3: Impact trace karo
        affected = get_impact(G, changed_file)

        # Step 4: AI se explanation lo
        explanation = await explain_impact(changed_file, list(affected))

        return {
            "changed_file": changed_file,
            "affected_files": list(affected),
            "total_affected": len(affected),
            "explanation": explanation
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )

@app.get("/graph")
async def graph(project_path: str):
    """
    Poora dependency graph return karta hai.
    """
    try:
        scan_result = scan_project(project_path)

        if not scan_result:
            raise HTTPException(
                status_code=404,
                detail=f"No Python files found at: {project_path}"
            )

        G = build_graph(scan_result)

        return {
            "nodes": list(G.nodes()),
            "edges": [{"source": e[0], "target": e[1]} for e in G.edges()]
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Graph generation failed: {str(e)}"
        )