import "./../../styles/auth.css";
import AuthPage from "./AuthPage";

const UserLogin = () => (
  <AuthPage
    accountType="User account"
    mode="login"
    endpoint="/api/auth/user/login"
    accountRole="user"
    title="Welcome back"
    subtitle="Login to continue ordering your favorite food."
    fields={[
      {
        id: "user-login-email",
        label: "Email address",
        name: "email",
        type: "email",
        placeholder: "you@example.com",
        autoComplete: "email",
      },
      {
        id: "user-login-password",
        label: "Password",
        name: "password",
        type: "password",
        placeholder: "Enter your password",
        autoComplete: "current-password",
      },
    ]}
    alternateText="New here?"
    alternateLinkText="Create account"
    alternateHref="/user/register"
    switchLinks={[
      { label: "Register as food partner", href: "/food-partner/register" },
    ]}
  />
);

export default UserLogin;
