import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { safeGetItem, safeSetItem } from '../../../lib/storage/safeStorage';
import { notify } from '../../../components/feedback/notify';

interface PendingRequest {
  name: string;
  mob: string;
  pass: string;
}

interface ApprovalsSectionProps {
  onApprovalChange: () => void;
}

export default function ApprovalsSection({ onApprovalChange }: ApprovalsSectionProps) {
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    const requests = safeGetItem<PendingRequest[]>('pending_reqs', []) || [];
    setPendingRequests(requests);
  };

  const handleApprove = (index: number) => {
    const request = pendingRequests[index];
    
    const approvedUsers = safeGetItem<Record<string, PendingRequest>>('approved_users', {}) || {};
    approvedUsers[request.name] = request;
    safeSetItem('approved_users', approvedUsers);

    const workers = safeGetItem<string[]>('workers', []) || [];
    if (!workers.includes(request.name)) {
      workers.push(request.name);
      safeSetItem('workers', workers);

      const rates = safeGetItem<Record<string, { s: number; d: number }>>('rates', {}) || {};
      rates[request.name] = { s: 0, d: 0 };
      safeSetItem('rates', rates);
    }

    const updatedRequests = pendingRequests.filter((_, i) => i !== index);
    setPendingRequests(updatedRequests);
    safeSetItem('pending_reqs', updatedRequests);

    notify.success(`${request.name} approved successfully`);
    onApprovalChange();
  };

  if (pendingRequests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">No pending requests</p>
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
