import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { safeGetArray, safeSetItem } from '../../../lib/storage/safeStorage';
import { notify } from '../../../components/feedback/notify';
import { PendingRequest, ApprovedUser } from '../../../state/session/sessionTypes';

interface ApprovalsSectionProps {
  onApprovalChange: () => void;
}

export default function ApprovalsSection({ onApprovalChange }: ApprovalsSectionProps) {
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);

  useEffect(() => {
    loadPendingRequests();
  }, []);

  const loadPendingRequests = () => {
    const requests = safeGetArray<PendingRequest>('pending_reqs');
    setPendingRequests(requests);
  };

  const handleApprove = (request: PendingRequest) => {
    try {
      // Check for duplicate mobile in approved users
      const approvedUsers = safeGetArray<ApprovedUser>('approved_users');
      const mobileExists = approvedUsers.some((user) => user.mob === request.mob);
      
      if (mobileExists) {
        notify.error('এই মোবাইল নম্বর দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট আছে');
        return;
      }

      // Check for duplicate name in approved users
      const nameExists = approvedUsers.some((user) => user.name === request.name);
      
      if (nameExists) {
        notify.error('এই নাম দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট আছে');
        return;
      }

      // Add to approved users with the pre-assigned userId from the pending request
      const newUser: ApprovedUser = {
        name: request.name,
        mob: request.mob,
        pass: request.pass,
        userId: request.userId // Preserve the registration-order ID
      };
      approvedUsers.push(newUser);
      safeSetItem('approved_users', approvedUsers);

      // Remove from pending requests
      const updatedRequests = pendingRequests.filter((req) => req.mob !== request.mob);
      setPendingRequests(updatedRequests);
      safeSetItem('pending_reqs', updatedRequests);

      // Initialize worker account
      const accounts = JSON.parse(localStorage.getItem('accounts') || '{}');
      if (!accounts[request.name]) {
        accounts[request.name] = { bill: 0, cost: 0 };
        localStorage.setItem('accounts', JSON.stringify(accounts));
      }

      notify.success(`${request.name} কে অনুমোদন করা হয়েছে`);
      onApprovalChange();
    } catch (error) {
      console.error('Approval error:', error);
      notify.error('অনুমোদন ব্যর্থ হয়েছে');
    }
  };

  const handleReject = (request: PendingRequest) => {
    try {
      const updatedRequests = pendingRequests.filter((req) => req.mob !== request.mob);
      setPendingRequests(updatedRequests);
      safeSetItem('pending_reqs', updatedRequests);
      notify.success(`${request.name} এর রিকোয়েস্ট বাতিল করা হয়েছে`);
      onApprovalChange();
    } catch (error) {
      console.error('Rejection error:', error);
      notify.error('বাতিল করা ব্যর্থ হয়েছে');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>পেন্ডিং রেজিস্ট্রেশন রিকোয়েস্ট</CardTitle>
      </CardHeader>
      <CardContent>
        {pendingRequests.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">কোনো পেন্ডিং রিকোয়েস্ট নেই</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>নাম</TableHead>
                  <TableHead>মোবাইল</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead className="text-right">অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingRequests.map((request, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{request.name}</TableCell>
                    <TableCell>{request.mob}</TableCell>
                    <TableCell>{request.userId || 'N/A'}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(request)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        অনুমোদন
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(request)}
                      >
                        বাতিল
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
  );
}
