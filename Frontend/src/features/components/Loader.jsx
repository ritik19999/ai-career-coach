import React from "react";
// import "../styles/thinkingLoader.scss";

export default function ThinkingLoader({ text = "AI is thinking" }) {
    return (
        <div className="thinking-wrapper">
            <div className="thinking-bubble">
                <span className="text">{text}</span>
                <span className="dots">
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                </span>
            </div>
        </div>
    );
}