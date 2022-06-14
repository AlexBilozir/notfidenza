import Head from 'next/head'
import Web3 from "web3";
import { useState, useEffect } from 'react';

import { ADDRESS, ABI } from "../config.js"

export default function Home() {

  // FOR WALLET
  const [signedIn, setSignedIn] = useState(false)

  const [walletAddress, setWalletAddress] = useState(null)

  // FOR MINTING
  const [how_many_rgbpunks, set_how_many_rgbpunks] = useState(1)

  const [rgbpunksContract, setrgbpunksContract] = useState(null)

  // INFO FROM SMART Contract

  const [totalSupply, setTotalSupply] = useState(0)

  const [saleIsActive, setsaleIsActive] = useState(false)

  const [tokenPrice, settokenPrice] = useState(0)

  const [freeTokenPrice, setFreeTokenPrice] = useState(0)

  useEffect(async () => {

    //signIn()

  }, [])

  async function signIn() {
    if (typeof window.web3 !== 'undefined') {
      // Use existing gateway
      window.web3 = new Web3(window.ethereum);

    } else {
      alert("No Ethereum interface injected into browser. Read-only access");
    }

    window.ethereum.enable()
      .then(function (accounts) {
        window.web3.eth.net.getNetworkType()
          // checks if connected network is main(change this to rinkeby if you wanna test on testnet)
          .then((network) => { console.log(network); if (network != "rinkeby") { alert("You are on " + network + " network. Change network to mainnet or you won't be able to do anything here") } });
        let wallet = accounts[0]
        setWalletAddress(wallet)
        setSignedIn(true)
        callContractData(wallet)

      })
      .catch(function (error) {
        // Handle error. Likely the user rejected the login
        console.error(error)
      })
  }

  //

  async function signOut() {
    setSignedIn(false)
  }

  async function callContractData(wallet) {
    // let balance = await web3.eth.getBalance(wallet);
    // setWalletBalance(balance)
    const rgbpunksContract = new window.web3.eth.Contract(ABI, ADDRESS)
    setrgbpunksContract(rgbpunksContract)

    const salebool = await rgbpunksContract.methods.saleIsActive().call()
    // console.log("saleIsActive" , salebool)
    setsaleIsActive(salebool)

    const totalSupply = await rgbpunksContract.methods.totalSupply().call()
    setTotalSupply(totalSupply)

    const tokenPrice = await rgbpunksContract.methods.tokenPrice().call()
    settokenPrice(tokenPrice)

    const freeTokenPrice = await rgbpunksContract.methods.freeTokenPrice().call()
    setFreeTokenPrice(tokenPrice)

  }

  async function freeMintPunks(how_many_rgbpunks) {
    if (rgbpunksContract) {

      const price = Number(freeTokenPrice) * how_many_rgbpunks

      const gasAmount = await rgbpunksContract.methods.freeMint(how_many_rgbpunks).estimateGas({ from: walletAddress, value: price })
      console.log("estimated gas", gasAmount)

      console.log({ from: walletAddress, value: price })

      rgbpunksContract.methods
        .freeMint(how_many_rgbpunks)
        .send({ from: walletAddress, value: price, gas: String(gasAmount) })
        .on('transactionHash', function (hash) {
          console.log("transactionHash", hash)
        })

    } else {
      console.log("Wallet not connected")
    }

  }

  async function mintPunks(how_many_rgbpunks) {
    if (rgbpunksContract) {

      const price = Number(tokenPrice) * how_many_rgbpunks

      const gasAmount = await rgbpunksContract.methods.mintTokens(how_many_rgbpunks).estimateGas({ from: walletAddress, value: price })
      console.log("estimated gas", gasAmount)

      console.log({ from: walletAddress, value: price })

      rgbpunksContract.methods
        .mintTokens(how_many_rgbpunks)
        .send({ from: walletAddress, value: price, gas: String(gasAmount) })
        .on('transactionHash', function (hash) {
          console.log("transactionHash", hash)
        })

    } else {
      console.log("Wallet not connected")
    }

  };



  return (

    <html>
      <head>
        <title>Not Fidenza</title>

        
      </head>
      <body id="bodyy" className="">

        

        
 {/* block 3         */}
        <div id="block2" className='w-full'>
          <div className='flex flex-col items-center justify-center  w-auto'>
 
            <span className="flex Kanit-Black text-4xl text-black">MINT THROUGH CONTRACT</span>
           
         
          
        </div>
        </div>
      </body>
    </html>
  )
}