import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

const iconProps = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
const IconUser = (p) => (<svg {...iconProps} {...p} aria-hidden="true"><circle cx="12" cy="8" r="3.4" /><path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" /></svg>);
const IconMail = (p) => (<svg {...iconProps} {...p} aria-hidden="true"><path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" /><path d="M3 6l9 7 9-7" /></svg>);
const IconLock = (p) => (<svg {...iconProps} {...p} aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>);
const IconEye = (p) => (<svg {...iconProps} {...p} aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>);
const IconEyeOff = (p) => (<svg {...iconProps} {...p} aria-hidden="true"><path d="M2 12s3.5-7 10-7c2 0 3.7.6 5.1 1.4M22 12s-1 2-3 3.8M9.9 9.9a3 3 0 0 0 4.2 4.2" /><path d="M3 3l18 18" /></svg>);

/* Nexus mark — same signature glyph used across the site */
function NodeMark({ size = 18 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 7L5 17M12 7L19 17M5 17H19" stroke="#ff9d4d" strokeWidth="1.1" opacity=".55" />
            <circle cx="12" cy="6" r="2.2" fill="#ff9d4d" />
            <circle cx="5" cy="18" r="2.2" fill="#ff9d4d" />
            <circle cx="19" cy="18" r="2.2" fill="#ff9d4d" />
        </svg>
    );
}

export default function Signup() {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const { register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await register({ name: form.name, email: form.email, password: form.password });
            navigate("/");
        } catch {
            // Error toast is already shown inside AuthContext.register()
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-glow" aria-hidden="true" />
            <div className="auth-container">
                <Link to="/home" className="auth-logo-link">
                    <NodeMark size={20} />
                    <span>Nexora AI</span>
                </Link>

                <div className="auth-heading">
                    <h2>Create your account</h2>
                    <p>Set up Nexora in under a minute.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <label className="auth-field">
                        <span className="sr-only">Name</span>
                        <IconUser className="auth-field-icon" />
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            autoComplete="name"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            required
                        />
                    </label>

                    <label className="auth-field">
                        <span className="sr-only">Email</span>
                        <IconMail className="auth-field-icon" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            autoComplete="email"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            required
                        />
                    </label>

                    <label className="auth-field">
                        <span className="sr-only">Password</span>
                        <IconLock className="auth-field-icon" />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            autoComplete="new-password"
                            value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                            required
                        />
                        <button
                            type="button"
                            className="auth-field-toggle"
                            onClick={() => setShowPassword(s => !s)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <IconEyeOff /> : <IconEye />}
                        </button>
                    </label>

                    <button type="submit" className="auth-submit" disabled={submitting}>
                        {submitting ? "Creating account..." : "Create account"}
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
}