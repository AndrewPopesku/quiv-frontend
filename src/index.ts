import { serve, file } from "bun";
import { join } from "path";
import index from "./index.html";

const publicDir = join(import.meta.dir, "..", "public");
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8002";

const server = serve({
  routes: {
    // Proxy API requests to backend
    "/api/*": async (req) => {
      const url = new URL(req.url);
      const targetUrl = `${API_BASE_URL}${url.pathname}${url.search}`;
      const headers = new Headers(req.headers);
      headers.delete("host");

      const res = await fetch(targetUrl, {
        method: req.method,
        headers,
        body: req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined,
      });

      return new Response(res.body, {
        status: res.status,
        statusText: res.statusText,
        headers: res.headers,
      });
    },

    // Serve static files from public/images
    "/images/*": async (req) => {
      const url = new URL(req.url);
      const filePath = join(publicDir, url.pathname);
      const f = file(filePath);
      if (await f.exists()) return new Response(f);
      return new Response("Not found", { status: 404 });
    },

    // Serve index.html for all other routes (SPA)
    "/*": index,
  },

  development: process.env.NODE_ENV === "production" ? false : {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
