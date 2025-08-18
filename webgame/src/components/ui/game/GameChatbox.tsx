import { useState, useRef, useEffect } from "react";
import { ActionButton, SecondaryButton } from "./ActionButton";


// Updated Retro Chat Component
export const GameChatbox = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState('General');
    const [inputMessage, setInputMessage] = useState('');
    const [messages, setMessages] = useState([
        { type: 'chat-service', text: '[Service] Connecting to server...' },
        { type: 'chat-service', text: '[Service] Connection successful.' },
        { type: 'chat-service', text: '[Service] Joined server Europe 1' },
        { type: 'chat-service chat-motd', text: '[Service] [MotD] Welcome to reverie (v0.3.25a) F.A.Q.' },
        { type: 'chat-service', text: '[Service] Joined server Asia 1' },
        { type: 'chat-message', text: '[Zone] IyanXstar: Anyruns' },
        { type: 'chat-service', text: '[Service] Connection closed.' },
        { type: 'chat-service', text: '[Service] Connecting to server...' },
        { type: 'chat-service', text: '[Service] Connection successful.' },
        { type: 'chat-service', text: '[Service] Joined server Europe 1' },
        { type: 'chat-service chat-motd', text: '[Service] [MotD] Welcome to reverie.world (v0.3.25a) F.A.Q.' },
        { type: 'chat-service', text: '[Service] Joined server Europe 1' },
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
                <div className="min-w-80 z-20 max-w-sm mx-auto absolute bottom-0 left-0">

                    {/** top action bar */}
                    <div className="flex mb-2 ml-2"> <button className="w-10 h-10 mr-1 bg-[#121313] border-2 border-[#363737]  flex items-center justify-center retro-font cursor-pointer"
                        onClick={toggleExpanded}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="-5.0 -10.0 110.0 135.0" height="32" width="32" fill="#fff">
                            <path d="m17 14.051v5.9023h-6.0195v6.0195h-6.0195v36h6.0195v17.941h-6.0195v6.0195h24.078v-6.0195h47.922v-5.9023h12.039v-12.039h5.9023v-36h-5.9023v-6.0195h-6.0195v-5.9023zm47.934 29.988v5.9023h6.0195v-5.9023zm-17.945 0v5.9023h6.0195v-5.9023zm-17.945 5.9023h5.9023v-5.9023h-5.9023zm11.926 18.062h-6.0195v6.0195h-5.9023v5.9023h-12.039v-5.9023h6.0195v-6.0195h-6.0195v-6.0195h-6.0195v-36h6.0195v-6.0195h65.98v6.0195h6.0195v36h-6.0195v6.0195z" fill-rule="evenodd" />
                        </svg>
                    </button>
                    </div>

                    {/* Tab Bar */}
                    <div className="flex mb-0">
                        {/*
                        
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
                        */
                        }
                    </div>

                    {/* Chat Messages Area */}
                    <div className="h-32 p-2 overflow-y-auto retro-font bg-[#121313]/80 backdrop-blur-sm">
                        {messages.map((message, index) => (
                            <div key={index} className={message.type}>
                                {message.text}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Bottom Input Area */}
                    <div className=" mt-0 p-2 bg-gradient-to-r from-[#242525] to-neutral-900 flex items-center gap-2">

                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Message"
                                className="w-full relative bg-gradient-to-b from-neutral-800 to-neutral-900 border-2 border-black px-3 py-1 
                   shadow-[2px_2px_0px_0px_#000000] focus:shadow-[1px_1px_0px_0px_#000000]
                   transition-all duration-75 retro-font text-neutral-100 outline-none placeholder-neutral-400"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            {/* Top highlight for 3D effect */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-white opacity-30 pointer-events-none"></div>
                            {/* Left highlight for 3D effect */}
                            <div className="absolute top-0 left-0 bottom-0 w-1 bg-white opacity-20 pointer-events-none"></div>
                            {/* Bottom shadow for 3D effect */}
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black opacity-40 pointer-events-none"></div>
                            {/* Right shadow for 3D effect */}
                            <div className="absolute top-0 right-0 bottom-0 w-1 bg-black opacity-30 pointer-events-none"></div>
                        </div>

                        {
                            /*
                        <select className="font-pixel2P text-xs px-1 py-1">
                            <option>Server 1</option>
                        <input
                            type="text"
                            placeholder="Message"
                            className="flex-1 px-3 py-1 retro-font text-neutral-100 outline-none border-4 border-[#121313]"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        </select>
                            */
                        }

                        <SecondaryButton className="px-2 py-1">
                            Send
                        </SecondaryButton>
                    </div>
                </div>
            ) : (

                // implement the screen just like the compact chatbox theme, use the same colors that was used there. 

                <div className="fixed z-20 inset-0 bottom-2 max-w-2xl max-h-40 bg-[#121313]/90 backdrop-blur-sm border-2 border-[#363737]">
                    {/* Chat Header */}
                    <div className="bg-gradient-to-r from-[#242525] to-neutral-900 border-b-2 border-[#363737] px-4 py-2 retro-font relative text-center text-neutral-100">
                        <p className="font-pixel2P text-sm">
                            CHAT
                        </p>
                        <button
                            className="absolute right-1 top-0.5 px-2 py-1 flex items-center justify-center retro-font text-white text-[10px] bg-[#9b4233] hover:bg-[#c25645] cursor-pointer"
                            onClick={toggleExpanded}
                        >
                            X
                        </button>
                    </div>

                    {/* Tab Bar */}
                    <div className="flex bg-[#242525]/80 border-b border-[#363737]">
                        <button
                            className={`${activeTab === 'General'
                                ? 'bg-[#404140] text-neutral-100 border-[#78b0bb]'
                                : 'bg-[#121313]/60 text-neutral-400 border-[#363737]'} 
                                px-4 py-1 retro-font border-r border-[#363737] hover:bg-[#404140] hover:text-neutral-100`}
                            onClick={() => handleTabClick('General')}
                        >
                            General
                        </button>
                        <button
                            className={`${activeTab === 'Service'
                                ? 'bg-[#404140] text-neutral-100 border-[#78b0bb]'
                                : 'bg-[#121313]/60 text-neutral-400 border-[#363737]'} 
                                px-4 py-1 retro-font border-r border-[#363737] hover:bg-[#404140] hover:text-neutral-100`}
                            onClick={() => handleTabClick('Service')}
                        >
                            Service
                        </button>
                        <button
                            className="bg-[#121313]/60 hover:bg-[#404140] w-8 h-8 flex items-center justify-center retro-font text-neutral-400 hover:text-neutral-100 border-r border-[#363737]"
                            onClick={() => handleTabClick('⚙️')}
                        >
                            ⚙️
                        </button>
                        <div className="flex-1"></div>
                    </div>

                    {/* Expanded Chat Messages Area */}
                    <div className="bg-[#121313]/80 backdrop-blur-sm p-3 overflow-y-auto retro-font text-neutral-100"
                        style={{ height: 'calc(100vh - 120px)' }}>
                        {messages.map((message, index) => (
                            <div key={index} className={message.type}>
                                {message.text}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Expanded Bottom Input Area */}
                    <div className="bg-gradient-to-r from-[#242525] to-neutral-900 border-t-2 border-[#363737] p-2">
                        <div className="flex items-center gap-2">
                            <select className="bg-[#404140] border-2 border-[#363737] retro-font px-2 py-1 text-neutral-100 w-24">
                                <option>Zone (51)</option>
                            </select>
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    placeholder="Message"
                                    className="w-full relative bg-gradient-to-b from-neutral-800 to-neutral-900 border-2 border-black px-3 py-1 
                   shadow-[2px_2px_0px_0px_#000000] focus:shadow-[1px_1px_0px_0px_#000000]
                   transition-all duration-75 retro-font text-neutral-100 outline-none placeholder-neutral-400"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                />
                                {/* Top highlight for 3D effect */}
                                <div className="absolute top-0 left-0 right-0 h-1 bg-white opacity-30 pointer-events-none"></div>
                                {/* Left highlight for 3D effect */}
                                <div className="absolute top-0 left-0 bottom-0 w-1 bg-white opacity-20 pointer-events-none"></div>
                                {/* Bottom shadow for 3D effect */}
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black opacity-40 pointer-events-none"></div>
                                {/* Right shadow for 3D effect */}
                                <div className="absolute top-0 right-0 bottom-0 w-1 bg-black opacity-30 pointer-events-none"></div>
                            </div>

                            {/*
                           
                            <input
                                type="text"
                                placeholder="Message"
                                className="flex-1 px-3 py-1 retro-font text-neutral-100 outline-none border-2 border-[#363737] bg-[#121313]/80 backdrop-blur-sm placeholder-neutral-400"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            */
                            }

                            <SecondaryButton className="px-2 py-1">
                                Send
                            </SecondaryButton>
                        </div>
                    </div>
                </div>
            )}


        </>
    );
};


/*
   // Expanded Full-Screen Chat
                <div className="fixed z-[20] inset-4 max-w-2xl max-h-80 surface-primary">
                    {/* Chat Header 

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

                    <div className="status-bg border-inset p-3 overflow-y-auto retro-font text-surface-light"
                        style={{ height: 'calc(100vh - 120px)' }}>
                        {messages.map((message, index) => (
                            <div key={index} className={message.type}>
                                {message.text}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

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
*/