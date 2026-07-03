"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setLoading(false);

        if (error) {
            setError(error.message);
        } else {
            router.push("/");
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#0a0a0a" }}>
            <form onSubmit={handleLogin} style={{ background: "#111", padding: "40px", borderRadius: "12px", width: "350px" }}>
                <h1 style={{ color: "white", marginBottom: "20px" }}>Login to SpecForge</h1>

                {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "6px", border: "1px solid #333", background: "#000", color: "white" }}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ width: "100%", padding: "10px", marginBottom: "20px", borderRadius: "6px", border: "1px solid #333", background: "#000", color: "white" }}
                />

                <button
                    type="submit"
                    disabled={loading}
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#4f46e5", color: "white", border: "none", cursor: "pointer" }}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p style={{ color: "#888", marginTop: "15px", textAlign: "center" }}>
                    Don't have an account? <a href="/signup" style={{ color: "#4f46e5" }}>Sign up</a>
                </p>
            </form>
        </div>
    );
}