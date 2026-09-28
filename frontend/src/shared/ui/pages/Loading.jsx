const Loading = () => {
  return (
    <div className="h-screen flex items-center justify-center z-999 bg-white">
      <div className="text-center">
        
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          snitch
        </h1>

        <div className="mt-4 flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-black rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:150ms]" />
          <div className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:300ms]" />
        </div>

        <p className="text-sm text-gray-400 mt-3">
          Loading ...
        </p>

      </div>
    </div>
  );
};

export default Loading;