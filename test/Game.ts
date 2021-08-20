// We import Chai to use its asserting functions here.
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Signer } from "ethers";
import { ethers } from "hardhat";
import { Game } from '../typechain'

describe("Game ", function () {

  describe("Game owner no change", function () {
    let game: Game; 
    let daoGame: Game;
    let owner: SignerWithAddress;
    let dao: SignerWithAddress;

    beforeEach(async function () {
      [owner, dao] = await ethers.getSigners();
      const GameFactory = await ethers.getContractFactory("Game");
      game = await GameFactory.deploy() as Game;
      await game.deployed();
      daoGame = game.connect(dao);
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

    it("owner can set setOwner", async function () {
      await game.setOwner(dao.address);
      expect(await game.owner()).to.equal(dao.address);
    });

    it("dao cannot set owner", async function () {
      expect(await daoGame.whoami()).to.equal(dao.address);
      await expect(daoGame.setOwner(dao.address)).to.be.revertedWith('_getImpersonator is not owner');
    });

  });

  describe("Game owner is dao", function () {
    let daoGame: Game; 
    let owner: SignerWithAddress;
    let dao: SignerWithAddress; 

    beforeEach(async function () {
      [owner, dao] = await ethers.getSigners();
      const GameFactory = await ethers.getContractFactory("Game");
      const game = await GameFactory.deploy() as Game;
      await game.deployed();
      await game.setOwner(dao.address);
      daoGame = game.connect(dao);
    });

    it("owner is dao", async function () {
      expect(await daoGame.owner()).to.equal(dao.address)
    });

    it("dao increments count from 0 to 1", async function () {

      const incrementTx = await daoGame.increment();

      // wait until the transaction is mined
      await incrementTx.wait();

      expect(await daoGame.count()).to.equal(1)
    });
  });

});
