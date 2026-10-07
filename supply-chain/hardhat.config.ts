import { readFileSync } from "node:fs";
import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import { defineConfig } from "hardhat/config";

export default defineConfig({
  plugins: [hardhatToolboxMochaEthersPlugin],

  solidity: {
    profiles: {
      default: {
        version: "0.8.34",
        settings: { evmVersion: "berlin" },
      },
      production: {
        version: "0.8.34",
        settings: { evmVersion: "berlin", optimizer: { enabled: true, runs: 200 } }
      },
    },
  },

  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },

    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },

    besu: {
      type: "http",
      chainType: "l1",
      url: "http://127.0.0.1:8545",
      accounts: [
        readFileSync("../nodes/node1/key", "utf8").trim()
      ],
    },
  },
});
