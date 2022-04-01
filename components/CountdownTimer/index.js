import Countdown from 'react-countdown';

const renderer = ({ formatted, completed }) => {
  const { days, hours, minutes, seconds } = formatted;

  if (completed) {
   return <span>Auction Finished</span>
  }
  return <span suppressHydrationWarning={true}>{days}d {hours}h {minutes}m {seconds}s</span>;
};

export default function CountdownTimer({ date }) {
  return (
    <Countdown
      date={date}
      renderer={renderer}
    />
  )
};