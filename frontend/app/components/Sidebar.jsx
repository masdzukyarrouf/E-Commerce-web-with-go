"use client";
import { useState } from "react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  const categories = [
    "Electronics",
    "Fashion",
    "Books",
    "Home",
    "Toys",
    "Sports"
  ];

  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen p-4 transition-all duration-300"
      style={{
        width: open ? "16rem" : "4rem"
      }}
    >
      <button
        className="text-left mb-4"
        onClick={() => setOpen(!open)}
      >
        {open ? "X" : "☰"}
      </button>

      <ul>
        {open &&
          categories.map((cat) => (
            <li key={cat} className="py-2 hover:bg-gray-700 px-2 rounded cursor-pointer">
              {cat}
            </li>
          ))}
      </ul>
    </aside>
  );
}
