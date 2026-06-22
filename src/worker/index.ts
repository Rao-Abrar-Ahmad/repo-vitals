import { Hono } from "hono";
import { cors } from "hono/cors";
import { analyzeRoute } from "./routes/analyze";

type Env = { ASSETS: Fetcher; OPENROUTER_API_KEY: string };

const app = new Hono<{ Bindings: Env }>();

app.use("*", cors());

// Health check endpoint
app.get("/api/health", (c) => c.json({ status: "ok", version: "1.0.0" }));

// Analyze route
app.route("/api", analyzeRoute);

// Serve React SPA static assets
app.get("*", (c) => {
  // Local wrangler dev might not bind ASSETS correctly in all environments,
  // handle graceful fallback or direct fetch.
  if (c.env.ASSETS) {
    return c.env.ASSETS.fetch(c.req.raw);
  }
  return c.text("ASSETS binding not available. Run `npm run build` first.", 500);
});

export default app;
