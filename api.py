import os
import shutil
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from analyzer.parser import scan_project, clone_repo
from analyzer.graph import build_graph, get_impact
from analyzer.bob import explain_impact

load_dotenv()

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Ripple API starting...")
    yield
    print("Ripple API shutting down...")

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
async def analyze(github_url: str, changed_file: str):
    """
    Clone a GitHub repo, trace impact of a changed file,
    and return an AI explanation.
    """
    temp_dir = None

    try:
        # Step 1: Clone the repo into a temporary directory
        temp_dir = clone_repo(github_url)

        # Step 2: Scan all Python files
        scan_result = scan_project(temp_dir)

        if not scan_result:
            raise HTTPException(
                status_code=404,
                detail=f"No Python files found in repo: {github_url}"
            )

        # Step 3: Build dependency graph
        G = build_graph(scan_result)

        # Step 4: Trace impact of the changed file
        affected = get_impact(G, changed_file)

        # Step 5: Get AI explanation
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

    finally:
        # Always clean up the temporary directory
        if temp_dir and os.path.exists(temp_dir):
            shutil.rmtree(temp_dir, ignore_errors=True)

@app.get("/graph")
async def graph(github_url: str):
    """
    Clone a GitHub repo and return its full dependency graph.
    """
    temp_dir = None

    try:
        temp_dir = clone_repo(github_url)
        scan_result = scan_project(temp_dir)

        if not scan_result:
            raise HTTPException(
                status_code=404,
                detail=f"No Python files found in repo: {github_url}"
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

    finally:
        if temp_dir and os.path.exists(temp_dir):
            shutil.rmtree(temp_dir, ignore_errors=True)