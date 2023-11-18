import { expect } from "chai";
import { ethers } from "hardhat";
// https://github.com/dethcrypto/TypeChain
import { HelloWorld } from "../typechain-types";
// https://hardhat.org/hardhat-network-helpers/docs/overview
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

// https://mochajs.org/#getting-started
describe("HelloWorld", function () {

  // https://hardhat.org/hardhat-network-helpers/docs/reference#fixtures
  async function deployContract() {
  
    // https://hardhat.org/plugins/nomiclabs-hardhat-ethers.html#helpers
    const accounts = await ethers.getSigners();
  
    // https://hardhat.org/plugins/nomiclabs-hardhat-ethers.html#helpers
    const helloWorldFactory = await ethers.getContractFactory("HelloWorld");
    // https://docs.ethers.org/v6/api/contract/#ContractFactory
    const helloWorldContract = await helloWorldFactory.deploy();
    // https://docs.ethers.org/v6/api/contract/#BaseContract-waitForDeployment
    await helloWorldContract.waitForDeployment();
  
    return {helloWorldContract, accounts};
  }

  it("Should give a Hello World", async function () {
    // https://hardhat.org/hardhat-network-helpers/docs/reference#fixtures
    const { helloWorldContract } = await loadFixture(deployContract);
  
    // https://docs.ethers.org/v6/api/contract/#BaseContractMethod
    const helloWorldText = await helloWorldContract.helloWorld();
    // https://www.chaijs.com/api/bdd/#method_equal
    expect(helloWorldText).to.equal("Hello World");
  });

  it("Should set owner to deployer account", async function () {
     // https://hardhat.org/hardhat-network-helpers/docs/reference#fixtures
     const { helloWorldContract, accounts } = await loadFixture(deployContract);
  
    // https://docs.ethers.org/v6/api/contract/#BaseContractMethod
    const contractOwner = await helloWorldContract.owner();
    // https://www.chaijs.com/api/bdd/#method_equal
    expect(contractOwner).to.equal(accounts[0].address);
  });

  it("Should not allow anyone other than owner to call transferOwnership", async function () {
    // https://hardhat.org/hardhat-network-helpers/docs/reference#fixtures
    const { helloWorldContract, accounts } = await loadFixture(deployContract);
  
    // https://docs.ethers.org/v6/api/contract/#BaseContract-connect
    // https://docs.ethers.org/v6/api/contract/#BaseContractMethod
    // https://hardhat.org/hardhat-chai-matchers/docs/overview#reverts
    await expect(
      helloWorldContract
        .connect(accounts[1])
        .transferOwnership(accounts[1].address)
    ).to.be.revertedWith("Caller is not the owner");
  });

  it("Should execute transferOwnership correctly", async function () {
    
    const { helloWorldContract, accounts } = await loadFixture(deployContract);

    const contractOwner = await helloWorldContract.owner();
    expect(contractOwner).to.equal(accounts[0].address);

    await helloWorldContract.connect(accounts[0]).transferOwnership(accounts[1].address);
    const newContractOwner = await helloWorldContract.owner();
    expect(newContractOwner).to.equal(accounts[1].address);
  });

  it("Should not allow anyone other than owner to change text", async function () {
    
    const { helloWorldContract, accounts } = await loadFixture(deployContract);

    const owner = accounts[0];
    const notOwner = accounts[1];

    await helloWorldContract.connect(owner).setText('New Text');
    const newText = await helloWorldContract.helloWorld();
    expect(newText).to.equal('New Text');

    await expect(helloWorldContract.connect(notOwner).setText('New New Text')).to.be.revertedWith("Caller is not the owner");
    const newTextNotOwner = await helloWorldContract.connect(notOwner).helloWorld();
    expect(newTextNotOwner).to.equal('New Text');
  });

  it("Should change text correctly", async function () {
    const { helloWorldContract, accounts } = await loadFixture(deployContract);

    const owner = accounts[0];

    await helloWorldContract.connect(owner).setText('New Text');
    const newText = await helloWorldContract.helloWorld();
    expect(newText).to.equal('New Text');
  });
});