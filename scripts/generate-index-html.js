import fs from "node:fs";
import path from "node:path";

const clientDir = path.resolve("dist/client");
const serverEntry = path.resolve("dist/server/server.js");

async function generate() {
  if (!fs.existsSync(serverEntry)) {
    console.error("dist/server/server.js not found!");
    return;
  }

  try {
    const mod = await import(`file://${serverEntry.replace(/\\/g, "/")}`);
    if (mod.default && typeof mod.default.fetch === "function") {
      const req = new Request("http://localhost:8080/");
      const res = await mod.default.fetch(req);
      if (res.ok) {
        const fullHtml = await res.text();
        fs.writeFileSync(path.join(clientDir, "index.html"), fullHtml, "utf-8");
        console.log(`Generated authentic TanStack SSR index.html (${fullHtml.length} bytes)`);
        return;
      }
    }
  } catch (err) {
    console.warn("SSR render in script failed:", err);
  }
}

generate();
