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
      setSession(result.role || accountRole, result.user || result.foodPartner || null, result.token);
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
    <main className="flex min-h-screen items-stretch justify-center px-4 py-8 text-neutral-900 sm:py-12 bg-ink animate-scale-up">
      <section className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-black/5 bg-white shadow-2xl md:grid-cols-2">
        {/* branded panel (desktop) */}
        <aside className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-brand via-brand-dark to-red-650 p-10 md:flex">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-12 h-64 w-64 rounded-full bg-black/15 blur-3xl" />
          <Link to="/" className="relative text-2xl font-black tracking-tight text-white">
            Bite<span className="text-white/70">Sized</span>
          </Link>
          <div className="relative z-10">
            <h2 className="text-3xl font-black leading-tight text-white">
              Discover food through reels.
            </h2>
            <p className="mt-3 text-sm text-white/80 leading-relaxed">
              Watch short, appetizing videos from local kitchens near you, and order in a tap.
            </p>
            <div className="mt-8 flex gap-3 text-xs font-bold text-white/95">
              <span className="rounded-xl bg-white/10 px-3.5 py-2 border border-white/10 backdrop-blur-md">🎬 Interactive Reels</span>
              <span className="rounded-xl bg-white/10 px-3.5 py-2 border border-white/10 backdrop-blur-md">⚡ Instant Cart</span>
            </div>
          </div>
        </aside>

        {/* form panel */}
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          <Link to="/" className="text-xl font-black tracking-tight text-brand md:hidden">
            Bite<span className="text-neutral-700">Sized</span>
          </Link>

          <p className="mt-5 text-xs font-bold text-brand uppercase tracking-wider md:mt-0">{accountType}</p>
          <h1 className="mt-1.5 text-2xl font-extrabold text-neutral-900 tracking-tight leading-none">{title}</h1>
          <p className="mt-2 text-xs font-bold text-neutral-400">{subtitle}</p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {fields.map((field) => {
            const isPassword = field.type === "password";
            const shown = revealed[field.id];
            return (
              <label key={field.id} htmlFor={field.id} className="block">
                <span className="mb-2 block text-xs font-bold text-neutral-500 uppercase tracking-wider">
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
                    className={`input-premium text-sm ${isPassword ? "pr-12" : ""}`}
                  />
                  {isPassword && (
                    <button
                      type="button"
                      onClick={() =>
                        setRevealed((r) => ({ ...r, [field.id]: !r[field.id] }))
                      }
                      className="absolute inset-y-0 right-4 flex items-center text-neutral-400 hover:text-neutral-600 transition"
                      aria-label={shown ? "Hide password" : "Show password"}
                    >
                      {shown ? <FaEyeSlash className="text-base" /> : <FaEye className="text-base" />}
                    </button>
                  )}
                </div>
              </label>
            );
          })}

          {isLogin && (
            <div className="flex items-center justify-between text-xs font-bold text-neutral-500">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" name="remember" className="accent-brand scale-110" />
                Remember me
              </label>
              <button
                type="button"
                className="text-neutral-400 hover:text-brand transition cursor-pointer"
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
                  ? "text-xs font-bold text-red-500"
                  : "text-xs font-bold text-green-500 animate-pulse"
              }
            >
              {status.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-brand-premium w-full py-3.5 mt-2 text-sm cursor-pointer"
          >
            {isSubmitting ? "Processing Request..." : isLogin ? "Log In" : "Create Account"}
          </button>
          </form>

          <p className="mt-6 text-center text-xs font-bold text-neutral-400">
            {alternateText}{" "}
            <Link to={alternateHref} className="text-brand hover:underline">
              {alternateLinkText}
            </Link>
          </p>

          {switchLinks && (
            <nav className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-1.5 border-t border-black/5 pt-5 text-xs font-bold">
              {switchLinks.map((link) => (
                <Link key={link.href} to={link.href} className="text-neutral-400 hover:text-brand transition">
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
