// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

// Returns the Ether balance of a given address.
async function getBalance(address) {
  const balanceBigInt = await hre.waffle.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

// Logs the Ether balances for a list of addresses.
async function printBalances(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${idx} balance: `, await getBalance(address));
    idx++;
  }
}
//event create detail function
async function printEvent(event) {


}

async function main() {

  //get the account we work with it
  const [owner, creator1, creator2, creator3, buyer, buyer1, buyer2] = await hre.ethers.getSigners();
  //get the contract deployed
  const EventContract = await hre.ethers.getContractFactory("EventContract");
  const eventContract = await EventContract.deploy();
  console.log("Eventcontract deployed at:", eventContract.address);

  //check balance of address
  const addresses = [owner.address, creator1.address, creator2.address, creator3.address];
  console.log("==start==");
  await printBalances(addresses);

  //create event
  const time = 1658762149;
  await eventContract.connect(creator1).createEvent("blockchain summit", time, 1, 100);
  await eventContract.connect(creator2).createEvent("IOT Summit", time, 2, 50);
  await eventContract.connect(creator3).createEvent("cyber security summit", time, 5, 10);

  //check balance after create event
  console.log("==after create event==");
  await printBalances(addresses);

  //check the event create or not 
  console.log("==event details==");
  const event = await eventContract.events(0);
  const event1 = await eventContract.events(1);
  const event2 = await eventContract.events(2);
  console.log("event created", event);
  console.log("event created", event1);
  console.log("event created", event2);

  //Buying a ticket from Blockchain sumit
  console.log("==buying tickets blockchain summit==");
  const value = { value: 50 };
  await eventContract.connect(buyer).buyTicket(0, 50, value);
  const buyerDetail = await eventContract.tickets(buyer.address, 0);
  console.log("ticket buyer", buyerDetail);
  console.log("event detail  of buyer ", await eventContract.events(0));
  
  //Buying a ticket from IOT Summit
  console.log("==buying tickets IOT Summit==");
  const value1 = { value: 20 };
  await eventContract.connect(buyer1).buyTicket(1, 10, value1);
  const buyer1Detail = await eventContract.tickets(buyer1.address, 1);
  console.log("ticket buyer", buyer1Detail);
  console.log("event detail of buyer 1", await eventContract.events(1));


  //transfering  tickets from buyer1 to buyer2
  console.log("==Transfering ticket==");
  await eventContract.connect(buyer1).transferTicket(1, 5, buyer2.address);
  const buyer2Detail = await eventContract.tickets(buyer2.address, 1);
  console.log("ticket buyer", buyer2Detail);




}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
