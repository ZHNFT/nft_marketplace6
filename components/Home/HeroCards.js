import Image from "next/image";
import clsx from "clsx";
import { useRouter } from "next/router";
import ConnectImage from "../../images/featured-connect.png";
import ExploreImage from "../../images/featured-explore.png";
import TradeImage from "../../images/featured-trade.png";

export default function HeroCards( {connect, address }) {

  const router = useRouter();

  const CARDS = [
    {

      title: 'Connect',
      description: 'Simply connect your wallet to get started',
      button: 'Connect',
      buttonClass: 'secondary',
      image: ConnectImage,
      action: () => {
        connect()
      }
    },
    {
      title: 'Explore',
      description: 'Check out what Hexagon has to offer',
      button: 'Explore',
      buttonClass: 'secondary',
      image: ExploreImage,
      action: () => { 
        router.push("/collections") 
      
      }
    },
    {
      title: 'Trade',
      description: 'Buy, sell, auction, and make offers on your favorite NFTs to build your portfolio',
      button: 'Profile',
      buttonClass: 'secondary',
      image: TradeImage,
      action: () => {

        router.push("/users/" + address);

      }
    }
  ];
  
  const CARD_CLASSES = [
    'dark:bg-cardOutline1 dark:hover:saturate-150 dark:hover:brightness-110 hover:-top-[12px] w-full',
    'dark:bg-cardOutline2 dark:hover:saturate-120 dark:hover:brightness-110 hover:-top-[12px] w-full',
    'dark:bg-cardOutline3 dark:hover:saturate-150 dark:hover:brightness-110 hover:-top-[12px] w-full'
  ];
  return (  
    <ul className=" mt-16 mb-20 flex flex-col md:flex-row justify-between">
      {
        CARDS.map(({ title, description, image, button, buttonClass, action }, index) => (
          <li key={index} className={clsx(
            'flex flex-col justify-between bg-cover px-4 pt-9 dark:shadow-featuredCard dark:hover:shadow-none hover:shadow-featuredCardLight rounded-[20px] mb-8 text-center md:mx-2 lg:mx-4 first:ml-0 last:mr-0 transition duration-300',
            'dark:border-0 border-[#a7b1bd] border-[0.5px]',
            CARD_CLASSES[index],
            
            
          )}>
            <div className="flex justify-center items-center aspect-h-1 h-[150px] relative mb-8">
              <Image
                src={image}
                alt={title}
                className="object-center object-contain"
                layout="fill"
              />
            </div>
            <div className="relative block flex justify-center items-center mb-4 mx-auto before:block before:w-[71px] before:h-[71px] before:absolute before:left-0 before:top-0 before:bg-blue">
              <span className="gradient-heading text-ink font-semibold text-xl">{title}</span>
            </div>
            {/*<h3 className="gradient-text text-ink text-base mb-4 font-medium">{title}</h3>*/}
            <p className="dark:text-manatee text-lightGray text-sm px-4">{description}</p>
            <div className="mt-auto">
              <button className={clsx(
                'mt-8 mb-10 font-medium text-sm rounded-[10px] py-2 px-8 border-[0.5px] dark:border-white border-cobalt',
                { 'dark:bg-white/[0.1] bg-cobalt text-white border-white dark:hover:border-cornflower dark:hover:bg-white/[0.15] hover:contrast-150': buttonClass === 'secondary' },
                { 'gradient-bg-blue hover:border-white': buttonClass === 'primary' }
              )} onClick={ () => {
                  action();
              }
                
              }>
                {button}
              </button>
            </div>
          </li>
        ))
      }
    </ul>
  );
}