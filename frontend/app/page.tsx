"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

const AGENTS = [
  { key: "business",     label: "Business Analyst",  color: "#818cf8" },
  { key: "developer",    label: "Senior Developer",   color: "#38bdf8" },
  { key: "qa",           label: "QA Engineer",        color: "#fb923c" },
  { key: "security",     label: "Security Engineer",  color: "#f43f5e" },
  { key: "ux",           label: "UX Researcher",      color: "#a78bfa" },
  { key: "orchestrator", label: "Final Spec",         color: "#34d399" },
];

const KEY_MAP = {
  business:     "business_analysis",
  developer:    "dev_concerns",
  qa:           "qa_concerns",
  security:     "security_concerns",
  ux:           "ux_concerns",
  orchestrator: "final_spec",
};

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [idea, setIdea] = useState("");
  const [phase, setPhase] = useState("idle");
  const [results, setResults] = useState({});
  const [error, setError] = useState(null);
  const [activeAgent, setActiveAgent] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push("/login");
      else setUser(session.user);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleSubmit = async () => {
    if (!idea.trim() || phase === "running") return;
    setPhase("running");
    setResults({});
    setError(null);
    setActiveAgent(null);

    try {
      const res = await fetch(`${BACKEND}/generate-spec`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();

      // Animate results appearing one by one
      for (const agent of AGENTS) {
        setActiveAgent(agent.key);
        await new Promise(r => setTimeout(r, 500));
        setResults(prev => ({
          ...prev,
          [agent.key]: data[KEY_MAP[agent.key]]
        }));
      }

      setPhase("done");
      setActiveAgent(null);

    } catch (err) {
      setError(err.message || "Something went wrong.");
      setPhase("idle");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "white", fontFamily: "sans-serif" }}>

      {/* Navbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 32px", borderBottom: "1px solid #222" }}>
        <h1 style={{ margin: 0, fontSize: "20px", color: "#34d399" }}>⚡ SpecForge</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ color: "#888", fontSize: "14px" }}>{user?.email}</span>
          <button onClick={handleLogout} style={{ padding: "6px 14px", borderRadius: "6px", background: "#1a1a1a", color: "#888", border: "1px solid #333", cursor: "pointer" }}>
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 20px" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h2 style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "10px" }}>
            Turn your idea into a <span style={{ color: "#34d399" }}>product spec</span>
          </h2>
          <p style={{ color: "#888", fontSize: "16px" }}>6 AI agents analyse your idea from every angle</p>
        </div>

        {/* Input */}
        <div style={{ marginBottom: "32px" }}>
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Describe your product idea... e.g. An app that helps students find study partners near them using AI matching"
            rows={4}
            style={{ width: "100%", padding: "16px", borderRadius: "8px", background: "#111", border: "1px solid #333", color: "white", fontSize: "15px", resize: "none", boxSizing: "border-box" }}
          />
          <button
            onClick={handleSubmit}
            disabled={phase === "running" || !idea.trim()}
            style={{ marginTop: "12px", width: "100%", padding: "14px", borderRadius: "8px", background: phase === "running" ? "#1a1a1a" : "#34d399", color: phase === "running" ? "#888" : "#000", border: "none", fontSize: "16px", fontWeight: "bold", cursor: phase === "running" ? "not-allowed" : "pointer" }}
          >
            {phase === "running" ? "Analysing your idea..." : "Generate Spec"}
          </button>
        </div>

        {/* Error */}
        {error && <p style={{ color: "#f43f5e", marginBottom: "20px" }}>{error}</p>}

        {/* Agent cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
          {AGENTS.map(agent => (
            <div key={agent.key} style={{
              background: "#111",
              border: `1px solid ${activeAgent === agent.key ? agent.color : "#222"}`,
              borderRadius: "10px",
              padding: "20px",
              transition: "border 0.3s"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: results[agent.key] ? agent.color : activeAgent === agent.key ? agent.color : "#333" }} />
                <span style={{ fontWeight: "bold", color: results[agent.key] ? agent.color : activeAgent === agent.key ? agent.color : "#888" }}>
                  {agent.label}
                </span>
                {activeAgent === agent.key && <span style={{ color: "#888", fontSize: "12px" }}>running...</span>}
                {results[agent.key] && <span style={{ color: "#34d399", fontSize: "12px" }}>✓ done</span>}
              </div>

              {results[agent.key] && (
                <div style={{ fontSize: "13px", color: "#aaa" }}>
                  {results[agent.key].verdict && (
                    <p style={{ color: agent.color, marginBottom: "6px" }}>Verdict: {results[agent.key].verdict}</p>
                  )}
                  {results[agent.key].recommendation && (
                    <p style={{ lineHeight: "1.5" }}>{results[agent.key].recommendation}</p>
                  )}
                  {results[agent.key].final_recommendation && (
                    <p style={{ lineHeight: "1.5" }}>{results[agent.key].final_recommendation}</p>
                  )}
                </div>
              )}

              {!results[agent.key] && phase === "idle" && (
                <p style={{ color: "#444", fontSize: "13px" }}>Waiting for idea...</p>
              )}

              {!results[agent.key] && phase === "running" && activeAgent !== agent.key && (
                <p style={{ color: "#444", fontSize: "13px" }}>Queued...</p>
              )}
            </div>
          ))}
        </div>

        {/* Done message */}
        {phase === "done" && (
          <div style={{ marginTop: "32px", padding: "20px", background: "#0d1f17", border: "1px solid #34d399", borderRadius: "10px", textAlign: "center" }}>
            <p style={{ color: "#34d399", fontSize: "18px", fontWeight: "bold" }}>✓ Specification Complete!</p>
            <p style={{ color: "#888", marginTop: "8px" }}>All 6 agents have analysed your idea successfully.</p>
          </div>
        )}
      </div>
    </div>
  );
}