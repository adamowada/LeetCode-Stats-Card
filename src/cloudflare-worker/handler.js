const { Router } = require("itty-router");
const { Config, Generator } = require("../core");
const demo = require("./demo");
const Header = require("./headers");
const { sanitize } = require("./sanitize");

const router = Router();

router.get("/favicon.ico", async () => {
    return Response.redirect(
        "https://raw.githubusercontent.com/JacobLinCool/leetcode-stats-card/main/favicon/leetcode.ico",
        301,
    );
});

async function generate(config, req) {
    let sanitized;
    try {
        sanitized = sanitize(config);
    } catch (err) {
        return new Response(err.message, {
            status: 400,
        });
    }
    console.log("sanitized config", JSON.stringify(sanitized, null, 4));

    const cache_time = parseInt(config.cache || "300") || 300;
    const cache = await caches.open("leetcode");

    const generator = new Generator(cache, {
        "user-agent": req.headers.get("user-agent") || "Unknown",
    });
    generator.verbose = true;

    const headers = new Header().add("cors", "svg");
    headers.set("cache-control", `public, max-age=${cache_time}`);

    return new Response(await generator.generate(sanitized), { headers });
}

// handle path variable
router.get("/:username", async (request) => {
    request.query.username = request.params.username;
    return await generate(request.query, request);
});

// handle query string
router.get("*", async (req) => {
    if (!req.query.username) {
        return new Response(demo, {
            headers: new Header().add("cors", "html"),
        });
    }

    return await generate(req.query, req);
});

// 404 for all other routes
router.all("*", () => new Response("Not Found.", { status: 404 }));

export async function handle(request) {
    console.log(`${request.method} ${request.url}`);
    return router.handle(request);
}
