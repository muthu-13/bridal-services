import React, { useState } from "react";
import { useFontStyle } from "../context/FontStyleContext";
import "./NoteEditor.css";

export default function FloatingPanel() {
  const {
    fontSize,
    setFontSize,
    fontFamily,
    setFontFamily,
    fontColor,
    setFontColor,
    fontWeight,
    setFontWeight,
    fontStyle,
    setFontStyle,
    lineHeight,
    setLineHeight,
  } = useFontStyle();

  const [isOpen, setIsOpen] = useState(false);

  const toggleBold = () =>
    setFontWeight(fontWeight === "700" ? "400" : "700");
  const toggleItalic = () =>
    setFontStyle(fontStyle === "italic" ? "normal" : "italic");

  return (
    <div className={`floating-panel ${isOpen ? "open" : ""}`}>
      <button
        className="toggle-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        Aa
      </button>

      {isOpen && (
        <div className="panel-content">
          <h4>Text Settings</h4>

          <label>Font Family:</label>
          <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
            <option value="'Poppins', sans-serif">Poppins</option>
            <option value="'Arial', sans-serif">Arial</option>
            <option value="'Times New Roman', serif">Times New Roman</option>
            <option value="'Courier New', monospace">Courier New</option>
          </select>

          <label>Font Size (px):</label>
          <input
            type="number"
            value={parseInt(fontSize)}
            onChange={(e) => setFontSize(e.target.value + "px")}
            min="10"
            max="72"
          />

          <label>Font Color:</label>
          <input type="color" value={fontColor} onChange={(e) => setFontColor(e.target.value)} />

          <div className="bold-italic-buttons">
            <button onClick={toggleBold} style={{ fontWeight: "700" }}>B</button>
            <button onClick={toggleItalic} style={{ fontStyle: "italic" }}>I</button>
          </div>

          <label>Line Height:</label>
          <input
            type="number"
            step="0.1"
            value={lineHeight}
            onChange={(e) => setLineHeight(e.target.value)}
            min="1"
            max="3"
          />
        </div>
      )}
    </div>
  );
}
