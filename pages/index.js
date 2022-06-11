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

    signIn()

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
      <body id="bodyy" className="flex flex-col flex-wrap items-center  min-h-screen ">

        

        <div className="w-full" id="about">
 {/* block 1 */}
          <div className="flex flex-row flex-wrap justify-center" id="block1" >
            <div className="flex flex-col lg:w-1/3 items-center  py-10 space-y-7  ">
            <img src="images/img1.gif"width="350" class="   drop-shadow-2xl "/>
            </div>


  {/* block 2 */}
            <div className="flex w-full lg:w-1/3 py-10 items-top">
              <div className="AmikoRegular space-y-4">
              <ul class="list-disc text-2xl text-black p-2   AmikoRegular">
                <li>4269 BIZARRE PUNKS IN RANDOM COLORS FROM THE RGB RANGE  </li>
                <li>THE 69 SPECIAL PUNKS ARE EVENLY DISTRIBUTED AMONG THE TOTAL NUMBER. </li>
                  <li>AFTER THE REVEAL EVERYONE WHO <span class="underline">MINTED</span> A SPECIAL WILL GET 0.256 ETH TO THEIR ACCOUNT</li>
                </ul>
              </div>
            </div>

            <div className="flex w-full lg:w-1/3 py-10 items-top">
              <div className="AmikoRegular space-y-4">
              <ul class="list-disc text-2xl text-black p-2   AmikoRegular">
                <li>FIRST 420 ARE FREE 1 PER WALLET</li>
                <li>REST ARE 0.0142069 ETH EACH MAX 25 PER TX</li>
                <li>REVEAL IS AFTER SOLD OUT OR IN 24 HOURS</li>
                <li>A LIST OF LUCKY WINNERS AND A REPORT WITH TRANSACTIONS IN A FEW HOURS AFTER THE REVEAL</li>
              </ul>
              </div>
            </div>


          </div>
        </div>
 {/* block 3         */}
        <div id="block2" className='w-full'>
          <div className='flex flex-col items-center justify-center  w-auto'>
 
            <span className="flex Kanit-Black text-4xl text-black">MINTED:&nbsp;<span className=" text-4xl"> {!signedIn ? <>-</> : <>{totalSupply}</>} / 4269</span></span>
            <div className="flex justify-around  mt-8 mx-6">
              <span className="flex Kanit-Black text-xl md:text-3xl text-black items-center bg-grey-lighter rounded rounded-r-none px-3 font-bold">Mint</span>

              <input type="number" min="1" max="25" value={how_many_rgbpunks} onChange={e => set_how_many_rgbpunks(e.target.value)} name=""
                className="Kanit-Black pl-4  inline bg-grey-lighter  py-2 font-normal rounded text-grey-darkest  font-bold" />

              <span className="flex Kanit-Black text-xl md:text-3xl text-black items-center bg-grey-lighter rounded rounded-r-none px-3 font-bold">V256 Punk(s)!</span>
            </div>
            <span className="flex Kanit-Black text-black items-center mt-5">max 25 per transaction</span>
          </div>
          <div className="flex flex-row justify-center space-x-10 mb-4">
            {saleIsActive ?
              <button onClick={() => freeMintPunks(1)} className="mt-4 Kanit-Black text-3xl border-6 transition duration-200 bg-yellow-500 rounded-lg hover:bg-yellow-600  text-black p-2 ">MINT 1 for FREE + gas</button>
              : <button className="mt-4 Kanit-Black text-xl border-6 text-black transition duration-200 bg-yellow-500 rounded-lg hover:bg-yellow-600 p-2 ">SALE IS NOT ACTIVE OR NO WALLET IS CONNECTED</button>

            }
            {saleIsActive ?
              <button onClick={() => mintPunks(how_many_rgbpunks)} className="mt-4 Kanit-Black text-3xl border-6 transition duration-200 bg-yellow-500 rounded-lg hover:bg-yellow-600  text-black p-2 ">MINT {how_many_rgbpunks} for {(tokenPrice * how_many_rgbpunks) / (10 ** 18)} ETH + gas</button>
              : <button className="mt-4 Kanit-Black text-xl border-6 text-black transition duration-200 bg-yellow-500 rounded-lg hover:bg-yellow-600 p-2 ">SALE IS NOT ACTIVE OR NO WALLET IS CONNECTED</button>

            }

          </div>
          <div className='flex flex-col items-center justify-center  w-auto'>
            {!signedIn ? <button onClick={signIn} className="Kanit-Black inline-block  duration-200 bg-yellow-500 rounded-lg hover:bg-yellow-600  no-underline py-2 px-4 mx-4">Connect Wallet with Metamask</button>
              :
              <button onClick={signOut} className="Kanit-Black inline-block transition duration-200 bg-yellow-500 rounded-lg hover:bg-yellow-600 no-underline py-2 px-4 mx-4 ">Connected: {walletAddress}</button>}
            </div>
        </div>
      </body>
    </html>
  )
}