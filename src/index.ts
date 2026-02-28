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

    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/hello": {
      async GET(req) {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },
      async PUT(req) {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },

    "/api/hello/:name": async (req) => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
