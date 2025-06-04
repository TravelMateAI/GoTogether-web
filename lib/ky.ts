import ky from "ky";

// Instance for Spring Boot backend (assumed original)
const kyInstance = ky.create({
  prefixUrl: "http://localhost:8080",
  credentials: "include",
  parseJson: (text) => {
    if (!text || text.trim() === "") return null;
    return JSON.parse(text, (key, value) =>
      key.endsWith("At") && typeof value === "string" ? new Date(value) : value,
    );
  },
  timeout: 30000,
  retry: {
    limit: 3,
    methods: ["get", "post"],
  },
});

// New instance for Go backend
export const goKyInstance = ky.create({
  prefixUrl: "http://localhost:8000", // Changed prefixUrl
  credentials: "include",
  parseJson: (text) => { // Copied parseJson
    if (!text || text.trim() === "") return null;
    return JSON.parse(text, (key, value) =>
      key.endsWith("At") && typeof value === "string" ? new Date(value) : value,
    );
  },
  timeout: 30000, // Copied timeout
  retry: { // Copied retry
    limit: 3,
    methods: ["get", "post"],
  },
});

export default kyInstance; // Default export for the original instance
