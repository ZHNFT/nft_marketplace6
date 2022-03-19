import clsx from 'clsx';

export default function ProfileIcon({ className }) {
  return (  
    <svg className={clsx('inline-block', className)} viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.6667 13V11.6667C11.6667 10.9594 11.3857 10.2811 10.8856 9.78105C10.3855 9.28095 9.70724 9 9 9H3.66667C2.95942 9 2.28115 9.28095 1.78105 9.78105C1.28095 10.2811 1 10.9594 1 11.6667V13" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.33329 6.33333C7.80605 6.33333 8.99996 5.13943 8.99996 3.66667C8.99996 2.19391 7.80605 1 6.33329 1C4.86053 1 3.66663 2.19391 3.66663 3.66667C3.66663 5.13943 4.86053 6.33333 6.33329 6.33333Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>    
  );
}