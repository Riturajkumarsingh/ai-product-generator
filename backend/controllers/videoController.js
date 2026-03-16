const axios = require("axios");

const RUNWAY_BASE_URL = process.env.RUNWAY_BASE_URL || "https://api.dev.runwayml.com/v1";
const RUNWAY_API_VERSION = process.env.RUNWAY_API_VERSION || "2024-11-06";
const RUNWAY_IMAGE_TO_VIDEO_MODEL = process.env.RUNWAY_IMAGE_TO_VIDEO_MODEL || "gen4_turbo";
const RUNWAY_TEXT_TO_VIDEO_MODEL = process.env.RUNWAY_TEXT_TO_VIDEO_MODEL || "gen4.5";

function sleep(ms) {
 return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForRunwayTask(taskId, headers) {
 const maxAttempts = 36;

 for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
  const taskResponse = await axios.get(`${RUNWAY_BASE_URL}/tasks/${taskId}`, {
   headers
  });

  const task = taskResponse.data;
  const status = task?.status;

  if (status === "SUCCEEDED") {
   const outputUrl = task.output?.[0] || task.output?.video_url || task.output?.url || "";

   if (!outputUrl) {
    throw new Error("Video URL not returned by Runway task output");
   }

   return outputUrl;
  }

  if (status === "FAILED" || status === "CANCELED") {
   throw new Error(task?.failure || `Runway task ${status}`);
  }

  await sleep(5000);
 }

 throw new Error("Video generation timed out");
}

exports.generateVideo = async (req, res) => {

 try {

  const prompt = req.body.prompt?.trim();
  const requestedDuration = Number(req.body.duration || 10);
  const duration = Number.isFinite(requestedDuration) ? Math.round(requestedDuration) : 10;

  if (!prompt) {
   return res.status(400).json({
    success: false,
    message: "Prompt is required"
   });
  }

  const images = req.files || [];

  if (images.length === 0) {
   return res.status(400).json({
    success: false,
    message: "Image is required"
   });
  }

  if (duration < 10 || duration > 30) {
   return res.status(400).json({
    success: false,
    message: "Duration must be between 10 and 30 seconds"
   });
  }

    const imageUrls = images.map((img) =>
     `data:${img.mimetype};base64,${img.buffer.toString("base64")}`
    );

  const apiKey = process.env.RUNWAY_API_KEY || process.env.RUNWAYML_API_SECRET;

  if (!apiKey) {
   return res.status(500).json({
    success: false,
    message: "Runway API key is missing"
   });
  }

  const headers = {
   Authorization: `Bearer ${apiKey}`,
   "Content-Type": "application/json",
   "X-Runway-Version": RUNWAY_API_VERSION
  };

    const isImageToVideo = images.length > 0;

    const createTaskResponse = await axios.post(
     isImageToVideo ? `${RUNWAY_BASE_URL}/image_to_video` : `${RUNWAY_BASE_URL}/text_to_video`,
     {
      model: isImageToVideo ? RUNWAY_IMAGE_TO_VIDEO_MODEL : RUNWAY_TEXT_TO_VIDEO_MODEL,
      promptText: prompt,
      ...(isImageToVideo ? { promptImage: imageUrls[0] } : {}),
      ratio: "1280:720",
      duration: Math.min(duration, 10)
     },
     { headers }
    );

  const taskId = createTaskResponse.data?.id;

  if (!taskId) {
   return res.status(502).json({
    success: false,
    message: "Runway task ID not returned"
   });
  }

  const videoUrl = await waitForRunwayTask(taskId, headers);

  res.json({
   success: true,
   video: videoUrl
  });

 } catch (error) {

  console.log(error);

  const statusCode = error.response?.status || error.status || 500;

  let message = error.response?.data?.message || error.message || "Video generation failed";

  if (statusCode === 401) {
   message = "Runway API authentication failed. Check RUNWAY_API_KEY and API access.";
  }

   res.status(statusCode).json({
   success: false,
   message
  });

 }

};