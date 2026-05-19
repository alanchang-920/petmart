import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

/**
 * Combined login / register form. Mode is toggled locally;
 * success/failure surfaces through the parent's toast callback.
 */
function LoginPage({ onLoginSuccess, showToast }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const clearForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");
  };

  const handleLogin = async () => {
    try {
      await login(email, password);
      showToast("Login successful");
      onLoginSuccess?.();
      clearForm();
    } catch (err) {
      console.error(err);
      showToast("Login failed", "error");
    }
  };

  const handleRegister = async () => {
    try {
      await register(username, email, password);
      showToast("Register successful, please login");
      setMode("login");
      clearForm();
    } catch (err) {
      console.error(err);
      showToast("Register failed", "error");
    }
  };

  return (
  <div className="auth-page" style={{ padding: "20px" }}>
    <h2>{mode === "login" ? "Login" : "Register"}</h2>

    {mode === "register" && (
      <input
        placeholder="username"
        value={username}
        autoComplete="off"
        onChange={(e) => setUsername(e.target.value)}
      />
    )}

    <input
      placeholder="email"
      type="email"
      value={email}
      autoComplete="off"
      onChange={(e) => setEmail(e.target.value)}
    />

    <input
      placeholder="password"
      type="password"
      value={password}
      autoComplete="new-password"
      onChange={(e) => setPassword(e.target.value)}
    />

    {mode === "login" ? (
      <button onClick={handleLogin}>Login</button>
    ) : (
      <button onClick={handleRegister}>Register</button>
    )}

    <p>
      {mode === "login"
        ? "Don't have an account? "
        : "Already have an account? "}

      <button
        type="button"
        onClick={() => {
          clearForm();
          setMode(mode === "login" ? "register" : "login");
        }}
      >
        {mode === "login" ? "Register" : "Login"}
      </button>
    </p>
  </div>
);
}

export default LoginPage;
