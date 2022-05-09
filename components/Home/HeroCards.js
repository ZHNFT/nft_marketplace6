import clsx from "clsx";
import { useRouter } from "next/router";

export default function HeroCards( {connect, address }) {

  const router = useRouter();

  const CARDS = [
    {

      title: 'Connect',
      description: 'Simply connect your wallet to get started',
      button: 'Connect',
      buttonClass: 'secondary',
      action: () => {
        connect()
      }
    },
    {
      title: 'Explore',
      description: 'Check out what Hexagon has to offer',
      button: 'Explore',
      buttonClass: 'secondary',
      action: () => { 

        router.push("/collections") 
      
      }
    },
    {
      title: 'Trade',
      description: 'Buy, sell, auction, and make offers on your favorite NFTs to build your portfolio',
      button: 'Profile',
      buttonClass: 'secondary',
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
        CARDS.map(({ title, description, button, buttonClass, action }, index) => (
          <li key={index} className={clsx(
            'flex flex-col justify-between bg-cover px-4 pt-9 dark:shadow-featuredCard dark:hover:shadow-none hover:shadow-featuredCardLight rounded-[20px] mb-8 text-center md:mx-2 lg:mx-8 first:ml-0 last:mr-0 transition duration-300',
            'dark:border-0 border-[#a7b1bd] border-[0.5px]',
            CARD_CLASSES[index],
            
            
          )}>
            <div className="relative block flex justify-center items-center mb-8 mx-auto before:block before:w-[71px] before:h-[71px] before:absolute before:left-0 before:top-0 before:bg-blue">
              <span className="gradient-heading text-ink font-semibold text-2xl mt-3 mb-2">{title}</span>
            </div>
            {/*<h3 className="gradient-text text-ink text-base mb-4 font-medium">{title}</h3>*/}
            <p className="dark:text-manatee text-lightGray text-md px-10">{description}</p>
            <div className="mt-auto">
              <button className={clsx(
                'mt-8 mb-10 font-medium text-sm rounded-[10px] py-2 px-8 border-[0.5px] dark:border-white border-cobalt',
                { 'bg-white/[0.1] border-white dark:hover:border-cornflower dark:hover:bg-white/[0.15] hover:bg-cornflower/[0.15]': buttonClass === 'secondary' },
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