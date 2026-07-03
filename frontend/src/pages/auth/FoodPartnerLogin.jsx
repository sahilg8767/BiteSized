import AuthPage from "./AuthPage";

const FoodPartnerLogin = () => (
  <AuthPage
    accountType="Food partner"
    mode="login"
    endpoint="/api/auth/food-partner/login"
    accountRole="food-partner"
    redirectTo="/food/create"
    title="Partner login"
    subtitle="Access your kitchen dashboard and manage incoming orders."
    fields={[
      {
        id: "partner-login-email",
        label: "Email address",
        name: "email",
        type: "email",
        placeholder: "partner@example.com",
        autoComplete: "email",
      },
      {
        id: "partner-login-password",
        label: "Password",
        name: "password",
        type: "password",
        placeholder: "Enter your password",
        autoComplete: "current-password",
      },
    ]}
    alternateText="Want to join as a partner?"
    alternateLinkText="Create account"
    alternateHref="/food-partner/register"
    switchLinks={[
      { label: "Register as user", href: "/user/register" },
    ]}
  />
);

export default FoodPartnerLogin;
