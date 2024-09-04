import { IncomingMessage, ServerResponse } from "http";
import { handle } from "../../src/cloudflare-worker/handler";

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const request = new Request(req.url as string, {
        headers: req.headers as HeadersInit,
        method: req.method,
        body: req.method === "POST" ? JSON.stringify(req.body) : null,
    });

    try {
        const response = await handle(request);
        res.statusCode = response.status;
        response.headers.forEach((value, key) => {
            res.setHeader(key, value);
        });
        const body = await response.text();
        res.end(body);
    } catch (error) {
        res.statusCode = 500;
        res.end("An error occurred");
    }
}
