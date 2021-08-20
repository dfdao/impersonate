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

    it('dao should now be _getImpersonator', async function () {
        impersonate.impersonateMe(dao.address);
        expect(await impersonate._getImpersonator()).to.equal(dao.address);
    })

});
