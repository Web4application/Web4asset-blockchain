import { initBlockchain } from "../blockchain/init.js";

document.addEventListener("DOMContentLoaded", async () => {
  const { fadakaContract } = await initBlockchain();

  if (fadakaContract) {
    const supply = await fadakaContract.totalSupply();
    console.log("Total Supply:", supply.toString());
  }
});
