import { useState } from "react";
const API_URL = "http://localhost:8000";

export default function App() {
  const [language, setLanguage] = useState("python");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    if (!input) return setError("Enter a problem statement");
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/generate-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, problem_statement: input }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);

      setOutput({ code: data.code });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Reset
  const reset = () => {
    setInput("");
    setOutput(null);
    setError("");
  };

  return (
    <div className="app">
      <div className="container">
        {/* Language Select */}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="select"
        >
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
        </select>

        {/* Input */}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="textarea"
        />

        {/* Error */}
        {error && <div className="error">{error}</div>}

        {/* Action Button */}
        <button
          onClick={generate}
          disabled={loading || !input}
          className={loading || !input ? "button-disabled" : "button"}
        >
          {loading ? "Generating..." : "Generate Code"}
        </button>

        {/* Output */}
        {output && (
          <div className="output">
            {/* Code */}
            <div className="card">
              <div className="code-header">
                <span>Generated Code</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(output.code);
                  }}
                  className="copy-button"
                >
                  Copy
                </button>
              </div>
              <pre className="code">{output.code}</pre>
            </div>

            {/* Reset */}
            <button onClick={reset} className="reset-button">
              Generate Another
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
