import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const AuthPage = ({
  accountType,
  title,
  subtitle,
  mode,
  endpoint,
  accountRole,
  redirectTo = "/",
  fields,
  alternateText,
  alternateLinkText,
  alternateHref,
  switchLinks,
}) => {
  const isLogin = mode === "login";
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const { data: result } = await api.post(endpoint, data);

      setStatus({
        type: "success",
        message: result.message || "Request completed successfully",
      });
      // sync auth context from the response so the app knows who is logged in
      setSession(result.role || accountRole, result.user || result.foodPartner || null);
      form.reset();
      navigate(redirectTo);
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error.response?.data?.message || "Unable to connect to server",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby={`${accountType}-${mode}-title`}>
        <p className="auth-kicker">{accountType}</p>
        <h1 className="auth-title" id={`${accountType}-${mode}-title`}>
          {title}
        </h1>
        <p className="auth-subtitle">{subtitle}</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div className="auth-field" key={field.id}>
              <label htmlFor={field.id}>{field.label}</label>
              <input
                id={field.id}
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                autoComplete={field.autoComplete}
                required
              />
            </div>
          ))}

          {isLogin && (
            <div className="auth-row">
              <label className="auth-checkbox">
                <input type="checkbox" name="remember" />
                <span>Remember me</span>
              </label>
              <a className="auth-link" href="#">
                Forgot password?
              </a>
            </div>
          )}

          {status.message && (
            <p className={`auth-status auth-status-${status.type}`}>{status.message}</p>
          )}

          <button className="auth-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Please wait..." : isLogin ? "Login" : "Create account"}
          </button>
        </form>

        <p className="auth-footer">
          {alternateText}{" "}
          <a className="auth-link" href={alternateHref}>
            {alternateLinkText}
          </a>
        </p>

        {switchLinks && (
          <nav className="auth-switch" aria-label="Account type links">
            {switchLinks.map((link) => (
              <a className="auth-switch-link" href={link.href} key={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </section>
    </main>
  );
};

export default AuthPage;
