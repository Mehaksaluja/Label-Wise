import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAppStore } from '../store';
import ChatBubble from './ChatBubble';

const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  const { plan, updatePlan } = useAppStore();

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', parts: [{ text: input }] };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

      const { data } = await axios.post('http://localhost:5001/api/chat', { message: input }, config);
      const aiReply = data.reply;

      const planUpdateRegex = /<<<PLAN_UPDATE>>>(.*)/s;
      const match = aiReply.match(planUpdateRegex);
      let conversationalReply = aiReply;

      if (match && match[1]) {
        conversationalReply = aiReply.substring(0, match.index).trim();
        const planJsonString = match[1];

        try {
          const jsonString = planJsonString.replace(/```json/g, '').replace(/```/g, '').trim();
          const newDayPlan = JSON.parse(jsonString);

          const dayNumber = parseInt(newDayPlan.day.split(' ')[1], 10);
          if (!isNaN(dayNumber) && plan) {
            const dayIndex = dayNumber - 1;
            const weekIndex = Math.floor(dayIndex / 7);
            const dayOfWeekIndex = dayIndex % 7;

            const newPlanState = JSON.parse(JSON.stringify(plan));
            if (newPlanState.weeklyPlan[weekIndex]?.dailyPlan[dayOfWeekIndex]) {
              newPlanState.weeklyPlan[weekIndex].dailyPlan[dayOfWeekIndex] = newDayPlan;
              updatePlan(newPlanState);
            }
          }
        } catch (e) {
          console.error("Failed to parse or update plan from AI:", e);
        }
      }

      if (conversationalReply) {
        const modelMessage = { role: 'model', parts: [{ text: conversationalReply }] };
        setMessages(prev => [...prev, modelMessage]);
      }

    } catch (error) {
      const errorMessage = { role: 'model', parts: [{ text: 'Sorry, I ran into an error. Please try again.' }] };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={`fixed bottom-24 right-4 md:right-8 w-11/12 max-w-lg h-3/4 bg-white rounded-lg shadow-2xl flex flex-col transition-all duration-300 z-50 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <div className="bg-primary text-white p-4 rounded-t-lg flex justify-between items-center">
          <h3 className="font-bold text-lg">AI Wellness Coach</h3>
          <button onClick={() => setIsOpen(false)} className="text-white text-2xl leading-none">&times;</button>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <ChatBubble key={index} message={msg} />
          ))}
          {isLoading && <ChatBubble message={{ role: 'model', parts: [{ text: '...' }] }} isLoading={true} />}
          <div ref={chatEndRef} />
        </div>
        <form onSubmit={handleSendMessage} className="p-4 border-t border-secondary">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="w-full p-2 border border-secondary rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              disabled={isLoading}
            />
            <button type="submit" className="bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50" disabled={isLoading}>
              Send
            </button>
          </div>
        </form>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 md:right-8 bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50">
        <ChatIcon />
      </button>
    </>
  );
};

export default Chatbot;