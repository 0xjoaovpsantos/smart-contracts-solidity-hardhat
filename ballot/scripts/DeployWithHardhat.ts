import { ethers } from "hardhat";

async function main() {
    const proposals = process.argv.slice(2);

    if(!proposals || proposals.length < 1) 
      throw new Error('Proposals not provided');

    console.log('Deploying Ballot contract');
    console.log('Proposals: ');

    proposals.forEach((element, index) => {
        console.log(`Proposal N. ${index + 1}: ${element}`);
    });

    const signers = await ethers.getSigners();
    const provider = signers[0].provider;
    const ballotFactory = await ethers.getContractFactory('Ballot');
    const proposalsBytes32 = proposals.map(ethers.encodeBytes32String);
    
    const ballotContract = await ballotFactory.deploy(proposalsBytes32);
    await ballotContract.waitForDeployment();
    
    const lastBlock = await provider.getBlock('latest');
    const lastBlockNumber = lastBlock?.number;
    console.log(`Last block number was ${lastBlockNumber}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})