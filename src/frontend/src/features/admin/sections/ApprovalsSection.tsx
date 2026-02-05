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
    loadRequests();
  }, []);

  const loadRequests = () => {
    const requests = safeGetArray<PendingRequest>('pending_reqs');
    setPendingRequests(requests);
  };

  const handleApprove = (index: number) => {
    try {
      const request = pendingRequests[index];
      
      // Get approved users as array (new format)
      const approvedUsers = safeGetArray<ApprovedUser>('approved_users');
      
      // Check for duplicates by mobile (primary unique identifier)
      const mobileExists = approvedUsers.some((u) => u.mob === request.mob);
      if (mobileExists) {
        notify.error('এই মোবাইল নম্বর দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট আছে');
        return;
      }

      // Check for duplicates by name (also unique)
      const nameExists = approvedUsers.some((u) => u.name === request.name);
      if (nameExists) {
        notify.error('এই নাম দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট আছে');
        return;
      }

      // Add to approved users array
      approvedUsers.push({
        name: request.name,
        mob: request.mob,
        pass: request.pass,
      });
      safeSetItem('approved_users', approvedUsers);

      // Add to workers list
      const workers = safeGetArray<string>('workers');
      if (!workers.includes(request.name)) {
        workers.push(request.name);
        safeSetItem('workers', workers);

        // Initialize rates for the worker
        const rates = safeGetArray<Record<string, { s: number; d: number }>>('rates');
        const ratesObj = rates.length > 0 && typeof rates[0] === 'object' ? rates[0] : {};
        ratesObj[request.name] = { s: 0, d: 0 };
        safeSetItem('rates', ratesObj);
      }

      // Remove from pending requests
      const updatedRequests = pendingRequests.filter((_, i) => i !== index);
      setPendingRequests(updatedRequests);
      safeSetItem('pending_reqs', updatedRequests);

      notify.success(`${request.name} সফলভাবে অনুমোদিত হয়েছে`);
      onApprovalChange();
    } catch (error) {
      console.error('Approval error:', error);
      notify.error('অনুমোদন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    }
  };

  if (pendingRequests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">কোনো পেন্ডিং রিকোয়েস্ট নেই</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingRequests.map((request, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{request.name}</TableCell>
                <TableCell>{request.mob}</TableCell>
                <TableCell className="text-center">
                  <Button
                    onClick={() => handleApprove(index)}
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    Approve
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
