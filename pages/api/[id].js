import {INFURA_ADDRESS, ADDRESS, ABI} from "../../config.js"
import Web3 from "web3";

// import the json containing all metadata. not recommended, try to fetch the database from a middleware if possible, I use MONGODB for example
import traits from "../../database/finaltraitsnotf.json";

const infuraAddress = INFURA_ADDRESS 

const  rgbApi = async(req, res) => {

    // SOME WEB3 STUFF TO CONNECT TO SMART CONTRACT
  const provider = new Web3.providers.HttpProvider(infuraAddress)
  const web3infura = new Web3(provider);
  const rgbpunkContract = new web3infura.eth.Contract(ABI, ADDRESS)
  


  // IF YOU ARE USING INSTA REVEAL MODEL, USE THIS TO GET HOW MANY NFTS ARE MINTED
  const totalSupply = await rgbpunkContract.methods.totalSupply().call();
  console.log(totalSupply)
  


// THE ID YOU ASKED IN THE URL
  const query = req.query.id;


  // IF YOU ARE USING INSTA REVEAL MODEL, UNCOMMENT THIS AND COMMENT THE TWO LINES BELOW
  if(parseInt(query) < totalSupply) {
  
    let tokenName= `deleted`

    const trait = traits[parseInt(query)]
    // const trait = traits[ Math.floor(Math.random() * 8888) ] // for testing on rinkeby 

    // CHECK OPENSEA METADATA STANDARD DOCUMENTATION https://docs.opensea.io/docs/metadata-standards
    let metadata = {}
    
      metadata = {
        "name": tokenName,
        "tokenId" : parseInt(query),
        "image": `https://ipfs.io/ipfs/${trait["imageIPFS"]}`,
        "external_url":"",
        
      }
      
      // console.log(metadata)

    
    
    res.statusCode = 200
    res.json(metadata)
  } else {
    res.statuscode = 404
    res.json({error: "These NFT have not been minted."})

  }


  

  
}

export default rgbApi