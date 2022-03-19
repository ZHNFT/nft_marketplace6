import clsx from 'clsx';

export default function FilesIcon({ className }) {
  return (
    <svg className={clsx('inline-block', className)} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 1L1 3.8L7 6.6L13 3.8L7 1Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M1 9.7998L7 12.9998L13 9.7998" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M1 6.6001L7 9.8001L13 6.6001" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>    
  );
}