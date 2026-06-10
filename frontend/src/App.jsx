import { useState } from "react"

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

function App() {
  const [githubUrl, setGithubUrl] = useState("")
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
        `${API_URL}/analyze?github_url=${encodeURIComponent(githubUrl)}&changed_file=${encodeURIComponent(changedFile)}`,
        { method: "POST" }
      )

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.detail || "Something went wrong")
      }

      const data = await response.json()
      setResult(data)

    } catch (err) {
      setError(err.message || "Could not connect to Ripple API.")
    }

    setLoading(false)
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      color: "#e2e8f0",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
    }}>

      {/* Top Nav */}
      <nav style={{
        borderBottom: "1px solid #1e1e2e",
        padding: "0 40px",
        height: "56px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#0d0d14"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "1.25rem" }}>🌊</span>
          <span style={{ fontWeight: 600, fontSize: "1rem", color: "#fff", letterSpacing: "-0.01em" }}>
            Ripple
          </span>
          <span style={{
            fontSize: "0.65rem", fontWeight: 500,
            background: "#1e1e3a", color: "#818cf8",
            padding: "2px 8px", borderRadius: "20px",
            border: "1px solid #2e2e5e", letterSpacing: "0.05em"
          }}>
            BETA
          </span>
        </div>
        <span style={{ fontSize: "0.8rem", color: "#4a5568" }}>
          AI-powered code impact analyzer
        </span>
      </nav>

      {/* Hero */}
<div style={{
  textAlign: "center",
  padding: "40px 40px 32px",
  borderBottom: "1px solid #1a1a2a"
}}>
  <h1 style={{
    fontSize: "1.75rem",
    fontWeight: 700,
    margin: "0 0 10px",
    letterSpacing: "-0.02em",
    color: "#fff"
  }}>
    See the ripple before you make the wave
  </h1>
  <p style={{
    fontSize: "0.9rem",
    color: "#4a5568",
    margin: 0,
    lineHeight: 1.6
  }}>
    Paste any GitHub repo, name a file — Ripple maps exactly what breaks before you touch a line of code.
  </p>
