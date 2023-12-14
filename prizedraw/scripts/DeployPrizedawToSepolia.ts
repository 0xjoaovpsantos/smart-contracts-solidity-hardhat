import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { ContractPrizedaw__factory } from "../typechain-types";
dotenv.config();

async function main() {
  let tx;
  let receipt;

  const CONSTANT_ADDRESS_ADMIN1 = process.env.ADDRESS_ADMIN1 || "";
  const CONSTANT_ADDRESS_ADMIN2 = process.env.ADDRESS_ADMIN2 || "";
  const CONSTANT_ADDRESS_ADMIN3 = process.env.ADDRESS_ADMIN3 || "";

  console.log("Deploying Contract Prizedaw\n");

  const provider = new ethers.JsonRpcProvider(
    process.env.RPC_ENDPOINT_URL ?? ""
  );
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);

  console.log(`Owner of contract: ${wallet.address}`);

  const balanceBN = await provider.getBalance(wallet.address);
  const balance = Number(ethers.formatUnits(balanceBN));

  console.log(`Owner balance: ${balance} ETH\n`);

  if (balance < 0.01) {
    throw new Error("Not enough ether");
  }

  const contractPrizeFactory = new ContractPrizedaw__factory(wallet);
  const contractPrizedaw = await contractPrizeFactory.deploy();
  await contractPrizedaw.waitForDeployment();

  console.log(`Contract deployed: ${contractPrizedaw.target}\n`);

  tx = await contractPrizedaw.addAdmin(CONSTANT_ADDRESS_ADMIN1);
  receipt = await tx.wait();
  console.log(
    `Function 'addAdmin(${CONSTANT_ADDRESS_ADMIN1})' from ${wallet.address} hash: ${receipt?.hash}`
  );
  console.log(
    `Function 'addAdmin(${CONSTANT_ADDRESS_ADMIN1})' from ${wallet.address} status: ${receipt?.status}\n`
  );

  tx = await contractPrizedaw.addAdmin(CONSTANT_ADDRESS_ADMIN2);
  receipt = await tx.wait();
  console.log(
    `Function 'addAdmin(${CONSTANT_ADDRESS_ADMIN2})' from ${wallet.address} hash: ${receipt?.hash}`
  );
  console.log(
    `Function 'addAdmin(${CONSTANT_ADDRESS_ADMIN2})' from ${wallet.address} status: ${receipt?.status}\n`
  );

  tx = await contractPrizedaw.addAdmin(CONSTANT_ADDRESS_ADMIN3);
  receipt = await tx.wait();
  console.log(
    `Function 'addAdmin(${CONSTANT_ADDRESS_ADMIN3})' from ${wallet.address} hash: ${receipt?.hash}`
  );
  console.log(
    `Function 'addAdmin(${CONSTANT_ADDRESS_ADMIN3})' from ${wallet.address} status: ${receipt?.status}\n`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
