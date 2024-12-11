import { useState } from 'react';
import { MessageSquare, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import ChatSidebar from './chat-sidebar';
import ChatMessages from './chat-messages';
import ChatInput from './chat-input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Modal from '@/components/ui/modal';

export type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export type Chat = {
  id: string;
  title: string;
  messages: Message[];
};

export default function Chat() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'Nuevo Chat',
      messages: [],
    };
    setChats(prevChats => [...prevChats, newChat]);
    setCurrentChat(newChat);
  };

  const updateChatTitle = (chatId: string, messages: Message[]) => {
    if (messages.length === 1) {
      const title = messages[0].content.slice(0, 30) + (messages[0].content.length > 30 ? '...' : '');
      setChats(chats.map(chat => 
        chat.id === chatId ? { ...chat, title } : chat
      ));
    }
  };

  const editChatTitle = (chatId: string) => {
    setEditingChatId(chatId);
    setModalTitle("Editar título del chat");
    setModalContent(
      <div className="space-y-4">
        <input
          type="text"
          className="w-full p-2 border rounded dark:bg-zinc-800 dark:border-zinc-700"
          defaultValue={chats.find(chat => chat.id === chatId)?.title}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const newTitle = e.currentTarget.value;
              if (newTitle.trim()) {
                setChats(chats.map(chat => 
                  chat.id === chatId ? { ...chat, title: newTitle } : chat
                ));
                setIsModalOpen(false);
              }
            }
          }}
        />
        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 text-sm bg-zinc-100 rounded hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
            onClick={() => setIsModalOpen(false)}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={(e) => {
              const input = e.currentTarget.parentElement?.parentElement?.querySelector('input');
              const newTitle = input?.value;
              if (newTitle?.trim()) {
                setChats(chats.map(chat => 
                  chat.id === chatId ? { ...chat, title: newTitle } : chat
                ));
                setIsModalOpen(false);
              }
            }}
          >
            Guardar
          </button>
        </div>
      </div>
    );
    setIsModalOpen(true);
  };

  const deleteChat = (chatId: string) => {
    setModalTitle("Eliminar chat");
    setModalContent(
      <div className="space-y-4">
        <p>¿Estás seguro de que deseas eliminar este chat?</p>
        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 text-sm bg-zinc-100 rounded hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
            onClick={() => setIsModalOpen(false)}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => {
              setChats(chats.filter(chat => chat.id !== chatId));
              if (currentChat?.id === chatId) {
                setCurrentChat(null);
              }
              setIsModalOpen(false);
            }}
          >
            Eliminar
          </button>
        </div>
      </div>
    );
    setIsModalOpen(true);
  };

  const handleSend = async (message: string) => {
    if (!currentChat) return;
  
    const updatedChat = {
      ...currentChat,
      messages: [
        ...currentChat.messages,
        { role: 'user' as 'user', content: message } // Asegurarse de que el tipo sea correcto
      ]
    };
  
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === currentChat.id ? updatedChat : chat
      )
    );
    setCurrentChat(updatedChat);
  
    try {
      const response = await fetch('http://localhost:5004/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          original_query: message,
          context: {},
        }),
      });
  
      if (!response.ok) throw new Error('Failed to get response');
  
      const data = await response.json();
      const finalChat = {
        ...updatedChat,
        messages: [
          ...updatedChat.messages,
          { role: 'assistant' as 'assistant', content: data.response } // Asegurarse de que el tipo sea correcto
        ]
      };
  
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === currentChat.id ? finalChat : chat
        )
      );
      setCurrentChat(finalChat);
  
      if (updatedChat.messages.length === 1) {
        updateChatTitle(currentChat.id, updatedChat.messages);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <ChatSidebar
        chats={chats}
        currentChat={currentChat}
        setCurrentChat={setCurrentChat}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        editChatTitle={editChatTitle}
        deleteChat={deleteChat}
        createNewChat={createNewChat}
      />
      
      <main className="flex-1 flex flex-col h-full relative bg-background">
        {/* Header móvil */}
        <div className="flex items-center gap-2 p-4 border-b lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
          <span className="font-semibold">Chat</span>
        </div>

        {/* Contenedor principal del chat */}
        <div className="flex-1 flex flex-col w-full">
          {currentChat ? (
            <>
              {/* Área de mensajes */}
              <div className="flex-1 overflow-hidden">
                <ChatMessages messages={currentChat.messages} />
              </div>
              
              {/* Input del chat */}
              <div className="border-t">
                <div className="max-w-4xl mx-auto px-4 py-4 w-full">
                  <ChatInput 
                    onSend={handleSend}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center flex-col gap-4 p-8">
              <div className="flex flex-col items-center gap-2 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground" />
                <h2 className="text-2xl font-semibold">Comienza una nueva conversación</h2>
                <p className="text-muted-foreground max-w-sm">
                  Inicia un nuevo chat o selecciona una conversación anterior del menú lateral.
                </p>
              </div>
              <Button onClick={createNewChat} className="gap-2">
                <Plus className="h-4 w-4" />
                Nuevo Chat
              </Button>
            </div>
          )}
        </div>
      </main>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
      >
        {modalContent}
      </Modal>
    </div>
  );
}