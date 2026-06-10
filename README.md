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