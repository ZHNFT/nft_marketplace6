import clsx from "clsx";
import { useRouter } from "next/router";

export default function HeroCards( {connect, address }) {

  const router = useRouter();

  const CARDS = [
    {
      title: 'Connect your wallet',
      description: 'All it takes is a connection',
      button: 'Connect',
      buttonClass: 'secondary',
      action: () => {
        connect()
      }
    },
    {
      title: 'Explore collections',
      description: 'Check out everything Hexagon has to offer',
      button: 'Explore',
      buttonClass: 'secondary',
      action: () => { 

        router.push("/collections") 
      
      }
    },
    {
      title: 'Buy, sell and auction',
      description: 'Build your collection and your portfolio',
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
            'dark:border-transparent border-[#a7b1bd] border-[0.5px]',
            CARD_CLASSES[index],
            
            
          )}>
            <div className="relative block w-[90px] h-[90px] bg-frame bg-cover flex justify-center items-center mb-8 mx-auto before:block before:w-[71px] before:h-[71px] before:absolute before:left-0 before:top-0 before:bg-blue">
              <span className="gradient-heading text-ink font-semibold text-4xl">{index+1}</span>
            </div>
            <h3 className="gradient-text text-ink text-base mb-4 font-medium">{title}</h3>
            <p className="dark:text-manatee text-ink text-xs">{description}</p>
            <div className="mt-auto">
              <button className={clsx(
                'mt-8 mb-9 font-medium text-xs rounded-[10px] py-2 px-8 border-[0.5px] dark:border-transparent border-cobalt',
                { 'bg-white/[0.1] border-white hover:border-cornflower dark:hover:bg-white/[0.15] hover:bg-cornflower/[0.15]': buttonClass === 'secondary' },
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