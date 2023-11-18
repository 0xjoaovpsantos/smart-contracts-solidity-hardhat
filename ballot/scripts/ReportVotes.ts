import { ethers } from "hardhat";
import { Ballot } from "../typechain-types";

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
    console.log(`Last block number was ${lastBlockNumber}\n`);

    let tx;
    let receipt;

    tx = await ballotContract.chairperson();
    console.log(`Get chairperson: ${tx}\n`)

    tx = await ballotContract.giveRightToVote(signers[1].address);
    receipt = await tx.wait();
    console.log(`Function 'giveRightToVote(${signers[1].address})' from ${signers[0].address} hash: ${receipt?.hash}`);
    console.log(`Function 'giveRightToVote(${signers[1].address})' from ${signers[0].address} status: ${receipt?.status}\n`);

    tx = await ballotContract.giveRightToVote(signers[2].address);
    receipt = await tx.wait();
    console.log(`Function 'giveRightToVote(${signers[2].address})' from ${signers[0].address} hash: ${receipt?.hash}`);
    console.log(`Function 'giveRightToVote(${signers[2].address})' from ${signers[0].address} status: ${receipt?.status}\n`);

    tx = await ballotContract.giveRightToVote(signers[3].address);
    receipt = await tx.wait();
    console.log(`Function 'giveRightToVote(${signers[3].address})' from ${signers[0].address} hash: ${receipt?.hash}`);
    console.log(`Function 'giveRightToVote(${signers[3].address})' from ${signers[0].address} status: ${receipt?.status}\n`);

    tx = await ballotContract.giveRightToVote(signers[4].address);
    receipt = await tx.wait();
    console.log(`Function 'giveRightToVote(${signers[4].address})' from ${signers[0].address} hash: ${receipt?.hash}`);
    console.log(`Function 'giveRightToVote(${signers[4].address})' from ${signers[0].address} status: ${receipt?.status}\n`);

    tx = await ballotContract.vote(0);
    receipt = await tx.wait();
    console.log(`Function 'vote(0)' from ${signers[0].address} hash: ${receipt?.hash}`);
    console.log(`Function 'vote(0)' from ${signers[0].address} status: ${receipt?.status}\n`);

    tx = await (await ballotContract.connect(signers[1]) as Ballot).vote(1);
    receipt = await tx.wait();
    console.log(`Function 'vote(1)' from ${signers[1].address} hash: ${receipt?.hash}`);
    console.log(`Function 'vote(1)' from ${signers[1].address} status: ${receipt?.status}\n`);

    tx = await (await ballotContract.connect(signers[2]) as Ballot).vote(0);
    receipt = await tx.wait();
    console.log(`Function 'vote(0)' from ${signers[2].address} hash: ${receipt?.hash}`);
    console.log(`Function 'vote(0)' from ${signers[2].address} status: ${receipt?.status}\n`);

    tx = await (await ballotContract.connect(signers[3]) as Ballot).delegate(signers[4].address);
    receipt = await tx.wait();
    console.log(`Function 'delegate(${signers[4].address})' from ${signers[3].address} hash: ${receipt?.hash}`);
    console.log(`Function 'delegate(${signers[4].address})' from ${signers[3].address} status: ${receipt?.status}\n`);

    tx = await ballotContract.winningProposal();
    console.log(`Get winningProposal: ${tx}\n`)

    tx = await ballotContract.winnerName();
    console.log(`Get winnerName: ${tx}\n`)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})