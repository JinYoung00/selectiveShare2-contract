import fs from 'fs';
import * as dotenv from "dotenv";
dotenv.config();

const teamAddress = process.env.TEAM_ADDRESS;
const investorAddress = process.env.INVESTOR_ADDRESS;
const operatorAddress = process.env.OPERATOR_ADDRESS;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const PDTToken = await ethers.getContractFactory("PersonalDataToken"); 
  const contract = await PDTToken.deploy(
    teamAddress,
    investorAddress,
    operatorAddress
  );
  await contract.waitForDeployment();
  const deployedAddress = await contract.getAddress();
  fs.writeFileSync('deployment.json', JSON.stringify({ address: deployedAddress }, null, 2));

  console.log("Contract deployed at:", contract.target || contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});




