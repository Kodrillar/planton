const Token = artifacts.require("Token");

module.exports = async function (deployer) {
 await deployer.deploy(Token, "Planton Game", "PG");
  let tokenInstance = await Token.deployed();
  await tokenInstance.mint(100, 200, 100000);
  await tokenInstance.mint(255, 200, 200000);
  let plant = await tokenInstance.getTokenDetails(0);
  console.log(plant);
};
