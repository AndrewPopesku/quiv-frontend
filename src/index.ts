import { serve, file } from "bun";
import { join } from "path";
import index from "./index.html";

const publicDir = join(import.meta.dir, "..", "public");

const server = serve({
  routes: {
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

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
