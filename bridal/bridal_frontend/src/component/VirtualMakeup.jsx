import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

export default function VirtualMakeupPhoto() {
  const canvasRef = useRef();
  const imageRef = useRef();
  const [loading, setLoading] = useState(true);

  // Dynamic colors
  const [lipstickColor, setLipstickColor] = useState("#ff0064"); // pink/red
  const [eyeColor, setEyeColor] = useState("#0096ff"); // blue
  const [blushColor, setBlushColor] = useState("#ff9696"); // light blush

  // Load face-api models
  const loadModels = async () => {
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(
          "/models/tiny_face_detector_model-weights_manifest.json"
        ),
        faceapi.nets.faceLandmark68Net.loadFromUri(
          "/models/face_landmark_68_model-weights_manifest.json"
        ),
      ]);
      setLoading(false);
    } catch (err) {
      console.error("Model loading error:", err);
      alert("Failed to load AI models. Check console.");
    }
  };

  useEffect(() => {
    loadModels();
  }, []);

  // Function to apply makeup
  const applyMakeup = (canvas, landmarks) => {
    const ctx = canvas.getContext("2d");

    // 💋 Lipstick
    const mouth = landmarks.getMouth();
    ctx.fillStyle = lipstickColor + "99"; // add alpha for transparency
    ctx.beginPath();
    mouth.forEach((point, i) =>
      i === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y)
    );
    ctx.closePath();
    ctx.fill();

    // 👁️ Eyeshadow
    const leftEye = landmarks.getLeftEye();
    const rightEye = landmarks.getRightEye();
    [leftEye, rightEye].forEach((eye) => {
      ctx.fillStyle = eyeColor + "66"; // semi-transparent
      ctx.beginPath();
      eye.forEach((point, i) =>
        i === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y)
      );
      ctx.closePath();
      ctx.fill();
    });

    // 😊 Blush
    const leftCheek = landmarks.getLeftEyeBrow()[2];
    const rightCheek = landmarks.getRightEyeBrow()[2];
    [leftCheek, rightCheek].forEach((cheek) => {
      ctx.fillStyle = blushColor + "66"; // semi-transparent
      ctx.beginPath();
      ctx.arc(cheek.x, cheek.y + 20, 20, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = async () => {
      imageRef.current = img;

      // Set canvas size
      const canvas = canvasRef.current;
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);

      // Detect face & landmarks
      const detections = await faceapi
        .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();

      const resizedDetections = faceapi.resizeResults(detections, {
        width: img.width,
        height: img.height,
      });

      // Apply makeup
      resizedDetections.forEach((d) => applyMakeup(canvas, d.landmarks));
    };
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1 style={{ color: "#b30059" }}>💄 Virtual Makeup on Photo</h1>
      {loading ? (
        <p>Loading AI models...</p>
      ) : (
        <>
          {/* Image Upload */}
          <input type="file" accept="image/*" onChange={handleImageUpload} />

          {/* Color Pickers */}
          <div style={{ marginTop: "15px" }}>
            <label>
              Lipstick:{" "}
              <input
                type="color"
                value={lipstickColor}
                onChange={(e) => setLipstickColor(e.target.value)}
              />
            </label>
            <label style={{ marginLeft: "10px" }}>
              Eyeshadow:{" "}
              <input
                type="color"
                value={eyeColor}
                onChange={(e) => setEyeColor(e.target.value)}
              />
            </label>
            <label style={{ marginLeft: "10px" }}>
              Blush:{" "}
              <input
                type="color"
                value={blushColor}
                onChange={(e) => setBlushColor(e.target.value)}
              />
            </label>
          </div>

          {/* Canvas */}
          <div
            style={{
              position: "relative",
              display: "inline-block",
              marginTop: "20px",
            }}
          >
            <canvas ref={canvasRef} style={{ borderRadius: "12px" }} />
          </div>
        </>
      )}
    </div>
  );
}
