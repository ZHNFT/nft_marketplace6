import Circle from './Circle';

export default function ProgressCircle({ width, height, percent }) {
  return (
    <svg width={width} height={height}>
      <g transform={`rotate(-90 ${"100 100"})`}>
        <Circle color="white" opacity="0.1" />
        <Circle color="white" opacity="0.8" percent={percent} />
      </g>
    </svg>
  );
}