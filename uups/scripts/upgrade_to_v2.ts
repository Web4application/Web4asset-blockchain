import { ethers } from "hardhat";

async function main() {
  const proxy = process.env.PROXY_ADDRESS;
  if (!proxy) throw new Error("Set PROXY_ADDRESS in env when running");

  const V2 = await ethers.getContractFactory("AssetChainV2");
  const v2 = await V2.deploy();
  await v2.waitForDeployment();
  console.log("V2 impl:", await v2.getAddress());

  const asset = V2.attach(proxy);
  const tx = await asset.upgradeTo(await v2.getAddress());
  await tx.wait();
  console.log("Upgraded.");

  const init2 = await asset.initializeV2("W4A");
  await init2.wait();
  console.log("Initialized V2.");
  console.log("Version:", await asset.version());
}

main().catch((e) => { console.error(e); process.exit(1); });
