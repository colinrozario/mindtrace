/**
 * @fileoverview Quick action buttons component for predefined chat actions.
 */

import { useState } from 'react';
import { Sparkles, ChevronUp, ChevronDown } from 'lucide-react';

/**
 * Quick action buttons component
 * @param {Object} props
 * @param {import('../../types/chat.types').QuickAction[]} props.actions - Array of quick actions
 * @param {function(string): void} props.onAction - Callback when an action is clicked
 * @param {boolean} [props.disabled] - Whether buttons are disabled
 * @param {boolean} [props.hasMessages] - Whether there are messages in the chat
 * @returns {JSX.Element}
 */
const QuickActions = ({ actions, onAction, disabled = false, hasMessages = false }) => {
    const [isExpanded, setIsExpanded] = useState(!hasMessages);

    if (!actions || actions.length === 0) return null;

    return (
        <div className="w-full" role="group" aria-label="Quick actions">
            <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center justify-between w-full text-xs font-medium text-gray-600 mb-3 px-1 hover:text-gray-800 transition-colors cursor-pointer"
                aria-expanded={isExpanded}
                aria-controls="quick-actions-list"
            >
                <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Suggested</span>
                </div>
                {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                ) : (
                    <ChevronDown className="w-4 h-4" />
                )}
            </button>
            {isExpanded && (
                <div 
                    id="quick-actions-list"
                    className="grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2 duration-200"
                >
                    {actions.map((action) => (
                        <button
                            key={action.id}
                            type="button"
                            onClick={() => onAction(action.message)}
                            disabled={disabled}
                            className="px-3.5 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-[13px] font-medium text-left cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200 disabled:hover:shadow-none"
                            aria-label={action.label}
                        >
                            <span className="block truncate">{action.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default QuickActions;
