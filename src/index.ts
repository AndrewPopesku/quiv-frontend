import { serve, plugin, type BunPlugin } from "bun";
import postcss from "postcss";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";

// Custom PostCSS/Tailwind plugin for Bun
const postcssPlugin: BunPlugin = {
  name: "postcss-tailwind",
  setup(build) {
    build.onLoad({ filter: /\.css$/ }, async (args) => {
      const css = readFileSync(args.path, "utf-8");

      const result = await postcss([
        tailwindcss(resolve(process.cwd(), "tailwind.config.ts")),
        autoprefixer,
      ]).process(css, {
        from: args.path,
      });

      return {
        contents: result.css,
        loader: "css",
      };
    });
  },
};

const server = serve({
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;

    console.log(`[${req.method}] ${path}`);

    // API routes
    if (path.startsWith("/api/hello")) {
      if (path === "/api/hello") {
        return Response.json({
          message: "Hello, world!",
          method: req.method,
        });
      }
      const name = path.split("/")[3];
      return Response.json({
        message: `Hello, ${name}!`,
      });
    }

    // Serve compiled CSS
    if (path === "/index.css" || path === "/src/index.css") {
      try {
        const css = readFileSync("./src/index.css", "utf-8");
        const result = await postcss([
          tailwindcss(resolve(process.cwd(), "tailwind.config.ts")),
          autoprefixer,
        ]).process(css, { from: "./src/index.css" });

        return new Response(result.css, {
          headers: { "Content-Type": "text/css" }
        });
      } catch (err) {
        console.error("❌ CSS Build Error:", err);
        return new Response("CSS Build Error: " + String(err), { status: 500 });
      }
    }

    // Handle frontend bundling (transpile .tsx on the fly)
    if (path === "/frontend.tsx" || path === "/frontend.js" || path === "/src/frontend.tsx") {
      try {
        const result = await Bun.build({
          entrypoints: ["./src/frontend.tsx"],
          target: "browser",
          sourcemap: "inline",
          // plugins: [], // No plugins needed if we don't import CSS in JS
        });

        if (!result.success) {
          console.error("❌ Build failed:");
          for (const log of result.logs) {
            console.error(log);
          }
          return new Response("Build failed. Check server console.\n" + result.logs.map(l => l.message).join("\n"), { status: 500 });
        }

        return new Response(result.outputs[0], {
          headers: { "Content-Type": "text/javascript" }
        });
      } catch (err) {
        console.error("❌ Error during build:", err);
        return new Response("Internal Build Error: " + String(err), { status: 500 });
      }
    }

    // Try serving static files from public
    const publicFile = Bun.file(`./public${path}`);
    if (await publicFile.exists()) {
      return new Response(publicFile);
    }

    // Serve non-TS/JS files from src (like css, svg)
    if (path !== "/" && !path.endsWith(".ts") && !path.endsWith(".tsx")) {
      const srcFile = Bun.file(`./src${path}`);
      if (await srcFile.exists()) {
        return new Response(srcFile);
      }
    }

    // Fallback to index.html for all other routes (SPA)
    const indexFile = Bun.file("./src/index.html");
    if (await indexFile.exists()) {
      return new Response(indexFile, {
        headers: { "Content-Type": "text/html" },
      });
    }

    return new Response("Not Found", { status: 404 });
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
