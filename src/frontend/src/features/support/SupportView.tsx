import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { ScrollArea } from '../../components/ui/scroll-area';
import { getSupportThreads, getUserThread, addSupportMessage, SupportThread } from '../../lib/storage/supportMessagingStorage';
import { useSession } from '../../state/session/useSession';
import { notify } from '../../components/feedback/notify';
import { ArrowLeft, MessageCircle, DollarSign, Calculator } from 'lucide-react';
import DashboardFooter from '../../components/layout/DashboardFooter';

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

  const handleMTLoanClick = () => {
    notify.info('MT-LOAN ফিচার শীঘ্রই আসছে');
  };

  const handleCalculatorClick = () => {
    notify.info('ক্যালকুলেটর শীঘ্রই আসছে');
  };

  if (isAdmin && !selectedThread) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Fixed Header */}
        <div className="fixed top-0 left-0 right-0 z-20 bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-6 shadow-xl">
          <div className="flex items-center gap-4">
            <Button 
              onClick={onBack}
              className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 px-4 py-2 rounded-xl font-bold"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              ফিরে যান
            </Button>
            <h1 className="text-xl font-bold text-white">সাপোর্ট ইনবক্স</h1>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pt-[100px] pb-24 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
          <div className="p-4">
            <Card className="shadow-xl border-2 border-blue-200">
              <CardContent className="pt-6">
                {threads.length === 0 ? (
                  <p className="text-center text-muted-foreground py-12 text-base">কোনো মেসেজ নেই</p>
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
                            <p className="font-bold text-base text-blue-900">{thread.userName}</p>
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
        </div>

        {/* Fixed Footer */}
        <div className="fixed bottom-0 left-0 right-0 z-20">
          <DashboardFooter 
            leftAction={{
              label: 'MT-LOAN',
              onClick: handleMTLoanClick,
              icon: DollarSign,
            }}
            centerAction={{
              label: 'সাপোর্ট',
              onClick: () => {},
              icon: MessageCircle,
            }}
            rightAction={{
              label: 'ক্যালকুলেটর',
              onClick: handleCalculatorClick,
              icon: Calculator,
            }}
          />
        </div>
      </div>
    );
  }

  const currentThread = isAdmin ? selectedThread : selectedThread;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-6 shadow-xl">
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
          <h1 className="text-xl font-bold text-white">
            {isAdmin && selectedThread ? selectedThread.userName : 'সাপোর্ট'}
          </h1>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pt-[100px] pb-48 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
        <div className="p-4">
          <Card className="shadow-xl border-2 border-blue-200">
            <CardContent className="pt-6">
              <ScrollArea className="h-[calc(100vh-400px)] pr-4 mb-4">
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
                          <p className="text-sm font-bold mb-1">
                            {msg.fromRole === 'admin' ? 'Admin' : msg.from}
                          </p>
                          <p className="text-base">{msg.message}</p>
                          <p className="text-xs mt-2 opacity-70">
                            {new Date(msg.timestamp).toLocaleString('bn-BD')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-12 text-base">
                    কোনো মেসেজ নেই। প্রথম মেসেজ পাঠান!
                  </p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Fixed Message Input Area */}
      <div className="fixed bottom-[72px] left-0 right-0 z-10 bg-white border-t-2 border-blue-200 shadow-xl p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex gap-3">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="মেসেজ লিখুন..."
              rows={2}
              className="flex-1 border-2 border-blue-300 focus:border-blue-500 rounded-xl resize-none"
            />
            <Button
              onClick={handleSendMessage}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold px-6 rounded-xl"
            >
              পাঠান
            </Button>
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-20">
        <DashboardFooter 
          leftAction={{
            label: 'MT-LOAN',
            onClick: handleMTLoanClick,
            icon: DollarSign,
          }}
          centerAction={{
            label: 'সাপোর্ট',
            onClick: () => {},
            icon: MessageCircle,
          }}
          rightAction={{
            label: 'ক্যালকুলেটর',
            onClick: handleCalculatorClick,
            icon: Calculator,
          }}
        />
      </div>
    </div>
  );
}
