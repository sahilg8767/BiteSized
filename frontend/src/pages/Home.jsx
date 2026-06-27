import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/home.css";

const Home = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const accountRole = localStorage.getItem("accountRole");
  const isLoggedIn = Boolean(accountRole);

  const handleLogout = async () => {
    const logoutPath =
      accountRole === "food-partner"
        ? "/api/auth/food-partner/logout"
        : "/api/auth/user/logout";

    setIsLoggingOut(true);
    setStatus("");

    try {
      const response = await fetch(`http://localhost:3000${logoutPath}`, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Logout failed");
      }

      localStorage.removeItem("accountRole");
      setStatus(result.message || "Logged out successfully");
      navigate("/user/login");
    } catch (error) {
      setStatus(error.message || "Unable to logout");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <main className="home-page">
      <section className="home-shell">
        <div>
          <p className="home-kicker">Food Delivery</p>
          <h1 className="home-title">Fresh orders, simple accounts.</h1>
          <p className="home-subtitle">
            Login or register to continue. After auth, the backend stores your token in a browser cookie.
          </p>
        </div>

        <div className="home-actions">
          {isLoggedIn ? (
            <>
              {accountRole === "food-partner" && (
                <Link className="home-button home-button-secondary" to="/food/create">
                  Create food
                </Link>
              )}
              <button className="home-button" type="button" onClick={handleLogout} disabled={isLoggingOut}>
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : (
            <>
              <Link className="home-button" to="/user/login">
                User login
              </Link>
              <Link className="home-button home-button-secondary" to="/food-partner/login">
                Partner login
              </Link>
            </>
          )}
        </div>

        {status && <p className="home-status">{status}</p>}
      </section>
    </main>
  );
};

export default Home;
