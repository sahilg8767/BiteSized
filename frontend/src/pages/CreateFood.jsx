import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCloudArrowUp } from "react-icons/fa6";
import api from "../api/axios";

const CATEGORIES = ["veg", "non-veg", "dessert", "beverage", "other"];

const CreateFood = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videoPreview, setVideoPreview] = useState("");
  const [fileName, setFileName] = useState("");

  const handleVideoChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoPreview(URL.createObjectURL(file));
      setFileName(file.name);
    } else {
      setVideoPreview("");
      setFileName("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const { data } = await api.post("/api/food", formData);
      setStatus({ type: "success", message: data.message || "Reel uploaded successfully!" });
      setTimeout(() => navigate("/partner/dashboard"), 800);
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
    <main className="min-h-screen bg-ink px-4 py-8 text-neutral-900 pb-28 animate-scale-up">
      <div className="mx-auto max-w-lg">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <Link to="/partner/dashboard" className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-neutral-200/60 shadow-xs hover:text-brand hover:scale-105 active:scale-95 transition duration-200 cursor-pointer">
              <FaArrowLeft className="text-xs" />
            </Link>
            <div>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Food Partner</p>
              <h1 className="text-xl font-extrabold text-neutral-950 tracking-tight leading-none mt-0.5">Upload a Reel</h1>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl bg-white border border-black/5 p-6 shadow-sm">
          <label className="block cursor-pointer">
            <span className="mb-2 block text-xs font-bold text-neutral-400 uppercase tracking-wider">Video File (Short Clip)</span>
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 hover:border-brand/40 bg-neutral-50/50 hover:bg-orange-50/5 p-6 text-center transition duration-200">
              <FaCloudArrowUp className="text-3xl text-neutral-450 mb-2 group-hover:text-brand" />
              <p className="text-xs font-bold text-neutral-800">{fileName || "Click to browse video file"}</p>
              <p className="text-[10px] font-semibold text-neutral-400 mt-1">Accepts mp4, mov, webm formats</p>
              <input
                name="video"
                type="file"
                accept="video/*"
                required
                onChange={handleVideoChange}
                className="hidden"
              />
            </div>
          </label>

          {videoPreview && (
            <div className="rounded-xl overflow-hidden border border-black/5 shadow-inner bg-neutral-950">
              <video
                src={videoPreview}
                controls
                className="aspect-[9/16] max-h-72 w-full object-cover mx-auto"
              />
            </div>
          )}

          <Field label="Dish Name">
            <input
              name="name"
              type="text"
              required
              placeholder="e.g. Double Cheese Margherita"
              className="input-premium text-sm"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Price (₹)">
              <input name="price" type="number" min="0" step="1" required placeholder="e.g. 299" className="input-premium text-sm" />
            </Field>
            <Field label="Category">
              <select name="category" defaultValue="other" className="input-premium text-sm capitalize">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Description / Caption">
            <textarea
              name="description"
              rows="3"
              placeholder="Give a mouth-watering description of this dish..."
              className="input-premium resize-none text-sm"
            />
          </Field>

          {status.message && (
            <p className={status.type === "error" ? "text-xs font-bold text-red-500 animate-pulse" : "text-xs font-bold text-green-500"}>
              {status.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-brand-premium py-3.5 text-sm cursor-pointer"
          >
            {isSubmitting ? "Uploading Reel..." : "Upload Reel"}
          </button>
        </form>
      </div>
    </main>
  );
};

const Field = ({ label, children }) => (
  <label className="block">
    <span className="mb-2 block text-xs font-bold text-neutral-400 uppercase tracking-wider">{label}</span>
    {children}
  </label>
);

export default CreateFood;
