/**
 * @fileoverview Chat input component with send button and attachment support.
 */

import { useState, useRef, useEffect } from 'react';
import { Send, X } from 'lucide-react';

/**
 * Chat input component
 * @param {Object} props
 * @param {function(string): void} props.onSend - Callback when sending a message
 * @param {boolean} props.disabled - Whether input is disabled
 * @param {number} props.maxLength - Maximum message length
 * @param {string} [props.placeholder] - Input placeholder text
 * @returns {JSX.Element}
 */
const ChatInput = ({
    onSend,
    disabled = false,
    maxLength = 4000,
    placeholder = 'Type your message...',
}) => {
    const [message, setMessage] = useState('');
    const [attachments, setAttachments] = useState([]);
    const textareaRef = useRef(null);

    // Auto-resize textarea
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
        }
    }, [message]);

    /**
     * Handles form submission
     * @param {React.FormEvent} e - Form event
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() && !disabled) {
            onSend(message.trim());
            setMessage('');
            setAttachments([]);
            // Reset textarea height
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };

    /**
     * Handles keyboard events
     * @param {React.KeyboardEvent} e - Keyboard event
     */
    const handleKeyDown = (e) => {
        // Send on Enter (without Shift)
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };



    /**
     * Removes an attachment
     * @param {string} id - Attachment ID
     */
    const removeAttachment = (id) => {
        setAttachments((prev) => prev.filter((att) => att.id !== id));
    };

    const isOverLimit = message.length > maxLength;
    const canSend = message.trim().length > 0 && !isOverLimit && !disabled;

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            {/* Attachments preview */}
            {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {attachments.map((att) => (
                        <div key={att.id} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-900">
                            <span className="max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap">{att.name}</span>
                            <button
                                type="button"
                                onClick={() => removeAttachment(att.id)}
                                className="w-[18px] h-[18px] rounded-full border-none bg-gray-200 text-gray-500 cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-red-500 hover:text-white"
                                aria-label={`Remove ${att.name}`}
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex items-end gap-2.5 bg-gray-50 border-2 border-gray-200 rounded-2xl px-3.5 py-2.5 transition-all duration-200 focus-within:border-gray-900 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(17,24,39,0.1)]">
                {/* Message input */}
                <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    disabled={disabled}
                    rows={1}
                    className={`flex-1 border-none bg-transparent text-gray-900 text-sm leading-normal resize-none min-h-6 max-h-[120px] py-1.5 outline-none placeholder:text-gray-500 ${
                        isOverLimit ? 'text-red-500' : ''
                    }`}
                    aria-label="Message input"
                    aria-invalid={isOverLimit}
                />

                {/* Character count */}
                {message.length > maxLength * 0.8 && (
                    <span className={`text-[11px] shrink-0 pb-1.5 ${
                        isOverLimit ? 'text-red-500' : 'text-gray-500'
                    }`}>
                        {message.length}/{maxLength}
                    </span>
                )}

                {/* Send button */}
                <button
                    type="submit"
                    disabled={!canSend}
                    className="w-9 h-9 rounded-[10px] border-none bg-gray-900 text-white cursor-pointer flex items-center justify-center transition-all duration-200 shrink-0 shadow-[0_2px_4px_rgba(0,0,0,0.1)] hover:bg-gray-800 hover:-translate-y-px hover:shadow-[0_4px_6px_rgba(0,0,0,0.15)] disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed disabled:transform-none focus-visible:outline-3 focus-visible:outline-gray-900 focus-visible:outline-offset-2"
                    aria-label="Send message"
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>
        </form>
    );
};

export default ChatInput;
