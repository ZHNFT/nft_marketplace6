import clsx from 'clsx';

export default function FolderIcon({ className }) {
  return (  
    <svg className={clsx('inline-block', className)} viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 10.7778C13 11.1019 12.8736 11.4128 12.6485 11.642C12.4235 11.8712 12.1183 12 11.8 12H2.2C1.88174 12 1.57652 11.8712 1.35147 11.642C1.12643 11.4128 1 11.1019 1 10.7778V2.22222C1 1.89807 1.12643 1.58719 1.35147 1.35798C1.57652 1.12877 1.88174 1 2.2 1H5.2L6.4 2.83333H11.8C12.1183 2.83333 12.4235 2.9621 12.6485 3.19131C12.8736 3.42052 13 3.7314 13 4.05556V10.7778Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>       
  );
}