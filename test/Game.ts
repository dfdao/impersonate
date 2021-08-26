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
      //daoGame --> dao is connected to game contract.
      daoGame = game.connect(dao); 
    });

    it("owner is impersonator", async function () {
      expect(await game.impersonator()).to.equal(owner.address)
    });

    it("owner increments count from 0 to 1", async function () {
      expect(await game.count(owner.address)).to.equal(0)

      const incrementTx = await game.increment();

      // wait until the transaction is mined
      await incrementTx.wait();

      expect(await game.count(owner.address)).to.equal(1)
    });

    it("when owner is msg.sender, dao is not game impersonator", async function () {
      expect(await game.impersonator()).to.not.equal(dao.address)
    });

    it("when dao is msg.sender, dao is game impersonator", async function () {
      expect(await daoGame.impersonator()).to.equal(dao.address)
    });

    it("dao is daoGame msg.sender", async function () {
      expect(await daoGame.whoami()).to.equal(dao.address)
    });
    
    it("dao can allow owner to impersonate", async function () {
      await daoGame.impersonateMe(owner.address);
      expect(await game.impersonator()).to.equal(dao.address);
    });

    it("dao can set owner as impersonator, then randomPlayer", async function () {
      await daoGame.impersonateMe(owner.address);
      expect(await game.impersonator()).to.equal(dao.address);

      await daoGame.impersonateMe(randomPlayer.address);
      expect(await game.impersonator()).to.equal(dao.address);
    });

    it('impersonateMe emits Impersonation event', async function () {
        await expect(daoGame.impersonateMe(owner.address))
        .to.emit(daoGame, 'Impersonation').
        withArgs(dao.address, owner.address); 
    })
 
  });

  describe("Dao is impersonating", function () {
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
      await daoGame.impersonateMe(owner.address);

    });

    it("dao is game impersonator", async function () {
      expect(await game.whoami()).to.equal(owner.address)
      expect(await game.impersonator()).to.equal(dao.address)
    });

    it("dao is daoGame impersonator", async function () {
      expect(await daoGame.whoami()).to.equal(dao.address)
      expect(await daoGame.impersonator()).to.equal(dao.address)
    });

    it("when owner is msg.sender, can increment dao score", async function () {
      expect(await game.count(dao.address)).to.equal(0)
      const incrementTx = await game.increment();
      await incrementTx.wait();
      expect(await game.count(dao.address)).to.equal(1)
    });

    it("when dao is msg.sender dao can increment dao score", async function () {
      expect(await daoGame.count(dao.address)).to.equal(0)
      const incrementTx = await daoGame.increment();
      await incrementTx.wait();
      expect(await daoGame.count(dao.address)).to.equal(1)
    });

    it("owner cannot remove impersonation", async function () {
      await expect(game.removeImpersonator(owner.address))
        .to.be.revertedWith('only current impersonator can remove themselves')
    });
  
    it("when dao is msg.sender dao can remove impersonation", async function () {
      await daoGame.removeImpersonator(owner.address)
      expect(await game.impersonator()).to.equal(owner.address)
    });
  });

});
