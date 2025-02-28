export default function ChatPage(){
    return (
        <div className="flex justify-center item-center">
            Chat Page
            {process.env.CHAT_SERVICE_URL}
      </div>
    );
}