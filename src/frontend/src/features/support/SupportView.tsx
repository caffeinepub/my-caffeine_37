import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { ScrollArea } from '../../components/ui/scroll-area';
import { getSupportThreads, getUserThread, addSupportMessage, SupportThread } from '../../lib/storage/supportMessagingStorage';
import { useSession } from '../../state/session/useSession';
import { notify } from '../../components/feedback/notify';
import { ArrowLeft } from 'lucide-react';

interface SupportViewProps {
  onBack: () => void;
}

export default function SupportView({ onBack }: SupportViewProps) {
  const { session } = useSession();
  const isAdmin = session?.role === 'admin';
  const [message, setMessage] = useState('');
  const [threads, setThreads] = useState<SupportThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<SupportThread | null>(null);

  useEffect(() => {
    loadThreads();
  }, []);

  const loadThreads = () => {
    if (isAdmin) {
      setThreads(getSupportThreads().sort((a, b) => b.lastMessageTime - a.lastMessageTime));
    } else if (session?.userName) {
      const thread = getUserThread(session.userName);
      setSelectedThread(thread);
    }
  };

  const handleSendMessage = () => {
    if (!message.trim()) {
      notify.error('মেসেজ লিখুন');
      return;
    }

    if (isAdmin && selectedThread) {
      addSupportMessage(selectedThread.userId, selectedThread.userName, message, 'admin');
    } else if (session?.userName) {
      addSupportMessage(session.userName, session.userName, message, 'user');
    }

    setMessage('');
    loadThreads();
    notify.success('মেসেজ পাঠানো হয়েছে');
  };

  if (isAdmin && !selectedThread) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-4">
        <Card className="shadow-xl border-2 border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600">
            <div className="flex items-center gap-4">
              <Button 
                onClick={onBack}
                className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 px-4 py-2 rounded-xl font-bold"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                ফিরে যান
              </Button>
              <CardTitle className="text-white text-xl">সাপোর্ট ইনবক্স</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {threads.length === 0 ? (
              <p className="text-center text-muted-foreground py-12 text-lg">কোনো মেসেজ নেই</p>
            ) : (
              <div className="space-y-3">
                {threads.map((thread) => (
                  <button
                    key={thread.userId}
                    onClick={() => setSelectedThread(thread)}
                    className="w-full text-left p-5 border-2 rounded-xl hover:bg-blue-50 hover:border-blue-400 transition-all shadow-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-lg text-blue-900">{thread.userName}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {thread.messages[thread.messages.length - 1]?.message.slice(0, 50)}...
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(thread.lastMessageTime).toLocaleDateString('bn-BD')}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentThread = isAdmin ? selectedThread : selectedThread;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-4">
      <Card className="h-[calc(100vh-2rem)] flex flex-col shadow-xl border-2 border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => {
                if (isAdmin && selectedThread) {
                  setSelectedThread(null);
                } else {
                  onBack();
                }
              }}
              className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 px-4 py-2 rounded-xl font-bold"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              ফিরে যান
            </Button>
            <CardTitle className="text-white text-xl">
              {isAdmin && selectedThread ? selectedThread.userName : 'সাপোর্ট'}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col pt-6">
          <ScrollArea className="flex-1 pr-4 mb-4">
            {currentThread && currentThread.messages.length > 0 ? (
              <div className="space-y-4">
                {currentThread.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.fromRole === 'admin' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 shadow-md ${
                        msg.fromRole === 'admin'
                          ? 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white'
                          : 'bg-white border-2 border-blue-200 text-slate-900'
                      }`}
                    >
                      <p className="text-sm font-bold mb-1">{msg.from}</p>
                      <p className="text-base">{msg.message}</p>
                      <p className="text-xs opacity-70 mt-2">
                        {new Date(msg.timestamp).toLocaleString('bn-BD')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-12 text-lg">
                কোনো মেসেজ নেই। প্রথম মেসেজ পাঠান।
              </p>
            )}
          </ScrollArea>

          <div className="flex gap-3">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="মেসেজ লিখুন..."
              rows={3}
              className="flex-1 border-2 border-blue-300 focus:border-blue-500"
            />
            <Button 
              onClick={handleSendMessage}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 font-bold px-6"
            >
              পাঠান
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
