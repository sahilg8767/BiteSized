import "./../../styles/auth.css";
import AuthPage from "./AuthPage";

const FoodPartnerRegister = () => (
  <AuthPage
    accountType="Food partner"
    mode="register"
    endpoint="/api/auth/food-partner/register"
    accountRole="food-partner"
    redirectTo="/food/create"
    title="Start selling food"
    subtitle="Create a partner profile and prepare your restaurant for online orders."
    fields={[
      {
        id: "partner-business-name",
        label: "Business name",
        name: "name",
        type: "text",
        placeholder: "Restaurant or kitchen name",
        autoComplete: "organization",
      },
      {
        id: "partner-contact-name",
        label: "Contact name",
        name: "contactName",
        type: "text",
        placeholder: "Primary contact person",
        autoComplete: "name",
      },
      {
        id: "partner-email",
        label: "Email address",
        name: "email",
        type: "email",
        placeholder: "partner@example.com",
        autoComplete: "email",
      },
      {
        id: "partner-phone",
        label: "Phone number",
        name: "phone",
        type: "tel",
        placeholder: "Contact number",
        autoComplete: "tel",
      },
      {
        id: "partner-address",
        label: "Address",
        name: "address",
        type: "text",
        placeholder: "Restaurant address",
        autoComplete: "street-address",
      },
      {
        id: "partner-password",
        label: "Password",
        name: "password",
        type: "password",
        placeholder: "Create a password",
        autoComplete: "new-password",
      },
    ]}
    alternateText="Already registered?"
    alternateLinkText="Login"
    alternateHref="/food-partner/login"
    switchLinks={[
      { label: "Register as user", href: "/user/register" },
    ]}
  />
);

export default FoodPartnerRegister;
