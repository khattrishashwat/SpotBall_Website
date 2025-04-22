const fs = require("fs");
const execSync = require("child_process").execSync;

// Get the latest Git commit hash
const commitHash = execSync("git rev-parse --short HEAD").toString().trim();

// Create a meta.json file with the commit hash
const meta = {
  version: commitHash, // Store commit hash as the version
};

// Save it to public/meta.json
fs.writeFileSync("public/meta.json", JSON.stringify(meta, null, 2));

console.log(`Version generated: ${commitHash}`);
