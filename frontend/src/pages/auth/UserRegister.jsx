import AuthPage from "./AuthPage";

const UserRegister = () => (
  <AuthPage
    accountType="User account"
    mode="register"
    endpoint="/api/auth/user/register"
    accountRole="user"
    title="Create your account"
    subtitle="Order meals from nearby restaurants with a clean and simple profile."
    fields={[
      {
        id: "user-name",
        label: "Full name",
        name: "fullName",
        type: "text",
        placeholder: "Enter your name",
        autoComplete: "name",
      },
      {
        id: "user-email",
        label: "Email address",
        name: "email",
        type: "email",
        placeholder: "you@example.com",
        autoComplete: "email",
      },
      {
        id: "user-password",
        label: "Password",
        name: "password",
        type: "password",
        placeholder: "Create a password",
        autoComplete: "new-password",
      },
    ]}
    alternateText="Already have an account?"
    alternateLinkText="Login"
    alternateHref="/user/login"
    switchLinks={[
      { label: "Register as food partner", href: "/food-partner/register" },
    ]}
  />
);

export default UserRegister;
