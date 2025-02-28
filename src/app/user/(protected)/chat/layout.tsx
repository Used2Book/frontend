import React from "react";
import ChatList from "./components/chat-list";
const ChatLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex overflow-hidden">
            <div className="w-1/4">
                <ChatList />
            </div>

            {/* Page Content */}
            <div className="w-3/4 overflow-y-auto">
                {children}
            </div>
        </div>
    );

};

export default ChatLayout;
