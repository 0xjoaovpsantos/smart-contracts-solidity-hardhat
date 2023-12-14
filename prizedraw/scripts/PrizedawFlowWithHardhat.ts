import { ethers } from "hardhat";
import { ContractPrizedaw } from "../typechain-types";

const logCurrentPrize = (tx: any) => {
  console.log(`getCurrentPrizedaw"`);
  console.log(`id: ${tx[0]}`);
  console.log(`amountPoolA: ${tx[1]}`);
  console.log(`amountPoolB: ${tx[2]}`);
  console.log(`usersPoolA: ${tx[3]}`);
  console.log(`usersPoolB: ${tx[4]}`);
  console.log(`isFinished: ${tx[5]}`);
  console.log(`currentRewardsPerUserPoolA: ${tx[6]}`);
  console.log(`currentRewardsPerUserPoolB: ${tx[7]}\n`);
};

async function main() {
  console.log("Deploying contractPrizedaw");

  const signers = await ethers.getSigners();
  const provider = signers[0].provider;
  const provider2 = signers[2].provider;
  const provider3 = signers[3].provider;
  const contractPrizedawFactory = await ethers.getContractFactory(
    "ContractPrizedaw"
  );

  const contractPrizedaw = await contractPrizedawFactory.deploy();
  await contractPrizedaw.waitForDeployment();

  const lastBlock = await provider.getBlock("latest");
  const lastBlockNumber = lastBlock?.number;
  console.log(`Last block number was ${lastBlockNumber}\n`);

  let tx;
  let receipt;
  let idPrizedaw = 1;
  let idPoolA = 1;
  let idPoolB = 2;
  let valueBuyTicket = "1.0";
  let userBalance;
  let contractBalance;

  contractBalance = await contractPrizedaw.getContractBalance();
  console.log(`contractBalance: ${contractBalance}\n `);

  tx = await contractPrizedaw.addAdmin(signers[2].address);
  receipt = await tx.wait();
  console.log(
    `Function 'addAdmin(${signers[2].address})' from ${signers[0].address} hash: ${receipt?.hash}`
  );
  console.log(
    `Function 'addAdmin(${signers[2].address})' from ${signers[0].address} status: ${receipt?.status}\n`
  );

  tx = await (
    (await contractPrizedaw.connect(signers[2])) as ContractPrizedaw
  ).checkForAdmin(signers[2].address);
  console.log(`${signers[2].address} is admin: ${tx}\n`);

  tx = await (
    (await contractPrizedaw.connect(signers[3])) as ContractPrizedaw
  ).checkForAdmin(signers[3].address);
  console.log(`${signers[3].address} is admin: ${tx}\n`);

  tx = await contractPrizedaw.createPrizedaw(idPrizedaw);
  receipt = await tx.wait();
  console.log(
    `Function 'createPrizedaw(${idPrizedaw})' from ${signers[0].address} hash: ${receipt?.hash}`
  );
  console.log(
    `Function 'createPrizedaw(${idPrizedaw})' from ${signers[0].address} status: ${receipt?.status}\n`
  );

  tx = await contractPrizedaw.getCurrentPrizedaw();
  logCurrentPrize(tx);

  tx = await contractPrizedaw.buyTicket(idPoolA, {
    value: ethers.parseEther(valueBuyTicket),
  });
  receipt = await tx.wait();
  console.log(
    `Function 'buyTicket(${idPoolA})' with value ${valueBuyTicket} from ${signers[0].address} hash: ${receipt?.hash}`
  );
  console.log(
    `Function 'buyTicket(${idPoolA})' with value ${valueBuyTicket} from ${signers[0].address} status: ${receipt?.status}\n`
  );

  contractBalance = await contractPrizedaw.getContractBalance();
  console.log(`contractBalance: ${contractBalance}\n `);

  tx = await contractPrizedaw.getCurrentPrizedaw();
  logCurrentPrize(tx);

  tx = await (
    (await contractPrizedaw.connect(signers[3])) as ContractPrizedaw
  ).buyTicket(idPoolB, {
    value: ethers.parseEther(valueBuyTicket),
  });
  receipt = await tx.wait();
  console.log(
    `Function 'buyTicket(${idPoolB})' with value ${valueBuyTicket} from ${signers[3].address} hash: ${receipt?.hash}`
  );
  console.log(
    `Function 'buyTicket(${idPoolB})' with value ${valueBuyTicket} from ${signers[3].address} status: ${receipt?.status}\n`
  );

  contractBalance = await contractPrizedaw.getContractBalance();
  console.log(`contractBalance: ${contractBalance}\n `);

  tx = await contractPrizedaw.getCurrentPrizedaw();
  logCurrentPrize(tx);

  userBalance = await provider2.getBalance(signers[2].address);
  console.log(`Amount ${signers[2].address}: ${userBalance}\n `);

  tx = await (
    (await contractPrizedaw.connect(signers[2])) as ContractPrizedaw
  ).buyTicket(idPoolB, {
    value: ethers.parseEther(valueBuyTicket),
  });
  receipt = await tx.wait();
  console.log(
    `Function 'buyTicket(${idPoolB})' with value ${valueBuyTicket} from ${signers[2].address} hash: ${receipt?.hash}`
  );
  console.log(
    `Function 'buyTicket(${idPoolB})' with value ${valueBuyTicket} from ${signers[2].address} status: ${receipt?.status}\n`
  );

  contractBalance = await contractPrizedaw.getContractBalance();
  console.log(`contractBalance: ${contractBalance}\n `);

  tx = await contractPrizedaw.getCurrentPrizedaw();
  logCurrentPrize(tx);

  tx = await contractPrizedaw.finishCurrentPrizedaw();
  receipt = await tx.wait();
  console.log(
    `Function 'finishCurrentPrizedaw()' from ${signers[0].address} hash: ${receipt?.hash}`
  );
  console.log(
    `Function 'finishCurrentPrizedaw()' from ${signers[0].address} status: ${receipt?.status}\n`
  );

  tx = await contractPrizedaw.getCurrentPrizedaw();
  logCurrentPrize(tx);

  tx = await contractPrizedaw.getRewardsAvailable();
  console.log(
    `Function 'getRewardsAvailable()' from ${signers[0].address} hash: ${receipt?.hash}`
  );
  console.log(`${tx}\n`);

  tx = await (
    (await contractPrizedaw.connect(signers[2])) as ContractPrizedaw
  ).getRewardsAvailable();
  console.log(
    `Function 'getRewardsAvailable()' from ${signers[2].address} hash: ${receipt?.hash}`
  );
  console.log(`${tx}\n`);

  tx = await (
    (await contractPrizedaw.connect(signers[3])) as ContractPrizedaw
  ).getRewardsAvailable();
  console.log(
    `Function 'getRewardsAvailable()' from ${signers[3].address} hash: ${receipt?.hash}`
  );
  console.log(`${tx}\n`);

  userBalance = await provider2.getBalance(signers[2].address);
  console.log(`Amount ${signers[2].address}: ${userBalance}\n `);

  tx = await (
    (await contractPrizedaw.connect(signers[2])) as ContractPrizedaw
  ).withdraw();
  receipt = await tx.wait();
  console.log(
    `Function 'withdraw()' from ${signers[2].address} hash: ${receipt?.hash}`
  );
  console.log(
    `Function 'withdraw()' from ${signers[2].address} status: ${receipt?.status}\n`
  );

  userBalance = await provider2.getBalance(signers[2].address);
  console.log(`Amount ${signers[2].address}: ${userBalance}\n `);

  tx = await contractPrizedaw.getCurrentPrizedaw();
  logCurrentPrize(tx);

  contractBalance = await contractPrizedaw.getContractBalance();
  console.log(`contractBalance: ${contractBalance}\n `);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
