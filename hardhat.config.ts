import "@nomiclabs/hardhat-waffle";
import '@typechain/hardhat'
import { task } from "hardhat/config";
import { HardhatUserConfig } from "hardhat/config";



// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("balance", "Prints owner account's balance")
  // .addParam("account", "The account's address")
  .setAction(async (taskArgs, hre) => {
    const [owner] = await hre.ethers.getSigners();
    const balance = await hre.ethers.provider.getBalance(owner.address)
    const niceBalance = hre.ethers.utils.formatEther(balance)
    console.log(`myBalance: ${niceBalance}`);

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
