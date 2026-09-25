import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const figmaToken = process.env.FIGMA_ACCESS_TOKEN || "figd_FQK1tBHRxi1wAMOAHJx7ZZTBSodgomrosoQoVUWm";
const fileKey = "vcRMDeBpHVMVLm4BWkzGqR";

const nodeIds = [
  "1:2268", // home page
  "1:4905", // log in
  "1:5687", // finger
  "1:6127", // signup
  "1:3690", // AIChatWidget
];

async function downloadFrameImages() {
  console.log(`Requesting rendered frame images from Figma for IDs: ${nodeIds.join(",")}`);
  const url = `https://api.figma.com/v1/images/${fileKey}?ids=${nodeIds.join(",")}&scale=2&format=png`;

  const res = await fetch(url, {
    headers: { "X-Figma-Token": figmaToken },
  });

  if (!res.ok) {
    console.error("Figma Images API Error:", await res.text());
    process.exit(1);
  }

  const data = await res.json();
  console.log("Image URLs received from Figma:");
  
  const outDir = path.resolve("src/assets/figma-renders");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const idNameMap = {
    "1:2268": "home-page",
    "1:4905": "login-modal-figma",
    "1:5687": "biometric-modal-figma",
    "1:6127": "signup-page-figma",
    "1:3690": "ai-chat-widget-figma",
  };

  for (const [nodeId, imgUrl] of Object.entries(data.images)) {
    if (!imgUrl) continue;
    const name = idNameMap[nodeId] || nodeId.replace(":", "-");
    console.log(`Downloading ${name} from ${imgUrl}...`);
    const imgRes = await fetch(imgUrl);
    const buffer = Buffer.from(await imgRes.arrayBuffer());
    const filePath = path.join(outDir, `${name}.png`);
    fs.writeFileSync(filePath, buffer);
    console.log(`Saved ${name}.png to ${filePath}`);
  }

  console.log("All Figma frame renders downloaded successfully!");
}

downloadFrameImages();
