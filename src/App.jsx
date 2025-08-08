// src/App.tsx
import React from "react";
import TiltedCard from "./components/TiltedCard";
import SplitText from "./components/SplitText"; // Import SplitText

export default function App() {
  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "1200px",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      {/* SplitText Animation */}
      <SplitText
        text="Preview Thanks to ChatGPT"
        splitType="chars"
        delay={100}
        from={{ opacity: 0, y: 50 }}
        to={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-8"
      />

      {/* Tilted Card Component */}
      <div style={{ marginTop: "3rem" }}>
        <TiltedCard />
      </div>

      {/* Optional: Additional SplitText */}
      <SplitText
        text="Hover the card Above"
        splitType="words"
        delay={300}
        duration={0.8}
        className="text-xl mt-12 block"
      />
    </div>
  );
}
