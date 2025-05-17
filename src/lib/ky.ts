// lib/ky.ts
import ky from "ky";

const kyInstance = ky.create({
  prefixUrl: "http://localhost:8080", 
  parseJson: (text) =>
    JSON.parse(text, (key, value) =>
      key.endsWith("At") && typeof value === "string" ? new Date(value) : value
    ),
  timeout: 30000,
  retry: {
    limit: 3,
    methods: ["get", "post"],
  },
});

export default kyInstance;
