/**
 * @fileoverview Main chat hook that manages state, API calls, and message handling.
 * Integrates with persistence and provides all chat functionality to components.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { chatApi, generateId } from '../services/chatApi';
import { useChatPersistence } from './useChatPersistence';
import { DEFAULT_CHAT_CONFIG } from '../types/chat.types';

/**
 * Creates a new message object
 * @param {string} content - Message content
 * @param {'user' | 'assistant' | 'system'} role - Message role
 * @param {Object} [options] - Additional options
 * @returns {import('../types/chat.types').Message}
 */
const createMessage = (content, role, options = {}) => ({
    id: generateId(),
    content,
    role,
    timestamp: new Date().toISOString(),
    ...options,
});

/**
 * Custom hook for managing chat state and operations
 * @param {Object} [options] - Configuration options
 * @param {boolean} [options.enablePersistence=true] - Whether to persist messages
 * @param {boolean} [options.enableStreaming=false] - Whether to use streaming responses
 * @returns {Object} Chat state and methods
 */
export const useChat = (options = {}) => {
    const { enablePersistence = true, enableStreaming = false } = options;

    // State
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState(null);
    const [conversationId, setConversationId] = useState('');

    // Refs
    const abortControllerRef = useRef(null);
    const streamingMessageRef = useRef('');

    // Persistence hook
    const {
        isLoaded,
        getSessionId,
        saveMessages,
        loadMessages,
        clearMessages: clearPersistedMessages,
    } = useChatPersistence();

    // Initialize conversation
    useEffect(() => {
        if (!isLoaded) return;

        const sessionId = getSessionId();
        setConversationId(sessionId);

        if (enablePersistence) {
            const saved = loadMessages();
            if (saved && saved.messages.length > 0) {
                setMessages(saved.messages);
                setConversationId(saved.conversationId);
            }
        }
    }, [isLoaded, enablePersistence, getSessionId, loadMessages]);

    // Persist messages when they change
    useEffect(() => {
        if (enablePersistence && isLoaded && messages.length > 0) {
            saveMessages(messages, conversationId);
        }
    }, [messages, conversationId, enablePersistence, isLoaded, saveMessages]);

    /**
     * Sends a message and gets a response
     * @param {string} content - The message content
     * @returns {Promise<void>}
     */
    const sendMessage = useCallback(async (content) => {
        if (!content.trim()) return;
        if (!chatApi.canSendMessage()) {
            setError('Please wait a moment before sending another message.');
            setTimeout(() => setError(null), 2000);
            return;
        }

        // Clear any previous error
        setError(null);

        // Add user message immediately
        const userMessage = createMessage(content.trim(), 'user');
        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);
        setIsTyping(true);

        try {
            if (enableStreaming) {
                // Streaming response
                const assistantMessageId = generateId();
                streamingMessageRef.current = '';

                // Add empty assistant message that will be updated
                setMessages((prev) => [
                    ...prev,
                    createMessage('', 'assistant', { id: assistantMessageId, isStreaming: true }),
                ]);

                await chatApi.sendMessageStreaming({
                    message: content.trim(),
                    conversationId,
                    onChunk: (chunk) => {
                        streamingMessageRef.current += chunk;
                        setMessages((prev) =>
                            prev.map((msg) =>
                                msg.id === assistantMessageId
                                    ? { ...msg, content: streamingMessageRef.current }
                                    : msg
                            )
                        );
                    },
                    onComplete: () => {
                        setMessages((prev) =>
                            prev.map((msg) =>
                                msg.id === assistantMessageId
                                    ? { ...msg, isStreaming: false }
                                    : msg
                            )
                        );
                        setIsLoading(false);
                        setIsTyping(false);
                    },
                    onError: (err) => {
                        setError(err.message);
                        setMessages((prev) =>
                            prev.map((msg) =>
                                msg.id === assistantMessageId
                                    ? { ...msg, content: 'Failed to get response.', isError: true, isStreaming: false }
                                    : msg
                            )
                        );
                        setIsLoading(false);
                        setIsTyping(false);
                    },
                });
            } else {
                // Regular response
                const response = await chatApi.sendMessage({
                    message: content.trim(),
                    conversationId,
                });

                const assistantMessage = createMessage(
                    response.response || response.content || response.message || 'No response received.',
                    'assistant',
                    { id: response.id || generateId() }
                );

                setMessages((prev) => [...prev, assistantMessage]);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
            setError(errorMessage);

            // Add error message to chat
            const errorMsg = createMessage(
                'Sorry, I encountered an error. Please try again.',
                'assistant',
                { isError: true }
            );
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            if (!enableStreaming) {
                setIsLoading(false);
                setIsTyping(false);
            }
        }
    }, [conversationId, enableStreaming]);

    /**
     * Clears all messages and starts a new conversation
     */
    const clearChat = useCallback(() => {
        // Abort any ongoing request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        setMessages([]);
        setError(null);
        setIsLoading(false);
        setIsTyping(false);

        // Clear persistence and get new session
        clearPersistedMessages();
        const newSessionId = getSessionId();
        setConversationId(newSessionId);
    }, [clearPersistedMessages, getSessionId]);

    /**
     * Exports the current conversation
     * @param {'json' | 'text'} format - Export format
     */
    const exportChat = useCallback((format = 'text') => {
        chatApi.exportConversation(messages, format);
    }, [messages]);

    /**
     * Retries the last failed message
     */
    const retryLastMessage = useCallback(() => {
        // Find the last user message
        for (let i = messages.length - 1; i >= 0; i--) {
            if (messages[i].role === 'user') {
                const content = messages[i].content;
                // Remove messages after and including the failed response
                setMessages((prev) => prev.slice(0, i));
                // Resend
                setTimeout(() => sendMessage(content), 100);
                break;
            }
        }
    }, [messages, sendMessage]);

    /**
     * Dismisses the current error
     */
    const dismissError = useCallback(() => {
        setError(null);
    }, []);

    return {
        // State
        messages,
        isLoading,
        isTyping,
        error,
        conversationId,
        hasMessages: messages.length > 0,

        // Actions
        sendMessage,
        clearChat,
        exportChat,
        retryLastMessage,
        dismissError,

        // Config
        config: DEFAULT_CHAT_CONFIG,
    };
};

export default useChat;
