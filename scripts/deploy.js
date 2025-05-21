import * as dotenv from "dotenv";
dotenv.config();

const teamAddress = process.env.TEAM_ADDRESS;
const investorAddress = process.env.INVESTOR_ADDRESS;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const SS2Token = await ethers.getContractFactory("SS2Token");
  const contract = await SS2Token.deploy(
    teamAddress,
    investorAddress
  );
  await contract.waitForDeployment();

  // 주소 출력 (버전에 따라 target 또는 address 사용)
  console.log("Contract deployed at:", contract.target || contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});


