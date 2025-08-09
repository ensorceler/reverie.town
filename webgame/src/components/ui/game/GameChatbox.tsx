import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, X, Users, Settings, Globe, Shield } from 'lucide-react';



export const GameChatbox = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [message, setMessage] = useState('');
    const [selectedChannel, setSelectedChannel] = useState('Global');
    //const [backgroundColor, setBackgroundColor] = useState('bg-black');
    const [messages, setMessages] = useState([
        { id: 1, type: 'system', text: 'Please be respectful and polite towards others. Offensive behavior is not tolerated.', timestamp: '14:30' },
        { id: 2, type: 'system', text: 'Do not share any private information (email, phone number, address, passwords)!', timestamp: '14:30' },
        { id: 3, type: 'global', user: 'MD.RR', text: 'war hero', subtext: 'how', timestamp: '14:32', level: '⚡' },
        { id: 4, type: 'global', user: 'Yoshi', text: 'Did you guys hear about brawl stars?', timestamp: '14:33', level: '🛡️' },
        { id: 5, type: 'global', user: 'Yoshi', text: 'It looks sick', timestamp: '14:33', level: '🛡️' },
        { id: 6, type: 'global', user: 'Imran', text: 'Emerald Family', subtext: 'yoshi please join...', timestamp: '14:34', level: '👑' },
    ]);

    const messagesEndRef = useRef(null);

    const channels = [
        { name: 'Global', icon: Globe, color: 'text-blue-400' },
        { name: 'Clan', icon: Shield, color: 'text-green-400' }
    ];

    const backgroundOptions = [
        { name: 'Black', class: 'bg-black', preview: 'bg-black' },
        { name: 'Dark Blue', class: 'bg-slate-900', preview: 'bg-slate-900' },
        { name: 'Deep Purple', class: 'bg-purple-900', preview: 'bg-purple-900' },
        { name: 'Forest Green', class: 'bg-green-900', preview: 'bg-green-900' },
        { name: 'Dark Red', class: 'bg-red-900', preview: 'bg-red-900' },
        { name: 'Ocean Blue', class: 'bg-blue-900', preview: 'bg-blue-900' },
        { name: 'Gradient Purple', class: 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900', preview: 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900' },
        { name: 'Gradient Green', class: 'bg-gradient-to-br from-green-900 via-teal-900 to-blue-900', preview: 'bg-gradient-to-br from-green-900 via-teal-900 to-blue-900' },
    ];

    const scrollToBottom = () => {
        (messagesEndRef.current as any)?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (message.trim()) {
            const newMessage = {
                id: messages.length + 1,
                type: selectedChannel.toLowerCase(),
                user: 'You',
                text: message,
                level: '⭐',
                timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
            };
            setMessages([...messages, newMessage]);
            setMessage('');
        }
    };

    const handleKeyPress = (e: any) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <>
            {/* Compact chatbox (bottom-left) */}
            {!isExpanded && (
                <div className="absolute bottom-4 left-4 z-[60]">
                    {/* Mini chat preview */}
                    <div className="mb-3 w-80 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl hover:bg-white/10 transition-all duration-300">
                        <div className="space-y-2 max-h-24 overflow-hidden">
                            {messages.slice(-3).map((msg) => (
                                <div key={msg.id} className="text-xs">
                                    {msg.type === 'system' ? (
                                        <div className="text-yellow-400 font-medium">
                                            ⚠️ {msg.text}
                                        </div>
                                    ) : (
                                        <div className="flex items-start gap-2">
                                            <span className="text-gray-400 w-8 flex-shrink-0">{msg.timestamp}</span>
                                            <div className="text-white">
                                                <span className="text-orange-400 font-semibold">{msg.user}</span>
                                                <span className="text-gray-200">: {msg.text}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Compact input */}
                    <div className="flex gap-3">
                        <div className="flex-1 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-3 shadow-xl hover:bg-white/15 transition-all duration-300">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Say something..."
                                className="w-full bg-transparent text-white placeholder-gray-300 text-sm outline-none"
                            />
                        </div>
                        <button
                            onClick={() => setIsExpanded(true)}
                            className="bg-white/15 backdrop-blur-xl border border-white/25 hover:bg-white/25 text-white p-3 rounded-xl shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl"
                        >
                            <MessageCircle size={20} />
                        </button>
                    </div>
                </div>
            )}

            {/* Expanded chatbox */}
            {isExpanded && (
                <div className="absolute inset-4 z-[60] flex items-center justify-center">
                    <div className="w-full max-w-5xl h-full max-h-[700px] bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
                        {/* Header */}
                        <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 p-5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg border border-white/30">
                                    <MessageCircle className="text-white" size={24} />
                                </div>
                                <h2 className="text-white font-bold text-xl">Chat</h2>
                                <div className="flex items-center gap-2 text-gray-200 text-sm bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20">
                                    <Users size={16} />
                                    <span>1,247 online</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
                                    <Settings size={20} />
                                </button>
                                <button
                                    onClick={() => setIsExpanded(false)}
                                    className="text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10 flex items-center gap-2"
                                    title="Minimize to bottom-left"
                                >
                                    <span className="text-sm font-medium">—</span>
                                </button>
                                <button
                                    onClick={() => setIsExpanded(false)}
                                    className="text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
                                    title="Close chat"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-1 overflow-hidden">
                            {/* Channel sidebar */}
                            <div className="w-52 bg-white/5 backdrop-blur-xl border-r border-white/20 p-5">
                                <h3 className="text-gray-200 font-semibold mb-4 text-sm uppercase tracking-wider">Channels</h3>
                                <div className="space-y-3">
                                    {channels.map((channel) => {
                                        const IconComponent = channel.icon;
                                        return (
                                            <button
                                                key={channel.name}
                                                onClick={() => setSelectedChannel(channel.name)}
                                                className={`w-full text-left px-4 py-4 rounded-2xl transition-all duration-300 flex items-center gap-3 font-medium border ${selectedChannel === channel.name
                                                    ? 'bg-white/20 backdrop-blur-xl text-white border-white/30 shadow-lg transform scale-105'
                                                    : 'text-gray-300 hover:bg-white/10 hover:text-white border-white/10 hover:border-white/20'
                                                    }`}
                                            >
                                                <IconComponent size={18} className={channel.color} />
                                                {channel.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Main chat area */}
                            <div className="flex-1 flex flex-col">
                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-white/5 backdrop-blur-sm">
                                    {messages.map((msg) => (
                                        <div key={msg.id} className="flex items-start gap-4">
                                            <span className="text-xs text-gray-400 w-12 flex-shrink-0 mt-2">{msg.timestamp}</span>
                                            {msg.type === 'system' ? (
                                                <div className="bg-yellow-500/20 backdrop-blur-xl border border-yellow-400/30 rounded-2xl p-4 flex-1 shadow-lg">
                                                    <div className="text-yellow-300 text-sm font-medium flex items-start gap-2">
                                                        ⚠️ <span>{msg.text}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 flex-1 hover:bg-white/15 hover:border-white/30 transition-all duration-300 shadow-lg">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-xl">{msg.level}</span>
                                                        <span className="text-orange-400 font-bold text-sm">{msg.user}</span>
                                                    </div>
                                                    <div className="text-white text-sm leading-relaxed">{msg.text}</div>
                                                    {msg.subtext && (
                                                        <div className="text-gray-300 text-xs mt-2 italic opacity-80">{msg.subtext}</div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input area */}
                                <div className="p-5 bg-white/10 backdrop-blur-xl border-t border-white/20">
                                    <div className="flex gap-4">
                                        <div className="flex-1 relative">
                                            <input
                                                type="text"
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                onKeyPress={handleKeyPress}
                                                placeholder={`Message ${selectedChannel}...`}
                                                className="w-full bg-white/10 backdrop-blur-xl border border-white/25 rounded-2xl px-5 py-4 text-white placeholder-gray-300 outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300 shadow-lg"
                                            />
                                        </div>
                                        <button
                                            onClick={handleSendMessage}
                                            className="bg-white/15 backdrop-blur-xl hover:bg-white/25 text-white px-8 py-4 rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center gap-3 font-semibold border border-white/25 hover:border-white/40"
                                        >
                                            <Send size={18} />
                                            Send
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style >{`
      `}</style>
        </>
    );
};

export default GameChatbox;