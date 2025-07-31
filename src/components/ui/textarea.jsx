import React from "react";

export function Textarea({ className = "", ...props }) {
  return <textarea {...props} className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring ${className}`} />;
}
