"use client";

import React, { useEffect, useState } from "react";

const imagesSet1 = [
  "/images/bg1.jpg",
  "/images/bg2.jpg",
  "/images/team1.jpg",
  "/images/team2.jpg",
];

const imagesSet2 = [
  "/images/team1.jpg",
  "/images/team2.jpg",
  "/images/bg1.jpg",
  "/images/bg2.jpg",
];

const getRandomPosition = () => {
  const top = Math.random() * 80 + "%";
  const left = Math.random() * 80 + "%";
  return { top, left };
};

const Gallery = ({ onClose }) => {
  const [showAltImages, setShowAltImages] = useState(false);
  const [positions, setPositions] = useState([]);

  const currentImages = showAltImages ? imagesSet2 : imagesSet1;

  useEffect(() => {
    const newPositions = Array(4)
      .fill(0)
      .map(() => getRandomPosition());
    setPositions(newPositions);
  }, [showAltImages]);

  return (
    <div
      className="fixed inset-0 bg-black p-10 z-50 cursor-pointer"
      onClick={onClose}
      onMouseEnter={() => setShowAltImages(true)}
      onMouseLeave={() => setShowAltImages(false)}
    >
      {currentImages.map((src, idx) => (
        <img
          key={src}
          src={src}
          alt={`img-${idx}`}
          className="absolute w-[20rem]  object-cover transition duration-500 ease-in-out"
          style={{
            top: positions[idx]?.top,
            left: positions[idx]?.left,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </div>
  );
};

export default Gallery;
