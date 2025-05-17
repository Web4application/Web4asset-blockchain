const fs = require("fs");
const path = require("path");

const sourcePath = path.join(__dirname, "contracts.json");
const targetPath = path.join(__dirname, "contractadress.json");

// Read new contracts
const newContracts = JSON.parse(fs.readFileSync(sourcePath));

// Load existing saved contracts
let savedContracts = {};
if (fs.existsSync(targetPath)) {
  savedContracts = JSON.parse(fs.readFileSync(targetPath));
}

// Merge and update
newContracts.forEach(({ name, address }) => {
  savedContracts[name] = address;
});

// Save result
fs.writeFileSync(targetPath, JSON.stringify(savedContracts, null, 2));
console.log(`✅ Imported ${newContracts.length} contracts into contractadress.json`);
