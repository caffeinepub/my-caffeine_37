import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Badge } from '../../../components/ui/badge';
import { notify } from '../../../components/feedback/notify';
import { ConfirmDialog } from '../../../components/feedback/ConfirmDialog';
import { safeGetItem, safeSetItem, subscribeToStorageUpdates } from '../../../lib/storage/safeStorage';
import { ensureUserIds } from '../../../lib/storage/userIdStorage';
import type { PendingRequest } from '../../../state/session/sessionTypes';

export default function ApprovalsSection() {
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [confirmAction, setConfirmAction] = useState<{ type: 'approve' | 'reject'; request: PendingRequest } | null>(null);

  useEffect(() => {
    loadPendingRequests();

    const unsubscribe = subscribeToStorageUpdates(() => {
      loadPendingRequests();
    });

    return unsubscribe;
  }, []);

  const loadPendingRequests = () => {
    const pending = safeGetItem<PendingRequest[]>('pending_reqs', []);
    const normalized = Array.isArray(pending) ? pending : [];
    setPendingRequests(normalized);
  };

  const handleApproveClick = (request: PendingRequest) => {
    setConfirmAction({ type: 'approve', request });
  };

  const handleRejectClick = (request: PendingRequest) => {
    setConfirmAction({ type: 'reject', request });
  };

  const handleConfirmAction = () => {
    if (!confirmAction) return;

    const { type, request } = confirmAction;

    if (type === 'approve') {
      handleApprove(request);
    } else {
      handleReject(request);
    }

    setConfirmAction(null);
  };

  const handleApprove = (request: PendingRequest) => {
    const approved = safeGetItem<PendingRequest[]>('approved_users', []);
    const pending = safeGetItem<PendingRequest[]>('pending_reqs', []);

    // Add to approved
    const newApproved = [...approved, request];
    safeSetItem('approved_users', newApproved);

    // Remove from pending using stable userId or fallback to mob
    const identifier = request.userId ?? request.mob;
    const newPending = pending.filter((p) => {
      const pId = p.userId ?? p.mob;
      return pId !== identifier;
    });
    safeSetItem('pending_reqs', newPending);

    // Ensure user IDs are assigned
    ensureUserIds();

    notify.success('ইউজার অনুমোদিত হয়েছে');
    loadPendingRequests();
  };

  const handleReject = (request: PendingRequest) => {
    const pending = safeGetItem<PendingRequest[]>('pending_reqs', []);

    // Remove from pending using stable userId or fallback to mob
    const identifier = request.userId ?? request.mob;
    const newPending = pending.filter((p) => {
      const pId = p.userId ?? p.mob;
      return pId !== identifier;
    });
    safeSetItem('pending_reqs', newPending);

    notify.success('ইউজার প্রত্যাখ্যান করা হয়েছে');
    loadPendingRequests();
  };

  return (
    <>
      <Card>
        <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500">
          <CardTitle className="text-lg text-white">পেন্ডিং রিকুয়েস্ট</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {pendingRequests.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">কোনো পেন্ডিং রিকুয়েস্ট নেই</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>মোবাইল</TableHead>
                    <TableHead>স্ট্যাটাস</TableHead>
                    <TableHead className="text-center">অ্যাকশন</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingRequests.map((request) => (
                    <TableRow key={request.userId ?? request.mob}>
                      <TableCell className="font-medium">{request.mob}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                          পেন্ডিং
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleApproveClick(request)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          অনুমোদন
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRejectClick(request)}
                        >
                          প্রত্যাখ্যান
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!confirmAction}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        title={confirmAction?.type === 'approve' ? 'অনুমোদন নিশ্চিত করুন' : 'প্রত্যাখ্যান নিশ্চিত করুন'}
        description={
          confirmAction?.type === 'approve'
            ? `আপনি কি নিশ্চিত যে আপনি ${confirmAction.request.mob} কে অনুমোদন করতে চান?`
            : `আপনি কি নিশ্চিত যে আপনি ${confirmAction?.request.mob} কে প্রত্যাখ্যান করতে চান?`
        }
        onConfirm={handleConfirmAction}
        confirmText={confirmAction?.type === 'approve' ? 'হ্যাঁ, অনুমোদন করুন' : 'হ্যাঁ, প্রত্যাখ্যান করুন'}
        cancelText="না"
        variant={confirmAction?.type === 'approve' ? 'default' : 'destructive'}
      />
    </>
  );
}
