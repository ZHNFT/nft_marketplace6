export default function RowHeading({ children }) {
  return (
    <div className="flex flex-row font-medium text-xs dark:text-manatee justify-between px-2 sm:px-6 py-2">
      { children }
    </div>
  );
}