import { run } from "hardhat";

async function main() {
  const impl = process.env.IMPLEMENTATION_ADDRESS;
  if (!impl) throw new Error("Set IMPLEMENTATION_ADDRESS");

  await run("verify:verify", { address: impl, constructorArguments: [] });
  console.log("Verified implementation at", impl);
}

main().catch((e) => { console.error(e); process.exit(1); });
