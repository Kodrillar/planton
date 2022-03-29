const web3 = new Web3(window.ethereum);
const serverUrl = "https://4icglbnazhgm.usemoralis.com:2053/server" ;
const appId = "Nhd2twndsU0rZF6sth55ZFsdX24FwQJXFSBqZP8o";
Moralis.start({ serverUrl, appId });

//this is my local contract address, add yours
const CONTRACT_ADDRESS = "0x1d2bf0626339E86c0f9F139926aEFEF9dE0C93E7"

// "0x4E7487D3E04543B7b4c87BB1897138a9D378a391";

let user = Moralis.User.current();
console.log(user);

async function login() {
 $("#logout_button").hide();
    try {
        if (!user) {
            $("#login_button").click( async()=>{
                user = await Moralis.authenticate({ signingMessage: "Welcome to Planton Game!" })
                .then(() => renderPlantonGame(),
                )
                .catch(e => alert( e.message+"! Kindly install Metamask or preferred Ethereum wallet."),
                );
                
               
            });
              console.log("this is user " + user);
              console.log(user.get('ethAddress'));  
              
        }  
          renderPlantonGame();
        
          
        
    } catch(error) {
        console.log(error)
    } 
}

async function renderPlantonGame(){
    // $("#login_button").hide();
     $("#plant_row").html("");

    let plantId = 0;
    window.web3 = await Moralis.enableWeb3();
    let abi = await getAbi();
    let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
                                                            // Should be ethereum.selectedAddress
    let listOfTokens = await contract.methods.getAllTokensForUser("0xf43994861B443C6ed59B227433f1B76c4DC3FB62").call({from:ethereum.selectedAddress});
    if(listOfTokens.length == 0) return;
    console.log(listOfTokens);
    listOfTokens.forEach(async plantId => {
        let tokenDetails = await contract.methods.getTokenDetails(plantId).call({from:ethereum.selectedAddress});
        console.log(tokenDetails);
    renderPlant(plantId, tokenDetails)

    });    
    $("#game").show();
    $("#logout_button").show();
    $("#logout_button").click(logOut);
};
let nft = 100;
function renderPlant(id, data){
      

    let time_To_Water_Plant = new Date((parseInt(data.endurance) + parseInt(data.lastWatered))* 1000);
    if(new Date() > time_To_Water_Plant){
        time_To_Water_Plant = "<b>PLANT IS DEAD<b>"
    }

    let htmlString = `
    <div class="col-md-4 card" id="plant_${id}">
            <img
            class="card-img-top plant_image"
            src="./images/plant${id}.png"
            alt="a plant NFT"
            id=""
        />
        <div class="card-body">
            <!-- <div>Id: <span class="plant_id">${id}</span></div> --->
            <div><b>RARITY</b>: <span class="plant_id">Rank ${nft}${id}</span></div>
            <div>Health: <span class="plant_health">${data.health}</span></div>
            <div>Feature: <span class="plant_feature">${data.feature}</span></div>
            <div>Edurance: <span class="plant_endurance">${data.endurance}</span></div>
            <div>
            Time to water plant(before): <span class="plant_watering">${time_To_Water_Plant}</span>
            </div>
        </div>
        <button plant-id="${id}" class="waterPlant_button btn btn-primary btn-block">
            Water Plant
        </button>
        </div>
    </div>
`;
    let htmlElement = $.parseHTML(htmlString);
    $("#plant_row").append(htmlElement);
   
    $(`#plant_${id} .waterPlant_button`).click(()=>{
        
        waterPlant(id);
       
        
       
    })
}

    function getAbi(){
        return new Promise((res)=>{
            $.getJSON("../build/contracts/Token.json",((json)=>{
                res(json.abi);
            }))
        })
    }

    async function waterPlant(plantId){
        let abi = await getAbi();
        let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
        contract.methods.water(plantId).send({from:ethereum.selectedAddress}).on("receipt", (()=>{
            //  web3.eth.sendTransaction({from: accounts[1], to:"0xe91cC99B2b36c9C1DE8802ECa980C58aF37150eF", value: web3.utils.toWei("1","ether")})
            console.log("done");
            nft=nft-5;
            renderPlantonGame()
            

        }))
    }

   

login();

async function logOut() {
  await Moralis.User.logOut();
  $("#game").hide();
  $("#logout_button").hide();
  $("#login_button").show();
  location.reload()
  $("#login_button").click(async()=>{
    user = await Moralis.authenticate({ signingMessage: "Welcome to Planton Game!" });
    location.reload()
    // $("#game").show();
    // $("#login_button").hide();
    // $("#logout_button").show();
    // $("#logout_button").click(logOut);
    
})
  console.log("logged out");
  
}



// document.getElementById("login_button").onclick = login;
// document.getElementById("logout_button").onclick = logOut;