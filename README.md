🌊 Ripple: AI-Powered Code Impact Analyzer
=============================================

See what breaks before you change anything

**Ripple** is an enterprise-grade, AI-powered code impact analyzer designed to trace dependency ripple effects in Python projects. By combining **FastAPI (Python), React (Vite), NetworkX (Graph Analysis), and Groq AI (LLaMA 3.3 70B)**, the platform provides real-time dependency analysis and AI-generated impact explanations for safer code changes.

---

## 🔗 Live Production Gateway

🚀 [Ripple Dashboard](https://ripple-frontend.vercel.app)

| Component | Status | Platform |
|-----------|--------|----------|
| 🎨 FRONTEND | Active | Vercel |
| ⚙️ BACKEND API | Active | Railway |
| 🧠 AI ENGINE | Ready | Groq (LLaMA) |
| 📊 GRAPH ANALYZER | Ready | NetworkX |

---

## 🏗️ Production System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Ripple Platform                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐              ┌──────────────┐             │
│  │   Frontend   │              │   Backend    │             │
│  │ React + Vite │◄────────────►│  FastAPI     │             │
│  │   (Vercel)   │    HTTP      │  (Railway)   │             │
│  └──────────────┘              └──────────────┘             │
│         │                               │                    │
│         │                               ├─► Parser (AST)    │
│         │                               ├─► Graph Builder   │
│         │                               │   (NetworkX)      │
│         │                               └─► AI Explainer    │
│         │                                   (Groq/LLaMA)    │
│         │                                                    │
│         └──► GitHub API ────► Clone & Analyze               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚡ Key Features

- **Real-time Dependency Tracing** - Trace file dependencies using AST parsing and graph traversal
- **AI-Generated Explanations** - Understand impact in plain English via Groq LLaMA AI
- **GitHub Integration** - Analyze any public GitHub repository directly
- **Graph Visualization** - Get full dependency graph of any project
- **Fast Analysis** - Process Python projects in seconds with lazy evaluation
- **Production Ready** - Deployed on Vercel (frontend) & Railway (backend)

---

## 🛠️ Tech Stack

### Backend
- **FastAPI** 0.136.1 - Modern, fast web framework for APIs
- **NetworkX** 3.6.1 - Graph algorithms and dependency analysis
- **Groq API** 1.2.0 - LLaMA 3.3 70B for AI explanations
- **Pydantic** 2.13.3 - Data validation and serialization
- **Python** 3.13 - Core runtime

### Frontend
- **React** + **Vite** - Modern, fast UI development
- **ESLint** - Code quality and consistency
- **Node.js** - JavaScript runtime

### Deployment
- **Vercel** - Frontend hosting (React SPA)
- **Railway** - Backend hosting (Python/FastAPI)
- **GitHub** - Repository integration

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.11+**
- **Node.js 16+**
- **Git**
- **Groq API Key** (free tier available at [groq.com](https://groq.com))

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ripple.git
cd ripple
```

#### 2. Backend Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
GROQ_API_KEY=your_groq_api_key_here
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
EOF
```

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

#### 4. Start Backend

```bash
# From project root
uvicorn api:app --reload --host 0.0.0.0 --port 8000
```

Backend runs at: `http://localhost:8000`  
Frontend runs at: `http://localhost:5173`

---

## 📖 API Documentation

### Base URL
- **Development**: `http://localhost:8000`
- **Production**: `https://web-production-d4fa0.up.railway.app`

### Endpoints

#### 1. Health Check
```http
GET /
```

**Response:**
```json
{
  "message": "Ripple API is live 🌊",
  "version": "1.0.0"
}
```

---

#### 2. Analyze Impact
```http
POST /analyze?github_url=<url>&changed_file=<file>
```

**Parameters:**
- `github_url` (string, required) - GitHub repository URL
  - Example: `https://github.com/pallets/flask`
- `changed_file` (string, required) - File path relative to repo root
  - Example: `db.py`, `src/core/auth.py`

**Response:**
```json
{
  "changed_file": "db.py",
  "affected_files": ["migrations.py", "models.py", "api.py"],
  "total_affected": 3,
  "explanation": "Changing db.py will affect 3 files that depend on it. migrations.py imports from db.py for database schema. models.py uses database connection from db.py. api.py relies on db models for API endpoints. Before making changes, ensure all three files are tested and database migrations are validated."
}
```

**Example Request:**
```bash
curl -X POST "http://localhost:8000/analyze?github_url=https://github.com/pallets/flask&changed_file=db.py"
```

---

#### 3. Get Dependency Graph
```http
GET /graph?github_url=<url>
```

**Parameters:**
- `github_url` (string, required) - GitHub repository URL

**Response:**
```json
{
  "nodes": ["app.py", "config.py", "db.py", "models.py", "api.py"],
  "edges": [
    {"source": "app.py", "target": "config.py"},
    {"source": "models.py", "target": "db.py"},
    {"source": "api.py", "target": "models.py"}
  ]
}
```

**Example Request:**
```bash
curl "http://localhost:8000/graph?github_url=https://github.com/pallets/flask"
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Groq API Configuration
GROQ_API_KEY=your_api_key_here

# CORS Configuration (comma-separated)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,https://yourfrontend.com

# Optional: API Port (default 8000)
PORT=8000
```

### Groq API Setup

1. Sign up at [groq.com](https://groq.com)
2. Generate an API key from the console
3. Add to `.env` as `GROQ_API_KEY`

---

## 📁 Project Structure

```
ripple/
├── api.py                          # FastAPI main application
├── requirements.txt                # Python dependencies
├── Procfile                        # Heroku/Railway deployment config
├── .env.example                    # Example environment variables
│
├── analyzer/                       # Core analysis engine
│   ├── __init__.py
│   ├── parser.py                  # File parsing & AST analysis
│   ├── graph.py                   # Dependency graph builder
│   └── bob.py                     # AI explanation module (Groq)
│
├── frontend/                       # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx               # Main component
│   │   ├── index.css             # Styles
│   │   └── main.jsx              # Entry point
│   ├── package.json
│   ├── vite.config.js
│   └── eslint.config.js
│
├── tests/                          # Test suite
│   └── test_parser.py            # Parser unit tests
│
└── README.md                       # This file
```

### Module Breakdown

**`api.py`** - FastAPI server with CORS, request handling, error management

**`analyzer/parser.py`** - Python AST parser for extracting local imports from files

**`analyzer/graph.py`** - NetworkX graph builder and impact tracing using BFS

**`analyzer/bob.py`** - Async Groq client for AI-powered impact explanations

---

## 🔍 How It Works

### 1. Repository Analysis
```
User Input (GitHub URL) 
    ↓
Clone Repository (ZIP download - no git binary needed)
    ↓
Scan all Python files
```

### 2. Dependency Extraction
```
Parse each .py file with AST
    ↓
Extract relative imports (e.g., "from . import db")
    ↓
Build import relationships map
```

### 3. Graph Construction
```
Create NetworkX DiGraph
    ↓
Nodes = Python files
    ↓
Edges = Import dependencies
```

### 4. Impact Tracing
```
Find changed file in graph
    ↓
Traverse BFS to find all files depending on it
    ↓
Return affected files list
```

### 5. AI Explanation
```
Send changed file + affected files to Groq LLaMA
    ↓
AI generates human-readable explanation
    ↓
Return explanation to frontend
```

---

## 📤 Deployment

### Frontend (Vercel)

https://ripple-lime.vercel.app/

### Backend (Railway)

https://web-production-d4fa0.up.railway.app

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

🌊 *See what breaks before you change anything*