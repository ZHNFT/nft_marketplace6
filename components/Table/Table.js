export default function Table({ children, className }) {
  return (
    <div role="list" className={className}>
      { children }
    </div>
  );
}