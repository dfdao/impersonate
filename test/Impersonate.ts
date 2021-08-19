import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Signer } from "ethers";
import { ethers } from "hardhat";
import { Impersonate } from '../typechain'

// Mocha testing framework w/ Chai expect
describe('Impersonate', function () {
    // different describe block for each state.
        let impersonate: Impersonate; 
        let owner: SignerWithAddress;

    // will execute before each test
    beforeEach(async function () {
        const ImpersonateFactory = await ethers.getContractFactory("Impersonate");
        impersonate = await ImpersonateFactory.deploy() as Impersonate;
        await impersonate.deployed();
        [owner] = await ethers.getSigners();
    });

    it('owner should be _getImpersonator', async function () {
        expect(await impersonate._getImpersonator()).to.equal(owner.address);
    })

});
