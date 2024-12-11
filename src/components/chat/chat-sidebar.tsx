import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { ChevronLeft, MessageSquare, Plus, Cat, Sticker, Pencil, X } from 'lucide-react';
import type { Chat } from './chat';

type ChatSidebarProps = {
  chats: Chat[];
  currentChat: Chat | null;
  setCurrentChat: (chat: Chat) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  editChatTitle: (id: string) => void;
  deleteChat: (id: string) => void;
  createNewChat: () => void;
};

export default function ChatSidebar({
  chats,
  currentChat,
  setCurrentChat,
  open,
  setOpen,
  editChatTitle,
  deleteChat,
  createNewChat,
}: ChatSidebarProps) {
  return (
    <>
      <div
        className={cn(
          'fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden',
          open ? 'block' : 'hidden'
        )}
        onClick={() => setOpen(false)}
      />
      <div
        className={cn(
          'fixed inset-y-0 left-0 bg-black/90 w-72 z-50 flex flex-col gap-4 p-4 transition-transform duration-300 lg:transform-none lg:relative border-r',
          !open && '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            {/* <Cat className="h-8 w-8" />  */}
            <Sticker className="h-8 w-8" /> 
            <span className="font-bold text-xl">JPH-IA</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen(false)}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>

        <Button
          variant="secondary"
          className="gap-2 w-full"
          onClick={() => createNewChat()}
        >
          <Plus className="h-4 w-4" />
          Nuevo Chat
        </Button>

        <ScrollArea className="flex-1 -mx-4">
          <div className="flex flex-col gap-2 p-4">
            {[...chats].reverse().map((chat) => (
              <div key={chat.id} className="flex items-center justify-between gap-2">
                <Button
                  variant={currentChat?.id === chat.id ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start text-left truncate max-w-[160px]',
                    currentChat?.id === chat.id && 'bg-accent'
                  )}
                  onClick={() => {
                    setCurrentChat(chat);
                    setOpen(false);
                  }}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span className="truncate">{chat.title}</span>
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => editChatTitle(chat.id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => deleteChat(chat.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'fixed left-4 top-4 z-50 lg:hidden',
          open && 'hidden'
        )}
        onClick={() => setOpen(true)}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
    </>
  );
}