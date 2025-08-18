// /components/InteractiveButton.jsx

"use client"; // ✅ Make this component run in the browser

export default function InteractiveButton({ onClick, children }) {
  return (
    <button onClick={onClick} className="your-styles-here">
      {children}
    </button>
  );
}