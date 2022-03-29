import clsx from "clsx";
import PrimaryButton from "../Buttons/PrimaryButton";
import SecondaryButton from "../Buttons/SecondaryButton";

const CARDS = [
  {
    title: 'Connect your wallet',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
    button: 'Connect',
    buttonClass: 'secondary',
    action: () => {}
  },
  {
    title: 'Explore collections',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
    button: 'Explore',
    buttonClass: 'primary',
    action: () => {}
  },
  {
    title: 'Buy, sell and auction',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
    button: 'Collect',
    buttonClass: 'secondary',
    action: () => {}
  }
];

export default function HeroCards() {
  return (  
    <ul className="mt-16 mb-20 flex flex-col md:flex-row justify-between">
      {
        CARDS.map(({ title, description, button, buttonClass, action }, index) => (
          <li key={index} className={clsx(
            'bg-cover px-4 pt-9 pb-10 shadow-featuredCard rounded-[20px] mb-8 text-center md:mx-2 lg:mx-8 first:ml-0 last:mr-0',
            `bg-cardOutline${index+1}`
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
            )}>
              {button}
            </button>
          </li>
        ))
      }
    </ul>
  );
}