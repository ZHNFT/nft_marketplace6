import Image from "next/image";
import { resolveBunnyLink } from "../../Utils";

export default function Banner({ name, image }) {
  console.log('KKKK', image);
  if (!image) return null;

  const bannerImage = image.startsWith('ipfs:') ? `${resolveBunnyLink(image)}?optimizer=image&width=1000` : image;
  return (
    <div className="w-auto h-[220px] relative -mx-8 -mt-10">
      <Image
        className="block w-full object-center object-cover"
        src={bannerImage}
        alt={name}
        layout="fill" 
        unoptimized={true} 
      />
    </div>
  );
}