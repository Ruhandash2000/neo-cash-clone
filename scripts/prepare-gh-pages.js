import fs from "node:fs";
import path from "node:path";

const publicDir = path.resolve(".output/public");
const assetsDir = path.join(publicDir, "assets");

if (!fs.existsSync(publicDir)) {
  console.error(".output/public directory does not exist. Run build first.");
  process.exit(1);
}

const files = fs.readdirSync(assetsDir);
const cssFile = files.find((f) => f.startsWith("styles-") && f.endsWith(".css"));
const indexJsFile = files.find((f) => f.startsWith("index-") && f.endsWith(".js"));

console.log("Found CSS asset:", cssFile);
console.log("Found JS asset:", indexJsFile);

const indexHtmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Neo Cashless</title>
    <meta name="description" content="Intelligent cashless financial ecosystem." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lobster+Two:ital,wght@0,400;0,700;1,400;1,700&family=Nunito+Sans:wght@400;500;600;700&display=swap" />
    <link rel="icon" href="./favicon.png" type="image/png" />
    ${cssFile ? `<link rel="stylesheet" href="./assets/${cssFile}" />` : ""}
  </head>
  <body>
    <div id="root"></div>
    ${indexJsFile ? `<script type="module" src="./assets/${indexJsFile}"></script>` : ""}
  </body>
</html>
`;

fs.writeFileSync(path.join(publicDir, "index.html"), indexHtmlContent);
fs.writeFileSync(path.join(publicDir, "404.html"), indexHtmlContent);
fs.writeFileSync(path.join(publicDir, ".nojekyll"), "");

console.log("Successfully prepared GitHub Pages static files (index.html, 404.html, .nojekyll) in .output/public");
