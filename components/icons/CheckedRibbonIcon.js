import clsx from 'clsx';
import { Icon } from '@iconify/react';

export default function CheckedRibbonIcon({ className }) {
  return (
    <span className={clsx('relative inline-block', className)}>
      <Icon icon="entypo:price-ribbon" />
      <Icon icon="bi:check" className="absolute top-[2px] left-[9px] text-lg" />
    </span>
  );
}