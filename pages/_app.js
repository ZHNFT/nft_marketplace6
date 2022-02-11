import '../styles/globals.css'
import Link from 'next/link'
import {ClaimTokens, GetNumberTokens} from '../Utils/web3HelperFunctions'

import { useEffect, useState } from "react";

function MyApp({ Component, pageProps }) {

  const [honeyBalance, updateBalance] = useState("0")

  useEffect(() => {

    GetNumberTokens().then((result) => {
      updateBalance(result);
    })

  }, [])  

  return (

    <div>
      <nav className="border-b p-6">

        <p className='text-4xl font-bold'>Hive Marketplace</p>
        <div className='flex mt-4'></div>
        <Link href="/">
          <a className='mr-4 text-pink-500'>Home</a>
        </Link>
        <Link href="/create-item">
          <a className='mr-6 text-pink-500'>Sell NFT</a>
        </Link>
        <Link href="/my-assets">
          <a className='mr-6 text-pink-500'>My NFTs</a>
        </Link>
        <Link href="/creator-dashboard">
          <a className='mr-8 text-pink-500'>Creator Dashboard</a>
        </Link>
        <Link href="/gallery">
          <a className='mr-8 text-pink-500'>Gallery</a>
        </Link>
        <button className='mr-8 text-amber-400' 
            onClick={() => {
                ClaimTokens(10).then(() => {

                  GetNumberTokens().then((result) => {
                    updateBalance(result)
                  })

                })

                
                console.log("hi")
              }
          
            }>
        Get</button>
        
      </nav>

      <div className='rounded'>
        <text className='text-yellow-500'>
          {honeyBalance}
        </text>
      </div>
      <Component {...pageProps}/>

    </div> 
    
    )
}

export default MyApp
