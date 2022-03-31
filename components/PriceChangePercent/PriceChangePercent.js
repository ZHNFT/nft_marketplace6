export default function PriceChangePercent({ change }) {
  if (!change) return null;
  const roundedChange = Math.round((change + Number.EPSILON) * 100) / 100;
  const isPositive = Boolean(change > 0);

  return (
    <div className="flex items-center">
      <span>
        {isPositive ? (
          <svg className="text-green-600" width="7" height="4" viewBox="0 0 7 4" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 5H1.75H0L3.5 0L7 5Z" fill="currentColor"/>
          </svg>          
        ) : (
          <svg className="text-red-600" width="7" height="4" viewBox="0 0 7 4" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 0H1.75H0L3.5 5L7 0Z" fill="currentColor"/>
          </svg>
        )}
      </span>

      <span
        className={`${
          isPositive ? "text-green-600" : "text-red-600"
        } ml-1`}>
        {roundedChange}%
      </span>
    </div>
  );
}