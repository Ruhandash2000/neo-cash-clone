import fs from "node:fs";
import path from "node:path";
import process from "node:process";

// Read token from environment or process arguments
const figmaToken = process.env.FIGMA_ACCESS_TOKEN || "figd_FQK1tBHRxi1wAMOAHJx7ZZTBSodgomrosoQoVUWm";
const figmaFileUrlOrKey = process.argv[2] || process.env.FIGMA_FILE_KEY;

if (!figmaFileUrlOrKey) {
  console.log("Usage: node scripts/sync-figma.js <FIGMA_FILE_URL_OR_KEY>");
  console.log("Example: node scripts/sync-figma.js https://www.figma.com/design/abc123xyz/My-Design");
  process.exit(1);
}

// Extract file key from URL or raw key string
let fileKey = figmaFileUrlOrKey;
const match = figmaFileUrlOrKey.match(/(?:file|design)\/([a-zA-Z0-9]+)/);
if (match && match[1]) {
  fileKey = match[1];
}

console.log(`Fetching Figma file metadata for File Key: ${fileKey}...`);

async function fetchFigmaFile() {
  try {
    const res = await fetch(`https://api.figma.com/v1/files/${fileKey}`, {
      headers: {
        "X-Figma-Token": figmaToken,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Figma API Error (${res.status}):`, errorText);
      process.exit(1);
    }

    const data = await res.json();
    console.log(`Successfully fetched Figma project: "${data.name}"`);
    console.log(`Last modified: ${data.lastModified}`);
    
    // Save metadata snapshot
    const outDir = path.resolve("scratch");
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
    
    fs.writeFileSync(
      path.join(outDir, "figma-metadata.json"),
      JSON.stringify({ name: data.name, lastModified: data.lastModified, document: data.document }, null, 2)
    );
    console.log(`Saved metadata to scratch/figma-metadata.json`);

  } catch (err) {
    console.error("Failed to connect to Figma API:", err);
  }
}

fetchFigmaFile();
