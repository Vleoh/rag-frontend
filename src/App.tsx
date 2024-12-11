import { ThemeProvider } from '@/components/theme-provider';
import Chat from '@/components/chat/chat';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="jph-theme">
      <Chat />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;