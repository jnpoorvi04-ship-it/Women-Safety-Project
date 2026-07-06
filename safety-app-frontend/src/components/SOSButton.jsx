const SOSButton = ({ onTrigger }) => {
  return (
    <button
      onClick={onTrigger}
      className="bg-red-500 text-white px-6 py-3 rounded-full text-xl hover:bg-red-600"
    >
      🚨 SOS
    </button>
  );
};

export default SOSButton;