</div>

      {/* Main Two Column Layout */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "0",
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "40px 40px",
        alignItems: "start"
      }}>

        {/* LEFT — Input Panel */}
        <div style={{ paddingRight: "40px", borderRight: "1px solid #1a1a2a" }}>
          <p style={{
            fontSize: "0.7rem", fontWeight: 600,
            color: "#4a5568", letterSpacing: "0.1em",
            textTransform: "uppercase", marginBottom: "24px"
          }}>
            Configure analysis
          </p>

          {/* GitHub URL */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{
              display: "block", marginBottom: "8px",
              fontSize: "0.8rem", fontWeight: 500, color: "#94a3b8"
            }}>
              GitHub repository URL
            </label>
            <input
              type="text"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username/repo"
              style={{
                width: "100%",
                padding: "11px 14px",
                background: "#111118",
                border: "1px solid #1e1e2e",
                borderRadius: "8px",
                color: "#e2e8f0",
                fontSize: "0.875rem",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.15s",
                fontFamily: "inherit"
              }}
              onFocus={e => e.target.style.borderColor = "#4f46e5"}
              onBlur={e => e.target.style.borderColor = "#1e1e2e"}
            />
          </div>

          {/* Changed File */}
          <div style={{ marginBottom: "28px" }}>
            <label style={{
              display: "block", marginBottom: "8px",
              fontSize: "0.8rem", fontWeight: 500, color: "#94a3b8"
            }}>
              File you plan to change
            </label>
            <input
              type="text"
              value={changedFile}
              onChange={(e) => setChangedFile(e.target.value)}
              placeholder="db.py"
              style={{
                width: "100%",
                padding: "11px 14px",
                background: "#111118",
                border: "1px solid #1e1e2e",
                borderRadius: "8px",
                color: "#e2e8f0",
                fontSize: "0.875rem",
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "monospace",
                transition: "border-color 0.15s"
              }}
              onFocus={e => e.target.style.borderColor = "#4f46e5"}
              onBlur={e => e.target.style.borderColor = "#1e1e2e"}
            />
          </div>

          {/* Button */}
          <button
            onClick={handleAnalyze}
            disabled={loading || !githubUrl || !changedFile}
            style={{
              width: "100%",
              padding: "12px",
              background: loading || !githubUrl || !changedFile
                ? "#1a1a2e"
                : "linear-gradient(135deg, #4f46e5, #7c3aed)",
              color: loading || !githubUrl || !changedFile ? "#4a5568" : "#fff",
              border: "1px solid",
              borderColor: loading || !githubUrl || !changedFile ? "#1e1e2e" : "transparent",
              borderRadius: "8px",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: loading || !githubUrl || !changedFile ? "not-allowed" : "pointer",
              letterSpacing: "0.01em",
              fontFamily: "inherit",
              transition: "opacity 0.15s"
            }}
          >
            {loading ? "⏳  Cloning & analyzing..." : "⚡  Analyze impact"}
          </button>

          {/* Error */}
          {error && (
            <div style={{
              marginTop: "16px",
              padding: "12px 14px",
              background: "#1a0f0f",
              borderRadius: "8px",
              border: "1px solid #3d1515",
              color: "#f87171",
              fontSize: "0.8rem",
              lineHeight: 1.5
            }}>
              ✗  {error}
            </div>
          )}

          {/* Help text */}
          <div style={{
            marginTop: "32px",
            padding: "16px",
            background: "#0d0d14",
            borderRadius: "8px",
            border: "1px solid #1a1a2a"
          }}>
            <p style={{ margin: "0 0 8px", fontSize: "0.75rem", fontWeight: 600, color: "#4a5568", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Try this example
            </p>
            <p style={{ margin: "0 0 4px", fontSize: "0.8rem", color: "#64748b" }}>
              URL: <code style={{ color: "#818cf8", background: "#13132a", padding: "1px 6px", borderRadius: "4px", fontSize: "0.75rem" }}>https://github.com/pallets/flask</code>
            </p>
            <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b" }}>
              File: <code style={{ color: "#818cf8", background: "#13132a", padding: "1px 6px", borderRadius: "4px", fontSize: "0.75rem" }}>db.py</code>
            </p>
          </div>
        </div>

        {/* RIGHT — Results Panel */}
        <div style={{ paddingLeft: "40px" }}>
          <p style={{
            fontSize: "0.7rem", fontWeight: 600,
            color: "#4a5568", letterSpacing: "0.1em",
            textTransform: "uppercase", marginBottom: "24px"
          }}>
            Impact report
          </p>

          {/* Empty state */}
          {!result && !loading && (
            <div style={{
              padding: "48px 24px",
              textAlign: "center",
              border: "1px dashed #1e1e2e",
              borderRadius: "12px"
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "12px" }}>🌊</div>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "#2d3748", lineHeight: 1.6 }}>
                Results will appear here after analysis
              </p>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div style={{
              padding: "48px 24px",
              textAlign: "center",
              border: "1px solid #1e1e2e",
              borderRadius: "12px"
            }}>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "#4a5568" }}>
                Cloning repository and mapping dependencies...
              </p>
            </div>
          )}

          {/* Results */}
          {result && (
            <div>

              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                <div style={{
                  padding: "16px",
                  background: "#111118",
                  borderRadius: "10px",
                  border: "1px solid #1e1e2e"
                }}>
                  <p style={{ margin: "0 0 6px", fontSize: "0.7rem", color: "#4a5568", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Changed file
                  </p>
                  <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: 600, color: "#818cf8", fontFamily: "monospace" }}>
                    {result.changed_file}
                  </p>
                </div>
                <div style={{
                  padding: "16px",
                  background: "#111118",
                  borderRadius: "10px",
                  border: `1px solid ${result.total_affected > 0 ? "#3d1515" : "#0f2a1a"}`
                }}>
                  <p style={{ margin: "0 0 6px", fontSize: "0.7rem", color: "#4a5568", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Files affected
                  </p>
                  <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color: result.total_affected > 0 ? "#f87171" : "#34d399" }}>
                    {result.total_affected}
                  </p>
                </div>
              </div>

              {/* Affected files */}
              {result.affected_files.length > 0 && (
                <div style={{ marginBottom: "20px" }}>
                  <p style={{ margin: "0 0 10px", fontSize: "0.7rem", fontWeight: 600, color: "#4a5568", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Affected files
                  </p>
                  {result.affected_files.map((file) => (
                    <div key={file} style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 14px",
                      background: "#110f0f",
                      borderRadius: "8px",
                      marginBottom: "6px",
                      border: "1px solid #2a1515",
                      borderLeft: "3px solid #ef4444"
                    }}>
                      <span style={{ color: "#ef4444", fontSize: "0.75rem" }}>⚠</span>
                      <span style={{ color: "#fca5a5", fontFamily: "monospace", fontSize: "0.85rem" }}>
                        {file}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* No affected files */}
              {result.affected_files.length === 0 && (
                <div style={{
                  padding: "14px",
                  background: "#0a1a0f",
                  borderRadius: "8px",
                  border: "1px solid #0f2a1a",
                  marginBottom: "20px",
                  color: "#34d399",
                  fontSize: "0.875rem"
                }}>
                  ✓  No files affected — safe to change
                </div>
              )}

              {/* AI Explanation */}
              <div style={{
                padding: "18px",
                background: "#0d0d18",
                borderRadius: "10px",
                border: "1px solid #1e1e3a"
              }}>
                <p style={{ margin: "0 0 12px", fontSize: "0.7rem", fontWeight: 600, color: "#4a5568", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  AI explanation
                </p>
                <p style={{
                  margin: 0,
                  color: "#94a3b8",
                  lineHeight: 1.75,
                  fontSize: "0.85rem",
                  whiteSpace: "pre-wrap"
                }}>
                  {result.explanation}
                </p>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App