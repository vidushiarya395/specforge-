"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Signup() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        setLoading(false);

        if (error) {
            setError(error.message);
        } else {
            setSuccess(true);
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#0a0a0a" }}>
            <form onSubmit={handleSignup} style={{ background: "#111", padding: "40px", borderRadius: "12px", width: "350px" }}>
                <h1 style={{ color: "white", marginBottom: "20px" }}>Create Account</h1>

                {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
                {success && <p style={{ color: "#4ade80", marginBottom: "10px" }}>Check your email to confirm your account!</p>}

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
                    placeholder="Password (min 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    style={{ width: "100%", padding: "10px", marginBottom: "20px", borderRadius: "6px", border: "1px solid #333", background: "#000", color: "white" }}
                />

                <button
                    type="submit"
                    disabled={loading}
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#4f46e5", color: "white", border: "none", cursor: "pointer" }}
                >
                    {loading ? "Creating account..." : "Sign Up"}
                </button>

                <p style={{ color: "#888", marginTop: "15px", textAlign: "center" }}>
                    Already have an account? <a href="/login" style={{ color: "#4f46e5" }}>Login</a>
                </p>
            </form>
        </div>
    );
}