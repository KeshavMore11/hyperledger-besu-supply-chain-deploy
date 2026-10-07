import { readFileSync } from "node:fs";
import { ethers } from "ethers";

const RPC_URL = "http://127.0.0.1:8545";

const privateKey = readFileSync("../nodes/node1/key", "utf8").trim();

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(privateKey, provider);

console.log("Deployer:", wallet.address);

const balance = await provider.getBalance(wallet.address);
console.log("Balance:", ethers.formatEther(balance), "ETH");

const artifact = JSON.parse(
  readFileSync("./artifacts/contracts/SupplyChain.sol/SupplyChain.json", "utf8")
);

const factory = new ethers.ContractFactory(
  artifact.abi,
  artifact.bytecode,
  wallet
);

console.log("Deploying SupplyChain...");

const contract = await factory.deploy();

await contract.waitForDeployment();

console.log("SupplyChain deployed at:", await contract.getAddress());

