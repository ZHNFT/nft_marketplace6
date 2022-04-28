import Image from "next/image";
import { CURRENCIES } from "../../constants/currencies";
import { BeeIcon } from "../icons";
import EthIcon from '../../images/icon-eth.png';
import MaticIcon from '../../images/icon-matic.png';

export default function CurrencyIcon(props) {
  const { currency, hnyClassName, ethClassName, maticClassName, ethWidth = 10, ethHeight = 15, maticWidth = 15, maticHeight = 15 } = props;

  if (currency === CURRENCIES.HNY) {
    return <BeeIcon className={hnyClassName} />
  }
  
  if (currency === CURRENCIES.WETH) {
    return <Image src={EthIcon} className={ethClassName} alt="WETH" width={ethWidth} height={ethHeight} />
  }

  if (currency === CURRENCIES.WMATIC) {
    return <Image src={MaticIcon} className={maticClassName} alt="WMATIC" width={maticWidth} height={maticHeight} />
  }

  return null;
}