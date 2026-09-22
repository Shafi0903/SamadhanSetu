import { test, describe } from "node:test";
import assert from "node:assert";
import { createApp } from "../app";

describe("Security Hardening Middleware Tests", () => {
  test("Helmet injects standard defensive headers", async () => {
    const app = createApp();
    const server = app.listen(0);
    const address = server.address();
    const port = typeof address === "object" && address ? address.port : 0;

    try {
      const res = await fetch(`http://127.0.0.1:${port}/health`);
      assert.strictEqual(res.status, 200);

      // Verify Helmet headers are present
      assert.strictEqual(res.headers.get("x-content-type-options"), "nosniff");
      assert.strictEqual(res.headers.get("x-frame-options"), "SAMEORIGIN");
      assert.strictEqual(res.headers.get("x-xss-protection"), "0");
      assert.strictEqual(res.headers.get("x-download-options"), "noopen");
    } finally {
      server.close();
    }
  });

  test("CORS allows requests from official frontend and blocks rogue origins", async () => {
    const app = createApp();
    const server = app.listen(0);
    const address = server.address();
    const port = typeof address === "object" && address ? address.port : 0;

    try {
      // 1. Allowed Origin
      const validRes = await fetch(`http://127.0.0.1:${port}/health`, {
        headers: { Origin: "https://frontend-tpit.vercel.app" },
      });
      assert.strictEqual(validRes.headers.get("access-control-allow-origin"), "https://frontend-tpit.vercel.app");

      // 2. Localhost Origin
      const localRes = await fetch(`http://127.0.0.1:${port}/health`, {
        headers: { Origin: "http://localhost:3000" },
      });
      assert.strictEqual(localRes.headers.get("access-control-allow-origin"), "http://localhost:3000");

      // 3. Rogue Origin
      const rogueRes = await fetch(`http://127.0.0.1:${port}/health`, {
        headers: { Origin: "https://malicious-phishing-site.com" },
      });
      assert.notStrictEqual(rogueRes.headers.get("access-control-allow-origin"), "https://malicious-phishing-site.com");
    } finally {
      server.close();
    }
  });
});
