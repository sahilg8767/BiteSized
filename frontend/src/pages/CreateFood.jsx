import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

const CATEGORIES = ["veg", "non-veg", "dessert", "beverage", "other"];

const CreateFood = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videoPreview, setVideoPreview] = useState("");

  const handleVideoChange = (event) => {
    const file = event.target.files?.[0];
    setVideoPreview(file ? URL.createObjectURL(file) : "");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const { data } = await api.post("/api/food", formData);
      setStatus({ type: "success", message: data.message || "Reel uploaded!" });
      setTimeout(() => navigate("/partner/dashboard"), 600);
    } catch (error) {
      setStatus({
        type: "error",
        message: error.response?.data?.message || "Unable to upload reel",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-ink px-4 py-8 text-neutral-900">
      <div className="mx-auto max-w-lg">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-brand">Food partner</p>
            <h1 className="text-2xl font-bold">Upload a reel</h1>
          </div>
          <Link to="/partner/dashboard" className="text-sm text-neutral-600 hover:text-neutral-900">
            ← Dashboard
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-6">
          <Field label="Video">
            <input
              name="video"
              type="file"
              accept="video/*"
              required
              onChange={handleVideoChange}
              className="block w-full text-sm text-neutral-700 file:mr-3 file:rounded-full file:border-0 file:bg-brand file:px-4 file:py-2 file:text-white"
            />
          </Field>

          {videoPreview && (
            <video
              src={videoPreview}
              controls
              className="aspect-9/16 max-h-72 w-full rounded-xl object-cover"
            />
          )}

          <Field label="Dish name">
            <input
              name="name"
              type="text"
              required
              placeholder="e.g. Cheese Burst Pizza"
              className="input"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Price (₹)">
              <input name="price" type="number" min="0" step="1" required placeholder="199" className="input" />
            </Field>
            <Field label="Category">
              <select name="category" defaultValue="other" className="input">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Description">
            <textarea
              name="description"
              rows="3"
              placeholder="Tell people what makes this dish special"
              className="input resize-none"
            />
          </Field>

          {status.message && (
            <p className={status.type === "error" ? "text-sm text-red-400" : "text-sm text-green-400"}>
              {status.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-brand py-3 font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
          >
            {isSubmitting ? "Uploading..." : "Upload reel"}
          </button>
        </form>
      </div>
    </main>
  );
};

const Field = ({ label, children }) => (
  <label className="block">
    <span className="mb-1.5 block text-sm font-medium text-neutral-700">{label}</span>
    {children}
  </label>
);

export default CreateFood;
