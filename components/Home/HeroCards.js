import clsx from "clsx";
import PrimaryButton from "../Buttons/PrimaryButton";
import SecondaryButton from "../Buttons/SecondaryButton";
import { useRouter } from "next/router";

export default function HeroCards( {connect }) {

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
        
        console.log("clicked")
        router.push("/collections/0x16c3fbda29713b1766128980b65d92807151d710") 
      
      }
    },
    {
      title: 'Buy, sell and auction',
      description: 'Build your collection and your portfolio',
      button: 'Profile',
      buttonClass: 'secondary',
      action: () => {}
    }
  ];
  
  const CARD_CLASSES = [
    'bg-cardOutline1 hover:saturate-150 hover:brightness-110 hover:-top-[12px] w-full',
    'bg-cardOutline2 hover:saturate-120 hover:brightness-110 hover:-top-[12px] w-full',
    'bg-cardOutline3 hover:saturate-150 hover:brightness-150 hover:-top-[12px] w-full'
  ];
  return (  
    <ul className=" mt-16 mb-20 flex flex-col md:flex-row justify-between">
      {
        CARDS.map(({ title, description, button, buttonClass, action }, index) => (
          <li key={index} className={clsx(
            'bg-cover px-4 pt-9 pb-10 shadow-featuredCard rounded-[20px] mb-8 text-center md:mx-2 lg:mx-8 first:ml-0 last:mr-0 transition duration-300',
            CARD_CLASSES[index],
            
            
          )}>
            <div className="block w-[90px] h-[90px] bg-frame bg-cover flex justify-center items-center mb-8 mx-auto ">
              <span className="gradient-heading font-semibold text-4xl">{index+1}</span>
            </div>
            <h3 className="gradient-text text-base mb-4 font-medium">{title}</h3>
            <p className="text-manatee text-xs">{description}</p>
            <button className={clsx(
              'font-medium text-xs rounded-[10px] py-2 px-8 border-[0.5px] border-transparent mt-8',
              { 'bg-white/[0.1] border-white hover:border-cornflower hover:bg-white/[0.15]': buttonClass === 'secondary' },
              { 'gradient-bg-blue hover:border-white': buttonClass === 'primary' }
            )} onClick={ () => {
                action();
            }
              
             }>
              {button}
            </button>
          </li>
        ))
      }
    </ul>
  );
}