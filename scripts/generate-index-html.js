import fs from "node:fs";
import path from "node:path";

const clientDir = path.resolve("dist/client");
const assetsDir = path.join(clientDir, "assets");

if (fs.existsSync(assetsDir)) {
  const files = fs.readdirSync(assetsDir);
  const cssFile = files.find((f) => f.endsWith(".css"));
  const clientJsFile = files.find((f) => f.startsWith("client-") && f.endsWith(".js"));

  const html = `<!DOCTYPE html>
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

  fs.writeFileSync(path.join(clientDir, "index.html"), html, "utf-8");
  console.log("dist/client/index.html generated successfully with CSS and JS bundles.");
}
