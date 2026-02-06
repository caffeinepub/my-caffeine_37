import { useState, useEffect } from 'react';

export default function ClockCard() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return `${hours < 10 ? '0' + hours : hours}:${minutesStr} ${ampm}`;
  };

  const formatDate = (date: Date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl p-2.5 shadow-xl border-2 border-green-500">
      <div className="text-center">
        <div className="text-2xl font-black text-green-400 tracking-wider mb-0.5" style={{ fontFamily: 'monospace' }}>
          {formatTime(time)}
        </div>
        <div className="text-[10px] font-medium text-gray-300">
          {formatDate(time)}
        </div>
      </div>
    </div>
  );
}
