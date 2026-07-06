import { useEffect, useState } from "react";

const Countdown = ({ onComplete, onCancel }) => {
  const [time, setTime] = useState(5);

  useEffect(() => {
    if (time === 0) {
      onComplete(); // trigger SOS
      return; // stop here
    }

    const timer = setTimeout(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [time]);

  return (
    <div className="text-center">
      <h2 className="text-3xl mb-4">
        Sending SOS in {time}...
      </h2>

      <button
        onClick={onCancel}
        className="bg-gray-500 text-white px-4 py-2 rounded"
      >
        Cancel
      </button>
    </div>
  );
};

export default Countdown;