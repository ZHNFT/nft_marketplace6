import { useEffect } from 'react'
import { ethers } from 'ethers'
import jwt from 'jsonwebtoken'
import axios from 'axios'
import { getSignatureListing } from '../Utils/marketplaceSignatures'

export default function Signature ({ chainId, chainIdHex, marketplaceContract, ethersProvider }) {

  let listing = {
    contractAddress: '0xccc160f8cb0fc34eeba4725a8166598f1249069b',
    tokenId: 195,
    userAddress: '',
    expiry: new Date().getTime() + 86400000, // 1 day from now
    quantity: 1,
    pricePerItem: (1 * 10 ** 18).toString(),
    nonce: 13
  }
  let signer = null
  const API_URL = 'http://localhost:5000'

  useEffect(async () => {
    const res = await axios.get(`${API_URL}/collections/${listing.contractAddress}/token/${listing.tokenId}`)
    const data = res.data

    console.log({ marketplaceContract })
  })

  async function makeSignature () {
    signer = ethersProvider.getSigner()
    listing.userAddress = await signer.getAddress()

    let signature
    ({ listing, signature } = await getSignatureListing(listing, signer, ethers, marketplaceContract.address, chainId))
    console.log({ listing, signature })
    const token = jwt.sign({ data: signature }, listing.contractAddress, { expiresIn: 60 })

    const response = await axios(`${API_URL}/listings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      data: listing
    }).catch((error) => {
      console.error(error)
    })
  }

  return (
    <button onClick={ makeSignature }>Make Signature</button>
  )
}