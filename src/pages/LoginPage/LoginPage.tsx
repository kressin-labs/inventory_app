import React, { useState } from "react";
import { login, getCurrentUser } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import './LoginPage.css'

interface LoginPageProps {
    onLoginSuccess?: () => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
    const { setUser } = useAuth();
    // const { t } = useLanguage();
    const { t } = useLanguage("loginModal")


    const [username, setUsername] = useState("user");
    const [password, setPassword] = useState("user123");

    const [error, setError] = useState("");

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        try {
            await login(username, password);

            const me = await getCurrentUser();
            if (!me) {
                setError("Login succeeded, but could not load user info.");
                return;
            }

            setUser({
                username: me.username,
                role: me.role as "ADMIN" | "USER",
            });

            if (onLoginSuccess) {
                onLoginSuccess();
            }

        } catch (err) {
            console.error("Login attempt failed:", err);
            setError("Login failed. Check your credentials.");
        }
    }

    return (
        <form onSubmit={submit} className="login-form">
            <h2 className="login-title">Login</h2>

            {error && <div className="login-error-message">{error}</div>}

            <label htmlFor="username">{t("username")}</label>
            <input
                id="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
                required
            />

            <label htmlFor="password">{t("password")}</label>
            <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                required
            />

            <button type="submit" className="login-submit-btn">Login</button>
        </form>
    );
}