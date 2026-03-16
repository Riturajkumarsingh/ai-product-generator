const Replicate = require("replicate");

const replicate = new Replicate({
 auth: process.env.REPLICATE_API_TOKEN
});

const IMAGE_MODEL = process.env.REPLICATE_IMAGE_MODEL || "black-forest-labs/flux-kontext-pro";

function isValidUrl(value) {
 try {
  const parsed = new URL(value);
  return parsed.protocol === "http:" || parsed.protocol === "https:";
 } catch (_error) {
  return false;
 }
}

async function resolveOutputUrl(outputItem) {
 if (!outputItem) {
  return null;
 }

 if (typeof outputItem === "string") {
  return outputItem;
 }

 if (typeof outputItem.url === "function") {
  return outputItem.url();
 }

 if (typeof outputItem.url === "string") {
  return outputItem.url;
 }

 if (typeof outputItem.href === "string") {
  return outputItem.href;
 }

 const fallbackText = outputItem.toString?.();

 if (typeof fallbackText === "string" && (fallbackText.startsWith("http") || fallbackText.startsWith("data:image/"))) {
  return fallbackText;
 }

 return null;
}

exports.generateImage = async (req, res) => {

 try {

  const prompt = req.body.prompt?.trim();
   const productReferenceUrl = req.body.productReferenceUrl?.trim();
  const inputImage = req.file;

  if (!inputImage) {
   return res.status(400).json({
    message: "Input image is required"
   });
  }

  if (!prompt) {
   return res.status(400).json({
    message: "Prompt is required"
   });
  }

   if (productReferenceUrl && !isValidUrl(productReferenceUrl)) {
   return res.status(400).json({
      message: "Product reference URL must be valid"
   });
  }

  const inputImageDataUri = `data:${inputImage.mimetype};base64,${inputImage.buffer.toString("base64")}`;

  const referenceNote = productReferenceUrl
    ? ` Product reference: ${productReferenceUrl}.`
    : "";

  const finalPrompt = `${prompt}.${referenceNote} Maintain e-commerce quality lighting, clean background, and realistic product details.`;

  const inputOptions = {
     prompt: finalPrompt,
     input_image: inputImageDataUri,
     output_format: "jpg"
  };

  const output = await replicate.run(
   IMAGE_MODEL,
   {
    input: inputOptions
   }
  );

    const rawImages = Array.isArray(output) ? output : [output];
    const resolvedImages = (await Promise.all(rawImages.map(resolveOutputUrl))).filter(Boolean);

    if (!resolvedImages.length) {
     return res.status(502).json({
        message: "Image URLs not returned by provider"
     });
    }

  res.json({
     images: resolvedImages
  });

 } catch (error) {

  console.log(error);

  const statusCode = error.status || error.response?.status || 500;

  res.status(statusCode).json({
   message: error.message || "Image generation failed"
  });

 }

};