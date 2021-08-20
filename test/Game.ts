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
    let randomPlayer: SignerWithAddress;

    beforeEach(async function () {
      [owner, dao, randomPlayer] = await ethers.getSigners();
      const GameFactory = await ethers.getContractFactory("Game");
      game = await GameFactory.deploy() as Game;
      await game.deployed();
      //daoGame is a new instance of game where dao is msg.sender
      daoGame = game.connect(dao); 
    });

    it("owner is impersonator", async function () {
      expect(await game.impersonator()).to.equal(owner.address)
    });

    it("owner increments count from 0 to 1", async function () {
      expect(await game.count()).to.equal(0)

      const incrementTx = await game.increment();

      // wait until the transaction is mined
      await incrementTx.wait();

      expect(await game.count()).to.equal(1)
    });

    it("when owner is msg.sender, dao is not game impersonator", async function () {
      expect(await game.impersonator()).to.not.equal(dao.address)
    });

    it("when dao is msg.sender, dao is not game impersonator", async function () {
      expect(await daoGame.impersonator()).to.not.equal(dao.address)
    });

    it("dao is daoGame msg.sender", async function () {
      expect(await daoGame.whoami()).to.equal(dao.address)
    });

    it("dao cannot impersonate randomPlayer b/c not curr impersonator", async function () {
      await expect(daoGame.impersonateMe(randomPlayer.address)).to.be.revertedWith('only impersonator can update impersonator');
    });

    it("dao cannot increment b/c not curr impersonator", async function () {
      await expect(daoGame.increment()).to.be.revertedWith('only impersonator can update count');
    });

    it("owner can allow dao to impersonate", async function () {
      await game.impersonateMe(dao.address);
      expect(await game.impersonator()).to.equal(dao.address);
    });

    it("owner can impersonate dao, then randomPlayer", async function () {
      await game.impersonateMe(dao.address);
      expect(await game.impersonator()).to.equal(dao.address);

      await game.impersonateMe(randomPlayer.address);
      expect(await game.impersonator()).to.equal(randomPlayer.address);
      expect(await game.impersonator()).to.not.equal(dao.address);
    });

    it('impersonateMe emits ImpersonationOccurred event', async function () {
        await expect(game.impersonateMe(dao.address))
        .to.emit(game, 'ImpersonationOccurred').
        withArgs(owner.address, dao.address); 
    })
 
  });

  describe("Game owner is dao", function () {
    let game: Game;
    let daoGame: Game; 
    let owner: SignerWithAddress;
    let dao: SignerWithAddress; 

    beforeEach(async function () {
      [owner, dao] = await ethers.getSigners();
      const GameFactory = await ethers.getContractFactory("Game");
      game = await GameFactory.deploy() as Game;
      await game.deployed();
      await game.impersonateMe(dao.address);
      daoGame = game.connect(dao);
    });

    it("when owner is msg.sender dao is impersonator", async function () {
      expect(await game.whoami()).to.equal(owner.address)
      expect(await game.impersonator()).to.equal(dao.address)
    });

    it("when owner is msg.sender dao can increment", async function () {
      expect(await game.count()).to.equal(0)
      const incrementTx = await game.increment();
      await incrementTx.wait();
      expect(await game.count()).to.equal(1)
    });

    it("when dao is msg.sender dao can increment", async function () {
      expect(await daoGame.count()).to.equal(0)
      const incrementTx = await daoGame.increment();
      await incrementTx.wait();
      expect(await daoGame.count()).to.equal(1)
    });
  });

});
