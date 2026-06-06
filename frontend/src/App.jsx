import { useState } from "react"

function App() {
  const [projectPath, setProjectPath] = useState("")
  const [changedFile, setChangedFile] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleAnalyze = async () => {
    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/analyze?project_path=${encodeURIComponent(projectPath)}&changed_file=${encodeURIComponent(changedFile)}`,
        { method: "POST" }
      )
      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError("Could not connect to Ripple API. Is the server running?")
    }

    setLoading(false)
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%)",
      color: "#fff",
      fontFamily: "'Segoe UI', sans-serif",
      padding: "40px 20px"
    }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <h1 style={{ fontSize: "2.5rem", margin: 0, color: "#818cf8" }}>
          🌊 Ripple
        </h1>
        <p style={{ color: "#94a3b8", marginTop: "8px", fontSize: "1rem" }}>
          See what breaks before you change anything
        </p>
      </div>

      {/* Input Card */}
      <div style={{
        maxWidth: "640px",
        margin: "0 auto 32px",
        background: "#1e1e2e",
        borderRadius: "16px",
        padding: "32px",
        border: "1px solid #2e2e4e"
      }}>
        <h2 style={{ margin: "0 0 24px", fontSize: "1rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Analyze Your Code
        </h2>

        {/* Project Path */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", color: "#c4b5fd", fontSize: "0.875rem", fontWeight: 500 }}>
            Project Path
          </label>
          <input
            type="text"
            value={projectPath}
            onChange={(e) => setProjectPath(e.target.value)}
            placeholder="C:\Users\...\flaskr"
            style={{
              width: "100%",
              padding: "12px 16px",
              background: "#0f0f1a",
              border: "1px solid #2e2e4e",
              borderRadius: "8px",
              color: "#fff",
              fontSize: "0.875rem",
              outline: "none",
              boxSizing: "border-box"
            }}
          />
        </div>

        {/* Changed File */}
        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", marginBottom: "8px", color: "#c4b5fd", fontSize: "0.875rem", fontWeight: 500 }}>
            Changed File
          </label>
          <input
            type="text"
            value={changedFile}
            onChange={(e) => setChangedFile(e.target.value)}
            placeholder="db.py"
            style={{
              width: "100%",
              padding: "12px 16px",
              background: "#0f0f1a",
              border: "1px solid #2e2e4e",
              borderRadius: "8px",
              color: "#fff",
              fontSize: "0.875rem",
              outline: "none",
              boxSizing: "border-box"
            }}
          />
        </div>

        {/* Button */}
        <button
          onClick={handleAnalyze}
          disabled={loading || !projectPath || !changedFile}
          style={{
            width: "100%",
            padding: "14px",
            background: loading ? "#3730a3" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "opacity 0.2s"
          }}
        >
          {loading ? "⏳ Analyzing..." : "⚡ Analyze Impact"}
        </button>

        {/* Error */}
        {error && (
          <p style={{ color: "#f87171", marginTop: "12px", fontSize: "0.875rem" }}>
            ❌ {error}
          </p>
        )}
      </div>

      {/* Result Card */}
      {result && (
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>

          {/* Stats Row */}
          <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
            <div style={{
              flex: 1, background: "#1e1e2e", borderRadius: "12px",
              padding: "20px", border: "1px solid #2e2e4e", textAlign: "center"
            }}>
              <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.75rem", textTransform: "uppercase" }}>Changed File</p>
              <p style={{ margin: "8px 0 0", color: "#818cf8", fontWeight: 700, fontSize: "1.1rem" }}>{result.changed_file}</p>
            </div>
            <div style={{
              flex: 1, background: "#1e1e2e", borderRadius: "12px",
              padding: "20px", border: "1px solid #2e2e4e", textAlign: "center"
            }}>
              <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.75rem", textTransform: "uppercase" }}>Files Affected</p>
              <p style={{ margin: "8px 0 0", color: result.total_affected > 0 ? "#f87171" : "#34d399", fontWeight: 700, fontSize: "1.1rem" }}>
                {result.total_affected}
              </p>
            </div>
          </div>

          {/* Affected Files */}
          {result.affected_files.length > 0 && (
            <div style={{
              background: "#1e1e2e", borderRadius: "12px",
              padding: "24px", border: "1px solid #f87171", marginBottom: "16px"
            }}>
              <h3 style={{ margin: "0 0 16px", color: "#f87171", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                ⚠️ Affected Files
              </h3>
              {result.affected_files.map((file) => (
                <div key={file} style={{
                  padding: "10px 16px", background: "#0f0f1a",
                  borderRadius: "8px", marginBottom: "8px",
                  borderLeft: "3px solid #f87171", color: "#fca5a5",
                  fontFamily: "monospace", fontSize: "0.9rem"
                }}>
                  {file}
                </div>
              ))}
            </div>
          )}

          {/* AI Explanation */}
          <div style={{
            background: "#1e1e2e", borderRadius: "12px",
            padding: "24px", border: "1px solid #8b5cf6"
          }}>
            <h3 style={{ margin: "0 0 16px", color: "#c4b5fd", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              🤖 AI Explanation
            </h3>
            <p style={{
              margin: 0, color: "#e2e8f0", lineHeight: "1.8",
              fontSize: "0.9rem", whiteSpace: "pre-wrap"
            }}>
              {result.explanation}
            </p>
          </div>

        </div>
      )}
    </div>
  )
}

export default App