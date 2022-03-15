import Step from './Step';

export default function TransactionList({ steps }) {
  return (
    steps?.map(({ className, title, status, isDefaultOpen, description }, index) => (
      <Step 
        key={index}
        className={className}
        title={title}
        status={status}
        isDefaultOpen={isDefaultOpen}
      >
        { description }
      </Step>
    ))
  );
}