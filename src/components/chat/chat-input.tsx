import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SendHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

type ChatInputProps = {
  onSend: (message: string) => void;
  className?: string;
};

export default function ChatInput({ onSend, className }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isLoading) return;

    try {
      setIsLoading(true);
      await onSend(trimmedMessage);
      setMessage('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <Textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Escribe tu mensaje... (Presiona Enter para enviar)"
        className="min-h-[60px] w-full resize-none bg-background pr-12 py-4 rounded-lg focus-visible:ring-1"
        disabled={isLoading}
        rows={1}
        maxLength={4000}
      />
      <Button
        type="submit"
        size="icon"
        disabled={!message.trim() || isLoading}
        className={cn(
          "absolute right-2 top-[50%] transform -translate-y-1/2 transition-all",
          message.trim() ? "opacity-100" : "opacity-50"
        )}
      >
        <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-4 border-b-black" />
      </Button>
    </form>
  );
}