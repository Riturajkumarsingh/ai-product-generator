import { useState } from "react";
import axios from "axios";

function VideoGenerator() {

 const API_BASE_URL =
   import.meta.env.VITE_VIDEO_API_BASE_URL ||
   import.meta.env.VITE_API_BASE_URL ||
   "";

 const [prompt, setPrompt] = useState("");
 const [images, setImages] = useState([]);
 const [video, setVideo] = useState("");
 const [duration, setDuration] = useState(10);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");

 // images select
 const handleImages = (e) => {
  setImages(e.target.files);
 };

 // VIDEO GENERATE FUNCTION
 const generateVideo = async () => {

    if (!prompt.trim()) {
     setError("Prompt is required");
     return;
    }

    if (!images || images.length === 0) {
     setError("Image is required");
     return;
    }

    setLoading(true);
    setError("");
    setVideo("");

  const formData = new FormData();

  formData.append("prompt", prompt);
  formData.append("duration", String(duration));

  for (let i = 0; i < images.length; i++) {
   formData.append("images", images[i]);
  }

    try {
     const res = await axios.post(
        `${API_BASE_URL}/api/video`,
        formData
     );

     setVideo(res.data.video || "");
    } catch (err) {
     setError(err.response?.data?.message || "Failed to generate video");
    } finally {
     setLoading(false);
    }
 };

 return (
  <section className="card">

   <div className="card-header">
    <h3>AI Video Generator</h3>
    <p>Generate product videos for e-commerce in 10-30 seconds duration.</p>
   </div>

   <label className="field-label">Scene Prompt</label>
   <textarea
    placeholder="Product rotating on a glossy table with cinematic lighting"
    value={prompt}
    onChange={(e) => setPrompt(e.target.value)}
   />

   <div className="duration-row">
    <label className="field-label" htmlFor="duration">Duration: {duration}s</label>
    <input
     id="duration"
     type="range"
     min="10"
     max="30"
     step="1"
     value={duration}
     onChange={(event) => setDuration(Number(event.target.value))}
    />
   </div>

  <label className="field-label">Upload Product Images <span style={{color: 'red'}}>*</span></label>
   <input
    type="file"
    accept="image/*"
    multiple
    onChange={handleImages}
   />

   <button onClick={generateVideo} disabled={loading}>
    {loading ? "Generating..." : "Generate Video"}
   </button>

   {error && <p className="error-text">{error}</p>}

   {video && (
    <video
     className="result-video"
     controls
     width="100%"
     src={video}
    />
   )}

  </section>
 );
}

export default VideoGenerator;