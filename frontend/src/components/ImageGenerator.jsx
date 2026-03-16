import { useEffect, useState } from "react";
import axios from "axios";

function getImageSrc(imageItem) {
 if (!imageItem) {
  return "";
 }

 if (typeof imageItem === "string") {
  return imageItem;
 }

 if (typeof imageItem.url === "string") {
  return imageItem.url;
 }

 if (typeof imageItem.href === "string") {
  return imageItem.href;
 }

 return "";
}

function ImageGenerator() {

 const API_BASE_URL =
  import.meta.env.VITE_IMAGE_API_BASE_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "";

 const [prompt, setPrompt] = useState("");
 const [productReferenceUrl, setProductReferenceUrl] = useState("");
 const [inputImage, setInputImage] = useState(null);
 const [inputImagePreview, setInputImagePreview] = useState("");
 const [images, setImages] = useState([]);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");

 useEffect(() => {
  return () => {
   if (inputImagePreview) {
    URL.revokeObjectURL(inputImagePreview);
   }
  };
 }, [inputImagePreview]);

 const handleImageChange = (event) => {
  const selectedFile = event.target.files?.[0];

  setInputImage(selectedFile || null);
  setInputImagePreview(selectedFile ? URL.createObjectURL(selectedFile) : "");
 };

 const generateImage = async () => {

  if (!inputImage) {
   setError("Image is required");
   return;
  }

  if (!prompt.trim()) {
   setError("Prompt is required");
   return;
  }

  setLoading(true);
  setError("");
  setImages([]);

  const formData = new FormData();
  if (inputImage) {
   formData.append("inputImage", inputImage);
  }
  if (productReferenceUrl.trim()) {
   formData.append("productReferenceUrl", productReferenceUrl.trim());
  }
  if (prompt.trim()) {
   formData.append("prompt", prompt.trim());
  }

  try {
   const res = await axios.post(
    `${API_BASE_URL}/api/image`,
    formData
   );

   setImages(res.data.images || []);
  } catch (err) {
   setError(err.response?.data?.message || "Failed to generate images");
   setImages([]);
  } finally {
   setLoading(false);
  }
 };

 return (
  <section className="card">

   <div className="card-header">
    <h3>AI Image Generator</h3>
    <p>Create fresh product creatives from one source image and reference link.</p>
   </div>

   <label className="field-label">Input Product Image <span style={{color: 'red'}}>*</span></label>
   <input
    type="file"
    accept="image/*"
    onChange={handleImageChange}
   />

   {inputImagePreview && (
    <img className="preview-image" src={inputImagePreview} alt="Input preview" />
   )}

  <label className="field-label">Product Reference URL (Optional)</label>
   <input
    type="url"
    placeholder="https://example.com/product"
    value={productReferenceUrl}
    onChange={(event) => setProductReferenceUrl(event.target.value)}
   />

   <label className="field-label">Creative Prompt <span style={{color: 'red'}}>*</span></label>

   <input
    type="text"
    placeholder="Luxury studio setup with soft light and shadows"
    value={prompt}
    onChange={(event) => setPrompt(event.target.value)}
   />

   <button onClick={generateImage} disabled={loading}>
    {loading ? "Generating..." : "Generate Images"}
   </button>

   {error && <p className="error-text">{error}</p>}

    <div className="gallery image-gallery">
     {images.map((img, i) => {
      const src = getImageSrc(img);

      if (!src) {
        return null;
      }

      return (
        <img key={i} src={src} alt={`Generated product ${i + 1}`} />
      );
     })}
    </div>

  </section>
 );
}

export default ImageGenerator;