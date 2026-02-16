import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function App() {
  const [language, setLanguage] = useState("python");
  const [problemStatement, setProblemStatement] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [optimizedData, setOptimizedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!problemStatement.trim()) {
      setError("Please enter a problem statement");
      return;
    }

    setLoading(true);
    setError("");
    setGeneratedCode("");
    setOptimizedData(null);

    try {
      const { data } = await axios.post(`${API_URL}/generate-code`, {
        language,
        problem_statement: problemStatement,
      });

      setGeneratedCode(data.code);
    } catch (err) {
      setError(
        err.response?.data?.detail || err.message || "Generation failed",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOptimize = async () => {
    if (!generatedCode.trim()) {
      setError("Generate code first before optimizing");
      return;
    }

    setLoading(true);
    setError("");
    setOptimizedData(null);

    try {
      const { data } = await axios.post(`${API_URL}/optimize-code`, {
        language,
        code: generatedCode,
      });

      setOptimizedData(data);
    } catch (err) {
      setError(
        err.response?.data?.detail || err.message || "Optimization failed",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setProblemStatement("");
    setGeneratedCode("");
    setOptimizedData(null);
    setError("");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Language Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Programming Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
          </select>
        </div>

        {/* Problem Statement */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Problem Statement
          </label>
          <textarea
            value={problemStatement}
            onChange={(e) => setProblemStatement(e.target.value)}
            placeholder="e.g., Write a function to reverse a string"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={handleGenerate}
            disabled={loading || !problemStatement.trim()}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            {loading && !generatedCode ? "Generating..." : "Generate Code"}
          </button>

          <button
            onClick={handleOptimize}
            disabled={loading || !generatedCode}
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            {loading && generatedCode && !optimizedData
              ? "Optimizing..."
              : "Optimize Code"}
          </button>

          <button
            onClick={handleReset}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Reset
          </button>
        </div>

        {/* Generated Code */}
        {generatedCode && (
          <div className="mb-6 bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Generated Code
              </h3>
              <button
                onClick={() => copyToClipboard(generatedCode)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition"
              >
                Copy
              </button>
            </div>
            <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{generatedCode}</code>
            </pre>
          </div>
        )}

        {/* Optimized Code */}
        {optimizedData && (
          <div className="space-y-4">
            {/* Improvements and Performance Gain Combined */}
            {(optimizedData.improvements?.length > 0 ||
              optimizedData.performance_gain) && (
              <div className="bg-white rounded-lg shadow-md p-6">
                {optimizedData.improvements?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Improvements Made:
                    </h4>
                    <ul className="space-y-2">
                      {optimizedData.improvements.map((item, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-green-600 mr-2">✓</span>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {optimizedData.performance_gain && (
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Performance Gain:
                    </h4>
                    <p className="text-gray-700">
                      {optimizedData.performance_gain}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Optimized Code */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Optimized Code
                </h3>
                <button
                  onClick={() => copyToClipboard(optimizedData.optimized_code)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition"
                >
                  Copy
                </button>
              </div>
              <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{optimizedData.optimized_code}</code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
