import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/create-food.css";

const CreateFood = () => {
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch("http://localhost:3000/api/food", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to create food");
      }

      setStatus({
        type: "success",
        message: result.message || "Food created successfully",
      });
      form.reset();
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to connect to server",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="create-food-page">
      <section className="create-food-card" aria-labelledby="create-food-title">
        <div className="create-food-header">
          <div>
            <p className="create-food-kicker">Food partner</p>
            <h1 className="create-food-title" id="create-food-title">
              Create food
            </h1>
          </div>
          <Link className="create-food-link" to="/">
            Home
          </Link>
        </div>

        <form className="create-food-form" onSubmit={handleSubmit}>
          <div className="create-food-field">
            <label htmlFor="food-video">Video</label>
            <input id="food-video" name="video" type="file" accept="video/*" required />
          </div>

          <div className="create-food-field">
            <label htmlFor="food-name">Video title</label>
            <input
              id="food-name"
              name="name"
              type="text"
              placeholder="Enter food video title"
              required
            />
          </div>

          <div className="create-food-field">
            <label htmlFor="food-description">Video description</label>
            <textarea
              id="food-description"
              name="description"
              placeholder="Describe this food item"
              rows="5"
            />
          </div>

          {status.message && (
            <p className={`create-food-status create-food-status-${status.type}`}>
              {status.message}
            </p>
          )}

          <button className="create-food-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Uploading..." : "Create food"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default CreateFood;
