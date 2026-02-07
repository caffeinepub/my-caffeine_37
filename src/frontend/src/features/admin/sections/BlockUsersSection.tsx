import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Badge } from '../../../components/ui/badge';
import { notify } from '../../../components/feedback/notify';
import { ConfirmDialog } from '../../../components/feedback/ConfirmDialog';
import { useActor } from '../../../hooks/useActor';
import { Shield, ShieldOff, Search } from 'lucide-react';
import type { UserApprovalInfo } from '../../../backend';

export default function BlockUsersSection() {
  const { actor } = useActor();
  const [users, setUsers] = useState<UserApprovalInfo[]>([]);
  const [blockedStatus, setBlockedStatus] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ type: 'block' | 'unblock'; user: UserApprovalInfo } | null>(null);

  useEffect(() => {
    loadUsers();
  }, [actor]);

  const loadUsers = async () => {
    if (!actor) return;
    
    setLoading(true);
    try {
      const approvals = await actor.listApprovals();
      const approvedUsers = approvals.filter(u => u.status === 'approved');
      setUsers(approvedUsers);

      // Load block status for each user
      const statusMap: Record<string, boolean> = {};
      for (const user of approvedUsers) {
        const blocked = await actor.isUserBlocked(user.principal);
        statusMap[user.principal.toString()] = blocked;
      }
      setBlockedStatus(statusMap);
    } catch (error) {
      console.error('Error loading users:', error);
      notify.error('ইউজার লোড করতে ব্যর্থ');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockClick = (user: UserApprovalInfo) => {
    setConfirmAction({ type: 'block', user });
  };

  const handleUnblockClick = (user: UserApprovalInfo) => {
    setConfirmAction({ type: 'unblock', user });
  };

  const handleConfirmAction = async () => {
    if (!confirmAction || !actor) return;

    const { type, user } = confirmAction;

    try {
      if (type === 'block') {
        await actor.blockUser(user.principal);
        notify.success('ইউজার ব্লক করা হয়েছে');
      } else {
        await actor.unblockUser(user.principal);
        notify.success('ইউজার আনব্লক করা হয়েছে');
      }
      
      // Refresh block status
      await loadUsers();
    } catch (error) {
      console.error('Error updating block status:', error);
      notify.error('অপারেশন ব্যর্থ হয়েছে');
    }

    setConfirmAction(null);
  };

  const filteredUsers = users.filter(user => 
    user.principal.toString().toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Card>
        <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500">
          <CardTitle className="text-lg text-white">ইউজার ব্লক ম্যানেজমেন্ট</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="প্রিন্সিপাল দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {loading ? (
            <p className="text-center text-muted-foreground py-8">লোড হচ্ছে...</p>
          ) : filteredUsers.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">কোনো অনুমোদিত ইউজার নেই</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>প্রিন্সিপাল</TableHead>
                    <TableHead>স্ট্যাটাস</TableHead>
                    <TableHead className="text-center">অ্যাকশন</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => {
                    const principalStr = user.principal.toString();
                    const isBlocked = blockedStatus[principalStr];
                    
                    return (
                      <TableRow key={principalStr}>
                        <TableCell className="font-mono text-xs">
                          {principalStr.slice(0, 20)}...
                        </TableCell>
                        <TableCell>
                          {isBlocked ? (
                            <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-300">
                              <ShieldOff className="w-3 h-3 mr-1" />
                              ব্লকড
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                              <Shield className="w-3 h-3 mr-1" />
                              অ্যাক্টিভ
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {isBlocked ? (
                            <Button
                              size="sm"
                              onClick={() => handleUnblockClick(user)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              আনব্লক
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleBlockClick(user)}
                            >
                              ব্লক
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!confirmAction}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        title={confirmAction?.type === 'block' ? 'ব্লক নিশ্চিত করুন' : 'আনব্লক নিশ্চিত করুন'}
        description={
          confirmAction?.type === 'block'
            ? 'আপনি কি নিশ্চিত যে আপনি এই ইউজারকে ব্লক করতে চান? ব্লক করা ইউজার অ্যাপ অ্যাক্সেস করতে পারবে না।'
            : 'আপনি কি নিশ্চিত যে আপনি এই ইউজারকে আনব্লক করতে চান?'
        }
        onConfirm={handleConfirmAction}
        confirmText={confirmAction?.type === 'block' ? 'হ্যাঁ, ব্লক করুন' : 'হ্যাঁ, আনব্লক করুন'}
        cancelText="না"
        variant={confirmAction?.type === 'block' ? 'destructive' : 'default'}
      />
    </>
  );
}
