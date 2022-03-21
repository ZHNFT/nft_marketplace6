import clsx from 'clsx';

const getClassnameByType = type => {
  switch (type) {
    case 'left':
      return 'rotate-180';
    case 'up':
      return '-rotate-90';
    case 'down':
      return 'rotate-90';
    default:
      return '';
  }
};

export default function ArrowAltIcon({ className, type = "right" }) {
  return (
    <svg 
      className={clsx(
        'inline-block',
        className,
        getClassnameByType(type)
      )}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M15 8H1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 15L1 8L8 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>       
  );
}