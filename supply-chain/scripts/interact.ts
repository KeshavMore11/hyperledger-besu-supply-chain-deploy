import { readFileSync } from "node:fs";
import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545", 1337, { staticNetwork: true });
const wallet = new ethers.Wallet(readFileSync("../nodes/node1/key", "utf8").trim(), provider);

const artifact = JSON.parse(
  readFileSync("./artifacts/contracts/SupplyChain.sol/SupplyChain.json", "utf8")
);
const address = readFileSync("./deployed-address.txt", "utf8").trim();
const sc = new ethers.Contract(address, artifact.abi, wallet);
const opt = { gasPrice: 0 };

const send = async (label: string, p: Promise<any>) => {
  const tx = await p;
  const r = await tx.wait();
  console.log(`${label} -> block ${r.blockNumber}, tx ${tx.hash}`);
};

const show = async (id: number) => {
  const b = await sc.getBatch(id);
  const status = ["Created", "Harvested", "InTransit", "AtWarehouse", "Delivered"];
  console.log({
    id: Number(b[0]), product: Number(b[1]) === 0 ? "Mango" : "Apple",
    batchNumber: b[2], quantity: Number(b[3]), owner: b[4],
    location: b[5], status: status[Number(b[6])],
  });
};

await send("Create Mango", sc.createBatch(true, "MNG-001", 500, "Farmer Ramesh", "Ratnagiri Farm", opt));
await send("Create Apple", sc.createBatch(false, "APL-001", 300, "Farmer Sunil", "Shimla Orchard", opt));

await send("Mango harvested", sc.transferBatch(1, "Farmer Ramesh", "Ratnagiri Farm", 1, opt));
await send("Mango in transit", sc.transferBatch(1, "Logistics Co", "Highway NH66", 2, opt));
await send("Mango at warehouse", sc.transferBatch(1, "Pune Warehouse", "Pune", 3, opt));
await send("Mango delivered", sc.transferBatch(1, "Retailer FreshMart", "Pimpri Store", 4, opt));

await send("Apple in transit", sc.transferBatch(2, "Logistics Co", "Highway NH44", 2, opt));

console.log("Total batches:", Number(await sc.batchCount()));
await show(1);
await show(2);