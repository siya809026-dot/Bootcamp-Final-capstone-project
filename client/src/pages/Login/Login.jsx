import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiMail, FiLock } from "react-icons/fi";

import authApi from "../../services/authApi";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await authApi.post("/login", form);
      // adjust these keys to match your authController's actual response shape
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Welcome back");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1 className="auth-logo">notes.</h1>
        <p className="auth-subtitle">good to have you back</p>

        <label className="auth-field">
          <FiMail size={14} />
          <input
            type="email"
            name="email"
            placeholder="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label className="auth-field">
          <FiLock size={14} />
          <input
            type="password"
            name="password"
            placeholder="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>

        <button className="auth-submit" type="submit" disabled={loading}>
          {loading ? "logging in..." : "log in"}
        </button>

        <p className="auth-switch">
          new here? <Link to="/">create an account</Link>
        </p>
      </form>
    </div>
  );
}