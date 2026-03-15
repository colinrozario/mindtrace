/**
 * @fileoverview Main chatbot container component.
 * Manages open/close state, theme, and renders the floating widget.
 */

import { useState, useCallback, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import ChatWindow from './ChatWindow';
import useChat from '../../hooks/useChat';

/**
 * Main chatbot container component
 * @returns {JSX.Element}
 */
const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);

    const {
        messages,
        isLoading,
        isTyping,
        error,
        sendMessage,
        clearChat,
        exportChat,
        dismissError,
        config,
    } = useChat({ enablePersistence: true, enableStreaming: false });

    // Track unread messages when chat is closed
    useEffect(() => {
        if (!isOpen && messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.role === 'assistant') {
                setTimeout(() => setHasUnread(true), 0);
            }
        }
    }, [messages, isOpen]);

    // Clear unread when chat is opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setHasUnread(false), 0);
        }
    }, [isOpen]);

    /**
     * Opens the chat window
     */
    const handleOpen = useCallback(() => {
        setIsOpen(true);
        setIsMinimized(false);
        setHasUnread(false);
    }, []);

    /**
     * Closes the chat window
     */
    const handleClose = useCallback(() => {
        setIsOpen(false);
        setIsMinimized(false);
    }, []);

    /**
     * Minimizes the chat window
     */
    const handleMinimize = useCallback(() => {
        setIsMinimized(true);
        setIsOpen(false);
    }, []);

    /**
     * Handles sending a message
     * @param {string} content - Message content
     */
    const handleSendMessage = useCallback((content) => {
        sendMessage(content);
    }, [sendMessage]);

    return (
        <div className="fixed bottom-6 right-6 z-9999 font-sans">
            {/* Chat Window */}
            <ChatWindow
                isOpen={isOpen}
                onClose={handleClose}
                onMinimize={handleMinimize}
                messages={messages}
                isLoading={isLoading}
                isTyping={isTyping}
                error={error}
                onSendMessage={handleSendMessage}
                onClearChat={clearChat}
                onExport={exportChat}
                onDismissError={dismissError}
                quickActions={config.quickActions}
                maxMessageLength={config.maxMessageLength}
            />

            {/* Floating Button */}
            {!isOpen && (
                <button
                    type="button"
                    onClick={handleOpen}
                    className="w-16 h-16 rounded-[20px] bg-linear-to-br from-gray-900 to-gray-800 border-none cursor-pointer flex items-center justify-center shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)] focus-visible:outline-3 focus-visible:outline-gray-900 focus-visible:outline-offset-[3px] relative"
                    aria-label={isMinimized ? 'Expand chat' : 'Open chat'}
                    aria-expanded={isOpen}
                >
                    {hasUnread && (
                        <span 
                            className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" 
                            aria-label="Unread messages" 
                        />
                    )}
                    <MessageCircle className="w-7 h-7 text-white" />
                </button>
            )}
        </div>
    );
};

export default Chatbot;
