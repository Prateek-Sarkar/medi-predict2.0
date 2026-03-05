
import { ShieldAlert } from 'lucide-react';
import { ChatUI } from '../components/ChatUI';
import './Assistant.css';

export function Assistant() {
    return (
        <div className="ast-page page-enter">
            {/* Slim disclaimer */}
            <div className="ast-disclaimer-bar">
                <ShieldAlert size={14} />
                <span>This assistant provides general educational information only — not medical advice. Always consult a qualified professional.</span>
            </div>

            <div className="ast-layout">
                <div className="ast-header">
                    <div className="ast-hero-label"><span className="dot" />AI-Powered Chat</div>
                    <h1>Vision <em>assistant</em></h1>
                    <p className="ast-hero-sub">Ask questions about eye health, conditions, and what our AI screening detects.</p>
                </div>
                <ChatUI />
            </div>
        </div>
    );
}
