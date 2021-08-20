import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Signer } from "ethers";
import { ethers } from "hardhat";
import { Impersonate } from '../typechain'

// Waffle Mocha testing framework w/ Chai expect
describe('Impersonate', function () {
        let impersonate: Impersonate; 
        let owner: SignerWithAddress;
        let dao: SignerWithAddress; 

    // will execute before each test
    beforeEach(async function () {
        const ImpersonateFactory = await ethers.getContractFactory("Impersonate");
        impersonate = await ImpersonateFactory.deploy() as Impersonate;
        await impersonate.deployed();
        [owner, dao] = await ethers.getSigners();
    });

    it('owner should be _getImpersonator', async function () {
        expect(await impersonate._getImpersonator()).to.equal(owner.address);
    })

    it('owner should be allowed to set _getImpersonator to dao', async function () {
        // TODO: What is this functionality? Why multiple awaits?
        let impersonateReceipt = await impersonate.impersonateMe(dao.address);
        await impersonateReceipt.wait();
        expect(await impersonate._getImpersonator()).to.equal(dao.address);
    })

    it('impersonateMe emits ImpersonationOccurred event', async function () {
        await expect(impersonate.impersonateMe(dao.address))
        .to.emit(impersonate, 'ImpersonationOccurred').
        withArgs(owner.address, dao.address); 
    })
  
    it("owner cannot impersonate self", async function () {
        await expect(impersonate.connect(owner).impersonateMe(owner.address)).to.be.revertedWith('cannot impersonate self');
    });

});
