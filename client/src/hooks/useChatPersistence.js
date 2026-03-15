/**
 * @fileoverview Hook for persisting chat conversations to localStorage.
 * Provides save/load functionality with automatic session management.
 */

import { useCallback, useEffect, useState } from 'react';
import { generateConversationId } from '../services/chatApi';

/** @type {string} */
const STORAGE_KEY = 'mindtrace_chat_history';

/** @type {string} */
const SESSION_KEY = 'mindtrace_chat_session';

/**
 * Custom hook for managing chat persistence in localStorage
 * @returns {Object} Persistence utilities
 */
export const useChatPersistence = () => {
    const [isLoaded, setIsLoaded] = useState(false);

    /**
     * Gets or creates a conversation ID for the current session
     * @returns {string} The conversation ID
     */
    const getSessionId = useCallback(() => {
        let sessionId = sessionStorage.getItem(SESSION_KEY);
        if (!sessionId) {
            sessionId = generateConversationId();
            sessionStorage.setItem(SESSION_KEY, sessionId);
        }
        return sessionId;
    }, []);

    /**
     * Saves messages to localStorage
     * @param {import('../types/chat.types').Message[]} messages - Messages to save
     * @param {string} conversationId - The conversation ID
     */
    const saveMessages = useCallback((messages, conversationId) => {
        try {
            const data = {
                conversationId,
                messages,
                updatedAt: new Date().toISOString(),
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.error('Failed to save chat history:', error);
        }
    }, []);

    /**
     * Loads messages from localStorage
     * @returns {{ messages: import('../types/chat.types').Message[], conversationId: string } | null}
     */
    const loadMessages = useCallback(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (!stored) return null;

            const data = JSON.parse(stored);
            // Validate the structure
            if (data && Array.isArray(data.messages) && data.conversationId) {
                return {
                    messages: data.messages,
                    conversationId: data.conversationId,
                };
            }
            return null;
        } catch (error) {
            console.error('Failed to load chat history:', error);
            return null;
        }
    }, []);

    /**
     * Clears all saved messages from localStorage
     */
    const clearMessages = useCallback(() => {
        try {
            localStorage.removeItem(STORAGE_KEY);
            sessionStorage.removeItem(SESSION_KEY);
        } catch (error) {
            console.error('Failed to clear chat history:', error);
        }
    }, []);

    /**
     * Gets the timestamp of the last saved message
     * @returns {string | null} ISO timestamp or null
     */
    const getLastSavedTime = useCallback(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (!stored) return null;
            const data = JSON.parse(stored);
            return data.updatedAt || null;
        } catch {
            return null;
        }
    }, []);

    // Mark as loaded after initial render
    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 0);
        return () => clearTimeout(timer);
    }, []);

    return {
        isLoaded,
        getSessionId,
        saveMessages,
        loadMessages,
        clearMessages,
        getLastSavedTime,
    };
};

export default useChatPersistence;
