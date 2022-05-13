import clsx from 'clsx';
import { Icon } from '@iconify/react';

export default function CheckedRibbonIcon({ className }) {
  return (
    <span className={clsx('relative inline-block', className)}>
      <Icon icon="entypo:price-ribbon" />
      <Icon icon="bi:check" className="absolute top-[3px] left-[12px] text-2xl" />
    </span>
  );
}