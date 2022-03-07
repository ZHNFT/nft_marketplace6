
import Image from 'next/image';
import BeeImage from '../../images/icons/icon-bee.png';

export default function BeeIcon({ className }) {
  return (
    <span className={`inline-block ${className}`}>
      <Image src={BeeImage} alt="Bee" />
    </span>
  );
}