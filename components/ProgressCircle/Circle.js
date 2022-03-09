export default function Circle({ color, percent, opacity }) {
  const radius = 70;
  const circle = 2 * Math.PI * radius;
  const strokePercent = ((100 - percent) * circle) / 100;
  return (
    <circle
      r={radius}
      cx={100}
      cy={100}
      fill="transparent"
      stroke={strokePercent !== circle ? color : ''}
      strokeOpacity={opacity ? opacity : 1}
      strokeWidth="4px"
      strokeDasharray={circle}
      strokeDashoffset={percent ? strokePercent : 0}
    ></circle>
  );
}