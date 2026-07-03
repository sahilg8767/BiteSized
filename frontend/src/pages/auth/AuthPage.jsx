import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
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
  const [revealed, setRevealed] = useState({}); // password field id -> shown?

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const { data: result } = await api.post(endpoint, data);
      setStatus({ type: "success", message: result.message || "Success" });
      // sync auth context so the app immediately knows who is logged in
      setSession(result.role || accountRole, result.user || result.foodPartner || null);
      form.reset();
      navigate(redirectTo);
    } catch (error) {
      setStatus({
        type: "error",
        message: error.response?.data?.message || "Unable to connect to server",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-4 py-10 text-white">
      <section className="w-full max-w-md rounded-2xl bg-surface p-7 shadow-xl">
        <Link to="/" className="text-xl font-extrabold tracking-tight">
          Reel<span className="text-brand">o</span>
        </Link>

        <p className="mt-5 text-sm font-medium text-brand">{accountType}</p>
        <h1 className="mt-1 text-2xl font-bold">{title}</h1>
        <p className="mt-1 text-sm text-white/60">{subtitle}</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {fields.map((field) => {
            const isPassword = field.type === "password";
            const shown = revealed[field.id];
            return (
              <label key={field.id} htmlFor={field.id} className="block">
                <span className="mb-1.5 block text-sm font-medium text-white/80">
                  {field.label}
                </span>
                <div className="relative">
                  <input
                    id={field.id}
                    name={field.name}
                    type={isPassword ? (shown ? "text" : "password") : field.type}
                    placeholder={field.placeholder}
                    autoComplete={field.autoComplete}
                    required
                    minLength={isPassword && !isLogin ? 6 : undefined}
                    className={`input ${isPassword ? "pr-11" : ""}`}
                  />
                  {isPassword && (
                    <button
                      type="button"
                      onClick={() =>
                        setRevealed((r) => ({ ...r, [field.id]: !r[field.id] }))
                      }
                      className="absolute inset-y-0 right-3 flex items-center text-white/40 hover:text-white/70"
                      aria-label={shown ? "Hide password" : "Show password"}
                    >
                      {shown ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  )}
                </div>
              </label>
            );
          })}

          {isLogin && (
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-white/70">
                <input type="checkbox" name="remember" className="accent-brand" />
                Remember me
              </label>
              <button
                type="button"
                className="text-white/40"
                title="Coming soon"
                onClick={() =>
                  setStatus({ type: "error", message: "Password reset is coming soon" })
                }
              >
                Forgot password?
              </button>
            </div>
          )}

          {status.message && (
            <p
              className={
                status.type === "error"
                  ? "text-sm text-red-400"
                  : "text-sm text-green-400"
              }
            >
              {status.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-brand py-3 font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
          >
            {isSubmitting ? "Please wait..." : isLogin ? "Login" : "Create account"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-white/60">
          {alternateText}{" "}
          <Link to={alternateHref} className="font-semibold text-brand">
            {alternateLinkText}
          </Link>
        </p>

        {switchLinks && (
          <nav className="mt-4 flex flex-wrap justify-center gap-3 border-t border-white/10 pt-4 text-sm">
            {switchLinks.map((link) => (
              <Link key={link.href} to={link.href} className="text-white/70 hover:text-white">
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </section>
    </main>
  );
};

export default AuthPage;
