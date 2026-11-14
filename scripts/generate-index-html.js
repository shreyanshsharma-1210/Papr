import fs from "node:fs";
import path from "node:path";

const clientDir = path.resolve("dist/client");
const assetsDir = path.join(clientDir, "assets");

if (fs.existsSync(assetsDir)) {
  const files = fs.readdirSync(assetsDir);
  const cssFile = files.find((f) => f.endsWith(".css"));
  const clientJsFile = files.find((f) => f.startsWith("client-") && f.endsWith(".js"));

  // Fetch the SSR rendered HTML from local server if running, or build full static shell
  let preRenderedHtml = "";
  try {
    const res = await fetch("http://localhost:8080/");
    if (res.ok) {
      preRenderedHtml = await res.text();
    }
  } catch {
    // dev server offline
  }

  let finalHtml = "";
  if (preRenderedHtml && preRenderedHtml.includes("<body")) {
    // Replace dev styles and vite scripts with production hashed assets
    finalHtml = preRenderedHtml
      .replace(/<link rel="stylesheet" href="\/src\/styles\.css"\/>/, `<link rel="stylesheet" href="/assets/${cssFile}"/>`)
      .replace(/<link rel="stylesheet" href="\/@tanstack-start\/styles\.css[^"]*"\s*data-tanstack-router-dev-styles="true"\/>/, "")
      .replace(/<script[^>]*virtual:tanstack-start-client-entry[^>]*><\/script>/g, `<script type="module" src="/assets/${clientJsFile}"></script>`)
      .replace(/<script[^>]*@react-refresh[^>]*><\/script>/g, "");
  } else {
    finalHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>PAPR — Stationery · Essentials · Print</title>
  <meta name="description" content="Make room for ideas. Thoughtfully curated school and college kits, fine writing instruments, notebook systems, and high-precision print studio." />
  <meta name="theme-color" content="#302033" />
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300..800;1,9..40,300..800&family=Manrope:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600;1,700&display=swap" />
  ${cssFile ? `<link rel="stylesheet" href="/assets/${cssFile}" />` : ""}
</head>
<body class="bg-[#F7F5EF] text-[#302033] antialiased">
  <div id="root"></div>
  ${clientJsFile ? `<script type="module" src="/assets/${clientJsFile}"></script>` : ""}
</body>
</html>`;
  }

  fs.writeFileSync(path.join(clientDir, "index.html"), finalHtml, "utf-8");
  console.log("dist/client/index.html generated with full HTML structure.");
}
