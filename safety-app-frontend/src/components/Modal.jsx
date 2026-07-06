const Modal = ({ title, children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-100 to-pink-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          {title}
        </h2>

        {children}
      </div>
    </div>
  );
};

export default Modal;