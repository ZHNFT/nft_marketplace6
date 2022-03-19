import clsx from 'clsx';

export default function CopyIcon({ className }) {
  return (
    <svg className={clsx('inline-block', className)} viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.07692 4H4.92308C4.41328 4 4 4.41328 4 4.92308V9.07692C4 9.58672 4.41328 10 4.92308 10H9.07692C9.58672 10 10 9.58672 10 9.07692V4.92308C10 4.41328 9.58672 4 9.07692 4Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2.38462 7H1.92308C1.67826 7 1.44347 6.90275 1.27036 6.72964C1.09725 6.55653 1 6.32174 1 6.07692V1.92308C1 1.67826 1.09725 1.44347 1.27036 1.27036C1.44347 1.09725 1.67826 1 1.92308 1H6.07692C6.32174 1 6.55653 1.09725 6.72964 1.27036C6.90275 1.44347 7 1.67826 7 1.92308V2.38462" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>        
  );
}