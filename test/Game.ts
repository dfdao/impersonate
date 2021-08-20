// We import Chai to use its asserting functions here.
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Signer } from "ethers";
import { ethers } from "hardhat";
import { Game } from '../typechain'

describe("Game ", function () {

  describe("Game owner no change", function () {
    let game: Game; 
    let owner: SignerWithAddress;
    let dao: SignerWithAddress;

    // will execute before the first test
    before(async function () {
      const GameFactory = await ethers.getContractFactory("Game");
      game = await GameFactory.deploy() as Game;
      await game.deployed();
      [owner, dao] = await ethers.getSigners();
    });

    it("owner is game.owner()", async function () {
      expect(await game.owner()).to.equal(owner.address)
    });

    it("owner increments count from 0 to 1", async function () {
      expect(await game.count()).to.equal(0)

      const incrementTx = await game.increment();

      // wait until the transaction is mined
      await incrementTx.wait();

      expect(await game.count()).to.equal(1)
    });

    it("dao is not game.owner()", async function () {
      expect(await game.owner()).to.not.equal(dao.address)
    });

    it("dao cannot change game.owner", async function () {
      game = game.connect(dao); // dao is now connected to contract
      expect(await game.whoami()).to.equal(dao.address);
      await expect(game.setOwner(dao.address)).to.be.revertedWith('_getImpersonator is not owner');
    });


  });

  describe("Game owner change to dao", function () {
    let game: Game; 
    let owner: SignerWithAddress;
    let dao: SignerWithAddress; 

    // will execute before the first test
    before(async function () {
      const GameFactory = await ethers.getContractFactory("Game");
      game = await GameFactory.deploy() as Game;
      await game.deployed();
      [owner, dao] = await ethers.getSigners();
    });

    it("owner is game.owner()", async function () {
      expect(await game.owner()).to.equal(owner.address)
    });

    it("owner increments count from 0 to 1", async function () {
      expect(await game.count()).to.equal(0)

      const incrementTx = await game.increment();

      // wait until the transaction is mined
      await incrementTx.wait();

      expect(await game.count()).to.equal(1)
    });

    it("game owner is now dao", async function () {
      await game.setOwner(dao.address);
      expect(await game.owner()).to.equal(dao.address);
    });

    it("dao increments count from 1 to 2", async function () {

      // DAO is owner
      expect(await game.owner()).to.equal(dao.address);

      // count is 1
      expect(await game.count()).to.equal(1)

      const incrementTx = await game.increment();

      // wait until the transaction is mined
      await incrementTx.wait();

      expect(await game.count()).to.equal(2)
    });
  });

});
