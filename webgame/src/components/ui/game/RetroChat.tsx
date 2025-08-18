
import { useState, useRef, useEffect } from "react";

// Updated Retro Chat Component
export const RetroGameChat = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState('General');
    const [inputMessage, setInputMessage] = useState('');
    const [messages, setMessages] = useState([
        { type: 'chat-service', text: '[Service] Connecting to server...' },
        { type: 'chat-service', text: '[Service] Connection successful.' },
        { type: 'chat-service', text: '[Service] Joined server Asia 1' },
        { type: 'chat-service chat-motd', text: '[Service] [MotD] Welcome to stein.world (v0.3.25a) F.A.Q.' },
        { type: 'chat-service', text: '[Service] Joined server Asia 1' },
        { type: 'chat-message', text: '[Zone] IyanXstar: Anyruns' },
        { type: 'chat-service', text: '[Service] Connection closed.' },
        { type: 'chat-service', text: '[Service] Connecting to server...' },
        { type: 'chat-service', text: '[Service] Connection successful.' },
        { type: 'chat-service', text: '[Service] Joined server Asia 1' },
        { type: 'chat-service chat-motd', text: '[Service] [MotD] Welcome to stein.world (v0.3.25a) F.A.Q.' },
        { type: 'chat-service', text: '[Service] Joined server Asia 1' },
        { type: 'chat-message', text: '[Zone] HONEYBANANA: Nandito na pala yung OA' },
    ]);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        (messagesEndRef.current as any)?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (inputMessage.trim()) {
            const newMessage = {
                type: 'chat-message',
                text: `[Zone (51)] Player: ${inputMessage}`
            };
            setMessages(prev => [...prev, newMessage]);
            setInputMessage('');
        }
    };

    const handleKeyPress = (e: any) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    const handleTabClick = (tabName: string) => {
        if (tabName === '⚙️') return;
        setActiveTab(tabName);
    };

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <>
            {!isExpanded ? (
                // Compact Chat
                <div className="min-w-80 z-20 max-w-sm mx-auto absolute bottom-2 left-2">
                    {/* Top Icon Bar */}
                    <div className="flex mb-2">
                        <button
                            className="surface-raised border-outset w-8 h-8 mr-1 flex items-center justify-center retro-font hover:surface-hover active:surface-active"
                            onClick={toggleExpanded}
                        >
                            📄
                        </button>
                    </div>

                    {/* Tab Bar */}
                    <div className="flex mb-0">
                        <button
                            className={`${activeTab === 'General' ? 'surface-secondary  border-inset text-surface-light' : 'surface-raised  border-outset'} px-4 py-1 retro-font border-r-0`}
                            style={{ borderBottom: 'none' }}
                            onClick={() => handleTabClick('General')}
                        >
                            General
                        </button>
                        <button
                            className={`${activeTab === 'Service' ? 'surface-secondary border-inset text-surface-light' : ' surface-raised  border-outset'} px-4 py-1 retro-font border-r-0`}
                            style={{ borderBottom: 'none' }}
                            onClick={() => handleTabClick('Service')}
                        >
                            Service
                        </button>
                        <button
                            className="surface-raised border-outset w-8 h-8 flex items-center justify-center retro-font hover:surface-hover"
                            style={{ borderBottom: 'none' }}
                            onClick={() => handleTabClick('⚙️')}
                        >
                            ⚙️
                        </button>
                        <div className="flex-1"></div>
                    </div>

                    {/* Chat Messages Area */}
                    <div className="h-32 p-2 overflow-y-auto retro-font bg-black/60 backdrop-blur-sm rounded-t-sm">
                        {messages.map((message, index) => (
                            <div key={index} className={message.type}>
                                {message.text}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Bottom Input Area */}
                    <div className="flex items-center gap-2 mt-0 surface-raised border-outset p-1">
                        <select className="surface-raised border-inset retro-font px-2 py-1 text-surface w-20">
                            <option>Server 1</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Message"
                            className="surface-raised border-inset flex-1 px-3 py-1 retro-font text-surface"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <button
                            className="surface-raised border-outset px-4 py-1 retro-font hover:surface-hover active:surface-active"
                            onClick={handleSendMessage}
                        >
                            Send
                        </button>
                    </div>
                </div>
            ) : (
                // Expanded Full-Screen Chat
                <div className="fixed z-[20] inset-4 max-w-2xl max-h-80 surface-primary">
                    {/* Chat Header */}
                    <div className="surface-raised border-b-2 border-solid border-brown-700 px-4 py-2 retro-font relative text-center">
                        CHAT
                        <button
                            className="absolute right-1 top-0.5 w-5 h-5 flex items-center justify-center retro-font text-white text-[10px] hover:bg-red-600 active:bg-red-700"
                            style={{ background: '#dc2626', border: '2px outset #d32f2f' }}
                            onClick={toggleExpanded}
                        >
                            X
                        </button>
                    </div>

                    {/* Tab Bar */}
                    <div className="flex">
                        <button
                            className={`${activeTab === 'General' ? 'surface-raised border-outset' : 'surface-secondary border-inset text-surface-light'} px-4 py-1 retro-font border-r-0`}
                            style={{ borderBottom: 'none' }}
                            onClick={() => handleTabClick('General')}
                        >
                            General
                        </button>
                        <button
                            className={`${activeTab === 'Service' ? 'surface-raised border-outset' : 'surface-secondary border-inset text-surface-light'} px-4 py-1 retro-font border-r-0`}
                            style={{ borderBottom: 'none' }}
                            onClick={() => handleTabClick('Service')}
                        >
                            Service
                        </button>
                        <button
                            className="surface-raised border-outset w-8 h-8 flex items-center justify-center retro-font hover:surface-hover"
                            style={{ borderBottom: 'none' }}
                            onClick={() => handleTabClick('⚙️')}
                        >
                            ⚙️
                        </button>
                        <div className="flex-1"></div>
                    </div>

                    {/* Expanded Chat Messages Area */}
                    <div className="status-bg border-inset p-3 overflow-y-auto retro-font text-surface-light"
                        style={{ height: 'calc(100vh - 120px)' }}>
                        {messages.map((message, index) => (
                            <div key={index} className={message.type}>
                                {message.text}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Expanded Bottom Input Area */}
                    <div className="surface-raised border-t-2 border-solid border-brown-700 p-1">
                        <div className="flex items-center gap-2">
                            <select className="surface-raised border-inset retro-font px-2 py-1 text-surface w-24">
                                <option>Zone (51)</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Message"
                                className="surface-raised border-inset flex-1 px-3 py-1 retro-font text-surface"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            <button
                                className="surface-raised border-outset px-4 py-1 retro-font hover:surface-hover active:surface-active"
                                onClick={handleSendMessage}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
