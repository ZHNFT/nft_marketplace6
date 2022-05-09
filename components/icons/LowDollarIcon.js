import clsx from 'clsx';
import { Icon } from '@iconify/react';

export default function LowDollarIcon({ className }) {
  return (
    <span className={clsx('relative inline-block', className)}>
      <Icon icon="ant-design:dollar-circle-outlined" />
      <Icon icon="entypo:arrow-down" className="absolute bottom-[2px] -right-[8px] text-2xl dark:text-malibu text-cobalt" />
    </span>
  );
}