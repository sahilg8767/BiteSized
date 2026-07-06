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
    <main className="flex min-h-screen items-stretch justify-center px-4 py-6 text-neutral-900 sm:py-10">
      <section className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-black/5 bg-white shadow-2xl md:grid-cols-2">
        {/* branded panel (desktop) */}
        <aside className="relative hidden flex-col justify-between overflow-hidden bg-linear-to-br from-brand to-brand-dark p-8 md:flex">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/15 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-black/20 blur-2xl" />
          <Link to="/" className="relative text-2xl font-black tracking-tight">
            Reel<span className="text-neutral-700">o</span>
          </Link>
          <div className="relative">
            <h2 className="text-3xl font-black leading-tight">
              Discover food through reels.
            </h2>
            <p className="mt-3 text-sm text-white/85">
              Watch short videos from restaurants near you, then order in a tap.
            </p>
            <div className="mt-6 flex gap-2 text-xs">
              <span className="rounded-full bg-white/15 px-3 py-1">🎬 Reels feed</span>
              <span className="rounded-full bg-white/15 px-3 py-1">⭐ Save & order</span>
            </div>
          </div>
        </aside>

        {/* form panel */}
        <div className="p-7 sm:p-9">
          <Link to="/" className="text-xl font-black tracking-tight md:hidden">
            Reel<span className="text-brand">o</span>
          </Link>

          <p className="mt-5 text-sm font-semibold text-brand md:mt-0">{accountType}</p>
          <h1 className="mt-1 text-2xl font-extrabold">{title}</h1>
          <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {fields.map((field) => {
            const isPassword = field.type === "password";
            const shown = revealed[field.id];
            return (
              <label key={field.id} htmlFor={field.id} className="block">
                <span className="mb-1.5 block text-sm font-medium text-neutral-700">
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
                      className="absolute inset-y-0 right-3 flex items-center text-neutral-400 hover:text-neutral-600"
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
              <label className="flex items-center gap-2 text-neutral-600">
                <input type="checkbox" name="remember" className="accent-brand" />
                Remember me
              </label>
              <button
                type="button"
                className="text-neutral-400"
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
            className="btn-brand w-full rounded-full py-3 font-semibold text-white disabled:opacity-60"
          >
            {isSubmitting ? "Please wait..." : isLogin ? "Login" : "Create account"}
          </button>
          </form>

          <p className="mt-5 text-center text-sm text-neutral-500">
            {alternateText}{" "}
            <Link to={alternateHref} className="font-semibold text-brand">
              {alternateLinkText}
            </Link>
          </p>

          {switchLinks && (
            <nav className="mt-4 flex flex-wrap justify-center gap-3 border-t border-black/10 pt-4 text-sm">
              {switchLinks.map((link) => (
                <Link key={link.href} to={link.href} className="text-neutral-500 hover:text-neutral-900">
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </section>
    </main>
  );
};

export default AuthPage;
