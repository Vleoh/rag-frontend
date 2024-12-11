import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User } from 'lucide-react';
import type { Message } from './chat';
import { cn } from '@/lib/utils';

export default function ChatMessages({ messages }: { messages: Message[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <ScrollArea className="h-full w-full">
      <div className="flex flex-col gap-6 pb-4 w-full">
        {messages.map((message, i) => (
          <div
            key={i}
            className={cn(
              "flex gap-4 w-full px-4",
              message.role === 'assistant' ? "bg-muted/50 py-4" : "py-2"
            )}
          >
            <div className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
              message.role === 'assistant' ? "bg-primary/10" : "bg-secondary"
            )}>
              {message.role === 'user' ? (
                <User className="h-4 w-4" />
              ) : (
                <Bot className="h-4 w-4" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-foreground mb-1">
                {message.role === 'user' ? 'Tú' : 'JPH-IA'}
              </div>
              <div className="text-sm whitespace-pre-wrap break-words">
                {message.content}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}