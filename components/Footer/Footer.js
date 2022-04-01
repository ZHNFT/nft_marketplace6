import { DiscordFillIcon, TelegramFillIcon, TwitterFillIcon } from "../icons";
import DarkModeSwitch from "../DarkModeSwitch/DarkModeSwitch";

export default function Footer() {
  return (
    <div className="w-full mt-20 pb-14 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
      <ul className="flex">
        <li>
          <a href="https://twitter.com/hiveinvestments" target="_blank" rel="noreferrer">
            <TwitterFillIcon className="w-[18px] text-malibu" />
            <span className="sr-only">Twitter</span>
          </a>
        </li>
        <li className="ml-6">
          <a href="" target="_blank" rel="noreferrer">
            <TelegramFillIcon className="w-[17px] text-cornflower" />
            <span className="sr-only">Telegram</span>
          </a>
        </li>
        <li className="ml-6">
          <a href="https://discord.gg/HiveInvestments" target="_blank" rel="noreferrer">
            <DiscordFillIcon className="w-[21px] text-black/[0.5] dark:text-[#C1CDEB]" />
            <span className="sr-only">Discord</span>
          </a>
        </li>
      </ul>
      <div>
        <DarkModeSwitch />
      </div>
    </div>
  );
}