/**
 * @fileoverview Expandable chat window component with header, messages, and input.
 */

import { useEffect, useRef } from 'react';
import { X, Trash2, AlertCircle } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import QuickActions from './QuickActions';
import TypingIndicator from './TypingIndicator';

/**
 * Chat window component
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the window is open
 * @param {function(): void} props.onClose - Callback to close the window
 * @param {function(): void} props.onMinimize - Callback to minimize the window
 * @param {import('../../types/chat.types').Message[]} props.messages - Chat messages
 * @param {boolean} props.isLoading - Whether a message is being processed
 * @param {boolean} props.isTyping - Whether the assistant is typing
 * @param {string | null} props.error - Current error message
 * @param {function(string): void} props.onSendMessage - Callback to send a message
 * @param {function(): void} props.onClearChat - Callback to clear chat
 * @param {function(string): void} props.onExport - Callback to export chat
 * @param {function(): void} props.onDismissError - Callback to dismiss error
 * @param {import('../../types/chat.types').QuickAction[]} props.quickActions - Quick actions
 * @param {number} props.maxMessageLength - Maximum message length
 * @returns {JSX.Element | null}
 */
const ChatWindow = ({
    isOpen,
    onClose,
    onMinimize,
    messages,
    isLoading,
    isTyping,
    error,
    onSendMessage,
    onClearChat,
    onExport,
    onDismissError,
    quickActions,
    maxMessageLength,
}) => {
    const messagesEndRef = useRef(null);
    const windowRef = useRef(null);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping]);

    // Handle escape key to close
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Focus trap
    useEffect(() => {
        if (isOpen && windowRef.current) {
            const focusableElements = windowRef.current.querySelectorAll(
                'button, textarea, input, [tabindex]:not([tabindex="-1"])'
            );
            if (focusableElements.length > 0) {
                focusableElements[0].focus();
            }
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            ref={windowRef}
            className="absolute bottom-0 right-0 w-[420px] max-w-[calc(100vw-32px)] h-[650px] max-h-[calc(100vh-100px)] bg-white rounded-[24px] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] flex flex-col overflow-hidden animate-[slideUp_0.3s_cubic-bezier(0.4,0,0.2,1)] border border-gray-200 md:max-[480px]:w-[calc(100vw-32px)] md:max-[480px]:h-[calc(100vh-80px)] md:max-[480px]:rounded-xl"
            role="dialog"
            aria-modal="true"
            aria-label="Chat with AI Assistant"
        >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 bg-linear-to-br from-gray-900 to-gray-800 text-white border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-white/15 rounded-xl flex items-center justify-center p-2">
                        <img src="/logo.png" alt="MindTrace" className="w-6 h-6 object-contain" />
                    </div>
                    <div>
                        <h2 className="text-[17px] font-bold m-0 tracking-tight">AI Assistant</h2>
                        <span className="text-xs opacity-90">
                            {isTyping ? 'Typing...' : 'Online'}
                        </span>
                    </div>
                </div>

                <div className="flex gap-1">
                    {messages.length > 0 && (
                        <button
                            type="button"
                            onClick={onClearChat}
                            className="w-9 h-9 rounded-[10px] border-none bg-white/15 text-white cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-red-500/30 hover:scale-105 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
                            aria-label="Clear chat"
                            title="Clear conversation"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-9 h-9 rounded-[10px] border-none bg-white/15 text-white cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-white/25 hover:scale-105 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
                        aria-label="Close chat"
                        title="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Error banner */}
            {error && (
                <div className="flex items-center gap-2 px-4 py-3 bg-red-50 text-red-500 text-[13px]" role="alert">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                    <button
                        type="button"
                        onClick={onDismissError}
                        className="ml-auto bg-transparent border-none text-red-500 cursor-pointer p-1 rounded hover:bg-red-500/10"
                        aria-label="Dismiss error"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4 bg-gray-50 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded">
                {messages.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center px-5 py-10 text-gray-500">
                        <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-gray-900 to-gray-800 flex items-center justify-center mb-4 shadow-lg">
                            <img src="/logo.png" alt="MindTrace" className="w-8 h-8 object-contain" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 m-0 mb-2">Start a conversation</h3>
                        <p className="text-sm m-0 mb-8 max-w-[300px] text-gray-600">Ask me anything about your contacts, reminders, or get help with the dashboard.</p>

                        {/* Quick actions for empty state */}
                        <div className="w-full max-w-[340px]">
                            <QuickActions
                                actions={quickActions}
                                onAction={onSendMessage}
                                disabled={isLoading}
                                hasMessages={false}
                            />
                        </div>
                    </div>
                ) : (
                    <>
                        {messages.map((message) => (
                            <ChatMessage key={message.id} message={message} />
                        ))}
                        {isTyping && !messages.some((m) => m.isStreaming) && (
                            <div className="flex gap-2.5 max-w-[85%] self-start animate-[fadeIn_0.3s_ease]">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-gray-200 text-gray-900">
                                    <img src="/logo.png" alt="MindTrace" className="w-6 h-6 object-contain" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="px-4 py-3 rounded-[18px] text-sm leading-relaxed bg-gray-200 text-gray-900 rounded-bl-md border border-gray-200">
                                        <TypingIndicator />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Quick actions when there are messages */}
            {messages.length > 0 && !isLoading && quickActions.length > 0 && (
                <div className="px-5 py-4 border-t border-gray-200 bg-linear-to-b from-gray-50 to-white">
                    <QuickActions
                        actions={quickActions}
                        onAction={onSendMessage}
                        disabled={isLoading}
                        hasMessages={true}
                    />
                </div>
            )}

            {/* Input */}
            <div className="px-4 py-4 bg-white border-t border-gray-200">
                <ChatInput
                    onSend={onSendMessage}
                    disabled={isLoading}
                    maxLength={maxMessageLength}
                />
            </div>
        </div>
    );
};

export default ChatWindow;
