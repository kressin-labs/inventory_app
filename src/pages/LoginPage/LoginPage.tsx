import { useState } from "react";
import { login, getCurrentUser } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const { setUser } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await login(username, password);

      const me = await getCurrentUser();
      if (!me) {
        setError("Could not load user info");
        return;
      }

      setUser({
        username: me.username,
        role: me.role as "ADMIN" | "USER",
      });

      setError("");
    } catch {
      setError("Login failed");
    }
  }

  return (
    <form onSubmit={submit}>
      <h2>Login</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <input value={username} onChange={e => setUsername(e.target.value)} />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}
