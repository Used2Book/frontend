import { MessageSquareMore } from "lucide-react";

export default function ChatPage(){
    return (
        <div className="h-screen flex justify-center items-center">
            {/* Chat Page */}
            <div className="flex w-full justify-center items-center">
            <MessageSquareMore color="gray" size="50"/>
            {process.env.CHAT_SERVICE_URL}
            </div>
      </div>
    );
}