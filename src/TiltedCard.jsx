import React from "react";
import "./TiltedCard.css"; // Import the CSS file in the same folder

export default function TiltedCard() {
  return (
    <figure className="tilted-card-figure">
      <div className="tilted-card-inner">
        <img
          className="tilted-card-img"
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
          alt="Sample"
        />
        <figcaption className="tilted-card-caption">Sample Caption</figcaption>
      </div>
      <div className="tilted-card-mobile-alert">Mobile view detected</div>
    </figure>
  );
}
