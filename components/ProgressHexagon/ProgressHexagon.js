export default function ProgressHexagon ({ className, width, height, percent, max = 2160 }) {
  const strokePercent = ((100 - percent) / 100) * max;
  return (
    <svg className={`inline-block ${className}`} width={width} height={height} viewBox="0 0 776 628">
      <path 
        className="stroke-black dark:stroke-white"
        style={{transform: 'translate(75px, 685px) rotate(-90deg)'}}
        fill="transparent"
        strokeWidth="60"
        strokeOpacity="0.1"
        stroke="black"
        strokeLinejoin="round"
        d="M723 314L543 625.77 183 625.77 3 314 183 2.23 543 2.23 723 314z"
      />
      <path 
        style={{transform: 'translate(75px, 685px) rotate(-90deg)',  transition: 'stroke-dashoffset 1s'}}
        fill="transparent"
        strokeWidth="60"
        stroke="#5791ff"
        strokeLinecap="round"
        strokeDasharray="2160"
        strokeDashoffset={strokePercent}
        strokeLinejoin="round"
        d="M723 314L543 625.77 183 625.77 3 314 183 2.23 543 2.23 723 314z"
      />
    </svg>
  );
}