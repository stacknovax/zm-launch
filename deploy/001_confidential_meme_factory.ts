import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const deployedFactory = await deploy("ConfidentialMemeFactory", {
    from: deployer,
    log: true,
  });

  console.log(`ConfidentialMemeFactory contract: `, deployedFactory.address);
};

export default func;
func.id = "deploy_confidential_meme_factory";
func.tags = ["ConfidentialMemeFactory"];
