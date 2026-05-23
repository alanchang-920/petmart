import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getApiErrorMessage } from "../utils/apiError";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validate the form before hitting the API — avoids round-trips on obvious
// mistakes and gives the user a focused message per field.
function getFormErrors({ mode, username, email, password }) {
  const errors = {};
  if (mode === "register" && !username.trim()) {
    errors.username = "Username is required";
  }
  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!EMAIL_RE.test(email.trim())) {
    errors.email = "Please enter a valid email address";
  }
  if (!password) {
    errors.password = "Password is required";
  } else if (mode === "register" && password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }
  return errors;
}

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
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const clearForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setErrors({});
  };

  const switchMode = () => {
    clearForm();
    setMode(mode === "login" ? "register" : "login");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formErrors = getFormErrors({ mode, username, email, password });
    setErrors(formErrors);
    if (Object.keys(formErrors).length > 0) return;

    setSubmitting(true);
    try {
      if (mode === "login") {
        const user = await login(email.trim(), password);
        showToast("Login successful");
        onLoginSuccess?.(user);
      } else {
        await register(username.trim(), email.trim(), password);
        showToast("Register successful, please login");
        setMode("login");
      }
      clearForm();
    } catch (err) {
      console.error(err);
      showToast(
        getApiErrorMessage(
          err,
          mode === "login" ? "Login failed" : "Register failed"
        ),
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="auth-page" onSubmit={handleSubmit} noValidate>
      <h2>{mode === "login" ? "Login" : "Register"}</h2>

      {mode === "register" && (
        <>
          <input
            placeholder="username"
            value={username}
            autoComplete="off"
            onChange={(e) => setUsername(e.target.value)}
          />
          {errors.username && <span className="auth-error">{errors.username}</span>}
        </>
      )}

      <input
        placeholder="email"
        type="email"
        value={email}
        autoComplete="off"
        onChange={(e) => setEmail(e.target.value)}
      />
      {errors.email && <span className="auth-error">{errors.email}</span>}

      <input
        placeholder="password"
        type="password"
        value={password}
        autoComplete={mode === "register" ? "new-password" : "current-password"}
        onChange={(e) => setPassword(e.target.value)}
      />
      {errors.password && <span className="auth-error">{errors.password}</span>}

      <button type="submit" disabled={submitting}>
        {submitting ? "Please wait…" : mode === "login" ? "Login" : "Register"}
      </button>

      <p>
        {mode === "login"
          ? "Don't have an account? "
          : "Already have an account? "}

        <button type="button" onClick={switchMode}>
          {mode === "login" ? "Register" : "Login"}
        </button>
      </p>
    </form>
  );
}

export default LoginPage;
