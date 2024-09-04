import { handle } from "../src/cloudflare-worker/handler";

export default async function handler(req, res) {
    try {
        // Pass req and res directly to the handle function (which may need to be adapted)
        const result = await handle({
            url: req.url,
            headers: req.headers,
            method: req.method,
            body: req.method === "POST" ? JSON.stringify(req.body) : null,
        });

        // Set the response headers and status code from the result
        res.statusCode = result.status || 200;
        res.setHeader("Content-Type", result.contentType || "application/json");

        // Send the response body back to the client
        res.end(result.body || JSON.stringify({ message: "Request handled successfully" }));
    } catch (error) {
        // Handle errors and return a 500 response
        res.statusCode = 500;
        res.end("An error occurred");
    }
}
