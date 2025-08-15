import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  const owner = process.env.OWNER_ADDRESS;
  const name = process.env.CONTRACT_NAME || "Web4AssetChain";
  if (!owner) throw new Error("Set OWNER_ADDRESS in .env");

  const V1 = await ethers.getContractFactory("AssetChainV1");
  const v1 = await V1.deploy();
  await v1.waitForDeployment();
  console.log("V1 impl:", await v1.getAddress());

  const initData = V1.interface.encodeFunctionData("initialize", [owner, name]);

  const Proxy = await ethers.getContractFactory("ERC1967Proxy");
  const proxy = await Proxy.deploy(await v1.getAddress(), initData);
  await proxy.waitForDeployment();
  const proxyAddr = await proxy.getAddress();
  console.log("Proxy:", proxyAddr);

  // Attach logic ABI to proxy
  const asset = V1.attach(proxyAddr);
  console.log("Owner:", await asset.owner());
  console.log("Name:", await asset.name());
}

main().catch((e) => { console.error(e); process.exit(1); });
