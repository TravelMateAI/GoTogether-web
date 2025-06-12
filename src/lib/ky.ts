import ky, { Options } from "ky";

// Flag to prevent multiple refresh attempts concurrently
let isRefreshing = false;
// To queue requests while token is being refreshed
let failedRequestsQueue: {
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
  request: Request;
}[] = [];

const defaultOptions: Options = {
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
    limit: 3, // Original retry for network errors
    methods: ["get", "post"], // Original retry for network errors
  },
};

const kyInstance = ky.create({
  ...defaultOptions,
  hooks: {
    beforeRequest: [
      async (request) => {
        // Check if the request is not a refresh attempt itself
        if (isRefreshing && !request.url.endsWith("/api/auth/refresh")) {
          // Wait for token refresh to complete before sending other requests
          return new Promise((resolve) => {
            const checkRefreshDone = setInterval(() => {
              if (!isRefreshing) {
                clearInterval(checkRefreshDone);
                console.log(
                  "Token refresh completed. Proceeding with request:",
                  request.url,
                );
                resolve(request);
              }
            }, 100); // Check every 100ms
          });
        }
        return request;
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        const requestUrl = new URL(request.url); // Get full URL for proper check
        // Check if it's a 401 and not a refresh attempt that failed
        if (response.status === 401 && !requestUrl.pathname.endsWith("/api/auth/refresh")) {
          if (!isRefreshing) {
            isRefreshing = true;
            try {
              console.log(
                "Access token expired. Attempting to refresh...",
                request.url,
              );
              // Use plain fetch for the refresh token request to avoid hook recursion and use absolute URL
              const refreshResponse = await fetch(
                `${defaultOptions.prefixUrl}/api/auth/refresh`,
                {
                  method: "POST",
                  credentials: "include", // Crucial to send the refresh_token cookie
                  headers: {
                    "Content-Type": "application/json", // Adjust if backend expects different
                  },
                },
              );

              if (refreshResponse.ok) {
                console.log("Token refreshed successfully.");
                // Retry the original request and all queued requests
                const originalRetry = ky(request); // Retry original first
                const queuedRetries = failedRequestsQueue.map(
                  (prom) => ky(prom.request) // Then retry queued
                );

                // Resolve all promises
                failedRequestsQueue.forEach((prom, index) => prom.resolve(queuedRetries[index]));
                failedRequestsQueue = [];
                isRefreshing = false;
                return originalRetry; // Return the promise for the original request
              } else {
                console.error(
                  "Failed to refresh token:",
                  refreshResponse.status,
                  await refreshResponse.text(),
                );
                // Reject all queued requests
                failedRequestsQueue.forEach((prom) => prom.reject(refreshResponse.clone())); // Clone response for multiple rejections
                failedRequestsQueue = [];
                isRefreshing = false;
                // If refresh fails, the original request's 401 response will be returned
                // or an error will be thrown by ky if it exceeds its own retry limit for this request.
                // No need to throw explicitly here unless we want to always stop on refresh failure.
                // Let's just return the original 401 response.
                return response;
              }
            } catch (error) {
              console.error("Error during token refresh process:", error);
              failedRequestsQueue.forEach((prom) => prom.reject(error));
              failedRequestsQueue = [];
              isRefreshing = false;
              throw error; // Re-throw error to fail the original request
            }
          } else {
            // Token is already refreshing, queue this request
            console.log("Token is refreshing. Queuing request:", request.url);
            return new Promise((resolve, reject) => {
              failedRequestsQueue.push({ resolve, reject, request: request.clone() }); // Clone request
            });
          }
        } else if (response.status === 401 && requestUrl.pathname.endsWith("/api/auth/refresh")) {
            // This means the refresh token itself is invalid or expired.
            console.error("Refresh token is invalid or expired. User needs to re-authenticate.");
            isRefreshing = false; // Reset flag
            // Reject all queued requests because refresh is impossible
            failedRequestsQueue.forEach(prom => prom.reject(response.clone())); // Clone response
            failedRequestsQueue = [];

            // Redirect to login if refresh token is invalid
            if (typeof window !== 'undefined') {
              console.log('Redirecting to login page due to invalid refresh token.');
              window.location.href = '/login';
            }
            return response; // Return the original 401 response for the refresh call
        }
        return response; // For non-401 responses
      },
    ],
  },
});

// New instance for Go backend (remains unchanged)
export const goKyInstance = ky.create({
  prefixUrl: "http://localhost:8083",
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

export default kyInstance;
