import "@nomiclabs/hardhat-waffle";
import '@typechain/hardhat'
import { task } from "hardhat/config";
import { HardhatUserConfig } from "hardhat/config";



// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const config: HardhatUserConfig = {
  // Your type-safe config goes here
  solidity: "0.8.4",
  // typechain: {
  //   outDir: 'types',
  //   target: 'ethers-v5',
  //   alwaysGenerateOverloads: false, // should overloads with full signatures like deposit(uint256) be generated always, even if there are no overloads?
  //   // externalArtifacts: ['externalArtifacts/*.json'], // optional array of glob patterns with external artifacts to process (for example external libs from node_modules)
  // },
};

export default config;


// Network stuff for later

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
// export default {
//   solidity: "0.8.4",
//   // networks: {
//   //   hardhat: {
//   //     // accounts: {
//   //     //   accountsBalance: "10",
//   //     // },
//   //     forking: {
//   //       enabled: true,
//   //       url: "https://xdai-archive.blockscout.com/",
//   //       blockNumber: 17615631, //17615631
//   //     },
//   //   },
//   // },
// };
