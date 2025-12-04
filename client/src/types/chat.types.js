/**
 * @fileoverview Type definitions for the chatbot module.
 * Uses JSDoc for type annotations to maintain consistency with existing codebase.
 */

/**
 * @typedef {'user' | 'assistant' | 'system'} MessageRole
 */

/**
 * @typedef {Object} Attachment
 * @property {string} id - Unique identifier for the attachment
 * @property {string} name - File name
 * @property {string} type - MIME type
 * @property {string} url - URL or data URI of the attachment
 * @property {number} [size] - File size in bytes
 */

/**
 * @typedef {Object} Message
 * @property {string} id - Unique message identifier
 * @property {string} content - Message content (may contain markdown)
 * @property {MessageRole} role - Role of the message sender
 * @property {string} timestamp - ISO 8601 timestamp
 * @property {Attachment[]} [attachments] - Optional file attachments
 * @property {boolean} [isStreaming] - Whether the message is still streaming
 * @property {boolean} [isError] - Whether this is an error message
 */

/**
 * @typedef {Object} Conversation
 * @property {string} id - Unique conversation identifier
 * @property {Message[]} messages - Array of messages in the conversation
 * @property {string} createdAt - ISO 8601 timestamp of creation
 * @property {string} updatedAt - ISO 8601 timestamp of last update
 * @property {string} [title] - Optional conversation title
 */

/**
 * @typedef {Object} ChatState
 * @property {boolean} isOpen - Whether the chat window is open
 * @property {boolean} isLoading - Whether a message is being processed
 * @property {boolean} isTyping - Whether the assistant is typing
 * @property {string | null} error - Current error message, if any
 * @property {Message[]} messages - Current conversation messages
 * @property {string} conversationId - Current conversation ID
 */

/**
 * @typedef {Object} QuickAction
 * @property {string} id - Unique action identifier
 * @property {string} label - Button label text
 * @property {string} message - Message to send when clicked
 * @property {string} [icon] - Optional icon name
 */

/**
 * @typedef {Object} ChatConfig
 * @property {number} maxMessageLength - Maximum characters per message
 * @property {number} rateLimitMs - Minimum milliseconds between messages
 * @property {QuickAction[]} quickActions - Predefined quick actions
 * @property {boolean} enableNotifications - Whether to show notifications
 * @property {boolean} enableSounds - Whether to play sounds
 */

/** @type {ChatConfig} */
export const DEFAULT_CHAT_CONFIG = {
    maxMessageLength: 4000,
    rateLimitMs: 1000,
    quickActions: [
        { id: 'help', label: '💡 How can you help?', message: 'What can you help me with?' },
        { id: 'summary', label: '📊 Give me a summary', message: 'Give me a summary of my contacts, reminders, and recent activity' },
        { id: 'reminders', label: '⏰ Today\'s reminders', message: 'What are my reminders for today?' },
        { id: 'contacts', label: '👥 My contacts', message: 'Tell me about my contacts' },
        { id: 'recent', label: '🕐 Recent interactions', message: 'What are my recent interactions?' },
        { id: 'sos', label: '🚨 Emergency setup', message: 'Help me set up my emergency SOS contacts' },
    ],
    enableNotifications: true,
    enableSounds: true,
};

export default {};
