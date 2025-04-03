// src/types/chat.ts
export interface Message {
    senderId: string;
    receiverId: string;
    content: string;
    chatId: string;
    timestamp: string;
}

export interface Chat {
    id: string;
    lastMessage: Message;
}