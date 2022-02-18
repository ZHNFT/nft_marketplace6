import Image from 'next/image'
import yellowph from "../images/nftObject.png";
import List from '../components/list';

export default function nftPage() {

    

    let trait = {
        property: "legs",
        name: "butt", 
        rarity: 0.005
    };
    
    let activity = {
        event: "buy",
        date: "today", 
        address: "0x6325...2A9c"
    };
    
    let details = {
        contractAddress: "0x6325...2A9c",
        tokenID: "9290", 
        tokenStandard: "ERC721"
    }

    let traitList = [trait, trait, trait, trait, trait];
    
    let activityList = [activity, activity, activity, activity, activity, activity];

    return(

        <div class="w-full min-h-full flex justify-center">

            <div class="flex justify-start align-middle">
                {/* left side */}
                <div class="w-auto h-full flex flex-col p-3 ">
                    <Image
                        className="w-full h-full object-center object-cover rounded-lg"
                        src={yellowph}
                        alt="NFT Image"
                        //layout="fill"
                        width={500}
                        height={500}  
                        priority={true}
                    />
                    <button class="h-10 mt-3 hover:opacity-75 bg-gray-400 rounded-lg text-white">0.5 eth Buy</button>
                    <button class="h-10 mt-3 hover:opacity-75 bg-gray-400 rounded-lg text-white">List/Unlist</button>
                    <button class="h-10 mt-3 hover:opacity-75 bg-gray-400 rounded-lg text-white">Change Price</button>
                    <button class="h-10 mt-3 hover:opacity-75 bg-gray-400 rounded-lg text-white">Update Meta</button>
                    
                </div>
                {/* right side */}
                <div class="w-auto h-full flex flex-col p-3">
                    <h1>NFT Name</h1>
                    <h2>Collection Name</h2>
                    <h3>Owned by: ...</h3>
                    <h1 class="mt-3 font-bold">Traits</h1>
                    {List(traitList)}
                    <h1 class="mt-3 font-bold">Activity</h1>
                    {List(activityList)}
                    <h1 class="mt-3 font-bold">Details</h1>
                    <h2>Contact address: {details["contractAddress"]}</h2>
                    <h2>Token id: {details["tokenID"]}</h2>
                    <h2>Token standard: {details["tokenStandard"]}</h2>
                    
                </div>
            </div>
        </div>

    )
}