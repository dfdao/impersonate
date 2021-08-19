// We import Chai to use its asserting functions here.
import { ethers } from "hardhat";
import { expect } from "chai";
const ZERO = ethers.constants.AddressZero;

// Game where only the owner can do stuff
// b/c contract inherits from
describe("Game contract", function () {
  // You can nest describe calls to create subsections.
  describe("Initial game", function () {
    let Game;
    let gameContract: any;

    // regular tests in describe block
    // dao owns now describe
    // be very clear who is owner, who is msg.sender

    before(async function () {
      Game = await ethers.getContractFactory("Game");
      gameContract = await Game.deploy();
    });

    it("game owner is msg.sender", async function () {
      const [owner] = await ethers.getSigners();
      expect(await gameContract.owner()).to.equal(owner.address)
    });

    it("owner increments count from 0 to 1", async function () {
      expect(await gameContract.count()).to.equal(0)

      const incrementTx = await gameContract.increment();

      // wait until the transaction is mined
      await incrementTx.wait();

      expect(await gameContract.count()).to.equal(1)
    });


    it.skip("game owner is now dao", async function () {
      const DAO_ADDRESS = await gameContract.DAO_ADDRESS();
      await gameContract.setOwner(DAO_ADDRESS);
      expect(await gameContract.owner()).to.equal(DAO_ADDRESS);
    });

    it.skip("dao increments count from 1 to 2", async function () {
      // DAO is owner
      const DAO_ADDRESS = await gameContract.DAO_ADDRESS();
      expect(await gameContract.owner()).to.equal(DAO_ADDRESS);

      // count is 1
      expect(await gameContract.count()).to.equal(1)

      const incrementTx = await gameContract.increment();

      // wait until the transaction is mined
      await incrementTx.wait();

      expect(await gameContract.count()).to.equal(2)
    });

    it("addr1 is not owner", async function () {
      const [owner, addr1, ...addrs] = await ethers.getSigners();
      expect(await gameContract.owner()).to.not.equal(addr1.address);
    });

    // it("msg.sender can't increment", async function () {
    //   expect(await gameContract.whoami()).to.equal(owner.address);
    //   // connect addr1
    //   gameContract = gameContract.connect(addr1);
    //
    //   expect(await gameContract.whoami()).to.equal(addr1.address);
    //
    //   try {
    //     await gameContract.increment();
    //     // expect(true).to.be.false;
    //   } catch(err) {
    //     expect(err.message).to.equal(err.message);
    //   }
    //
    // });

    it("msg.sender can't increment", async function () {
      const [owner, addr1, ...addrs] = await ethers.getSigners();
      expect(await gameContract.whoami()).to.equal(owner.address);
      // connect addr1
      gameContract = gameContract.connect(addr1);

      expect(await gameContract.whoami()).to.equal(addr1.address);

      try {
        await gameContract.increment();
        // expect(true).to.be.false;
      } catch(err) {
        expect(err.message).to.equal(err.message);
      }

    });
  });

});
