
import Image from 'next/image'



export default function AddGalleryObjects(nfts) {
    return(

        nfts.map((item, i) => (
           
            <div key={i} className="group relative">
                {console.log(item)}
                <div className="w-full h-auto aspect-square rounded-lg overflow-hidden group-hover:opacity-75">
                    <Image
                        className="w-full h-full object-center object-cover"
                        
                        src={item.image}
                        alt="NFT Image"
                        //layout="fill"
                        width={280}
                        height={280}  
                        priority={true}
                    />
                </div>
                <div className="mt-4 flex justify-between">
                    <div>
                        <h3 className="text-sm text-gray-700">
                        <a href="#">
                            <span aria-hidden="true" className="absolute inset-0"></span>
                            {item.name}
                        </a>
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">{item.collection}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{item.price} hny</p>
                </div>
            </div>
        ))
    )
}