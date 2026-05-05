import { useState } from "react"

function App() {
  // Whiteboard — user ki input store karti hain
  const [projectPath, setProjectPath] = useState("")
  const [changedFile, setChangedFile] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  // Analyze button dabane par yeh function chalega
  const handleAnalyze = async () => {
    setLoading(true)
    setResult(null)

    const response = await fetch(
      `http://127.0.0.1:8000/analyze?project_path=${encodeURIComponent(projectPath)}&changed_file=${encodeURIComponent(changedFile)}`,
      { method: "POST" }
    )

    const data = await response.json()
    setResult(data)
    setLoading(false)
  }

  return (
    <div style={{ padding: "40px", fontFamily: "Arial", maxWidth: "700px", margin: "0 auto" }}>
      
      <h1 style={{ color: "#6366f1" }}>🌊 Ripple</h1>
      <p style={{ color: "#666" }}>AI-powered code impact analyzer</p>

      {/* Input fields */}
      <div style={{ marginBottom: "16px" }}>
        <label>Project Path</label>
        <input
          type="text"
          value={projectPath}
          onChange={(e) => setProjectPath(e.target.value)}
          placeholder="C:\Users\...\flaskr"
          style={{ display: "block", width: "100%", padding: "8px", marginTop: "4px", borderRadius: "6px", border: "1px solid #ccc" }}
        />
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label>Changed File</label>
        <input
          type="text"
          value={changedFile}
          onChange={(e) => setChangedFile(e.target.value)}
          placeholder="db.py"
          style={{ display: "block", width: "100%", padding: "8px", marginTop: "4px", borderRadius: "6px", border: "1px solid #ccc" }}
        />
      </div>

      {/* Analyze button */}
      <button
        onClick={handleAnalyze}
        style={{ background: "#6366f1", color: "white", padding: "10px 24px", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "16px" }}
      >
        {loading ? "Analyzing..." : "Analyze Impact"}
      </button>

      {/* Result */}
      {result && (
        <div style={{ marginTop: "32px", padding: "20px", background: "#f8f8ff", borderRadius: "10px", border: "1px solid #6366f1" }}>
          <h2>Impact Result</h2>
          <p>Changed file: <strong>{result.changed_file}</strong></p>
          <p>Total affected: <strong>{result.total_affected}</strong></p>
          <ul>
            {result.affected_files.map((file) => (
              <li key={file} style={{ color: "red", marginBottom: "4px" }}>⚠️ {file}</li>
            ))}
          </ul>
        </div>
      )}

    </div>
  )
}

export default App