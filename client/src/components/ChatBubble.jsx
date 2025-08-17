const ChatBubble = ({ message, isLoading }) => {
  const { role, parts } = message;
  const isUser = role === 'user';

  return (
    <div className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`rounded-lg px-4 py-2 max-w-sm ${isUser ? 'bg-primary text-white' : 'bg-gray-200 text-text'}`}>
        {isLoading ? (
          <div className="flex items-center space-x-1">
            <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></span>
          </div>
        ) : (
          parts[0].text
        )}
      </div>
    </div>
  );
};

export default ChatBubble;