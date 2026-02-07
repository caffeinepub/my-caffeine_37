import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { RadioGroup, RadioGroupItem } from '../../../components/ui/radio-group';
import { getCompanyReports, addCompanyReport, deleteCompanyReport, type ReportType, type CompanyReportEntry } from '../../../lib/storage/companyReportStorage';
import { notify } from '../../../components/feedback/notify';
import { ConfirmDialog } from '../../../components/feedback/ConfirmDialog';
import { useSingleConfirmSubmit } from '../../../hooks/useSingleConfirmSubmit';
import { Trash2 } from 'lucide-react';

export default function CompanyReportSection() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<ReportType>('taken');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [reports, setReports] = useState<CompanyReportEntry[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { isSaving, showConfirm, setShowConfirm, handleSubmit: handleConfirmSubmit } = useSingleConfirmSubmit(
    async () => {
      await saveReport();
    }
  );

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = () => {
    const allReports = getCompanyReports();
    setReports(allReports.sort((a, b) => b.timestamp - a.timestamp));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || Number(amount) <= 0) {
      notify.error('সঠিক পরিমাণ লিখুন');
      return;
    }

    setShowConfirm(true);
  };

  const saveReport = async () => {
    addCompanyReport({
      date,
      type,
      amount: Number(amount),
      note,
    });

    setAmount('');
    setNote('');
    loadReports();
    notify.success('রিপোর্ট সফলভাবে যোগ করা হয়েছে');
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteCompanyReport(deleteId);
    loadReports();
    setDeleteId(null);
    notify.success('রিপোর্ট মুছে ফেলা হয়েছে');
  };

  const takenReports = reports.filter((r) => r.type === 'taken');
  const dueReports = reports.filter((r) => r.type === 'due');

  const totalTaken = takenReports.reduce((sum, r) => sum + r.amount, 0);
  const totalDue = dueReports.reduce((sum, r) => sum + r.amount, 0);
  const netBalance = totalTaken - totalDue;

  return (
    <>
      <div className="space-y-6">
        <Card className="border-purple-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500">
            <CardTitle className="text-lg text-white">নতুন রিপোর্ট যোগ করুন</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">তারিখ</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="border-2"
                />
              </div>

              <div className="space-y-2">
                <Label>রিপোর্ট টাইপ</Label>
                <RadioGroup value={type} onValueChange={(v) => setType(v as ReportType)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="taken" id="taken" />
                    <Label htmlFor="taken" className="cursor-pointer">নেওয়া</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="due" id="due" />
                    <Label htmlFor="due" className="cursor-pointer">পাওনা</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">পরিমাণ (৳)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="border-2"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">নোট</Label>
                <Textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="border-2"
                  rows={3}
                />
              </div>

              <Button 
                type="submit" 
                disabled={isSaving}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3"
              >
                {isSaving ? 'সংরক্ষণ করা হচ্ছে...' : 'জমা দিন'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Summary Card */}
        <Card className="border-purple-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100">
            <CardTitle className="text-lg text-purple-900">সারাংশ</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">মোট নেওয়া:</span>
                <span className="text-lg font-bold text-green-700">৳{totalTaken.toFixed(0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">মোট পাওনা:</span>
                <span className="text-lg font-bold text-red-700">৳{totalDue.toFixed(0)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t-2">
                <span className="text-base font-bold">নেট ব্যালেন্স:</span>
                <span className={`text-xl font-bold ${netBalance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  ৳{netBalance.toFixed(0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Taken Reports */}
        <Card className="border-green-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500">
            <CardTitle className="text-lg text-white">নেওয়া রিপোর্ট</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>তারিখ</TableHead>
                    <TableHead className="text-right">পরিমাণ</TableHead>
                    <TableHead>নোট</TableHead>
                    <TableHead className="text-center">অ্যাকশন</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {takenReports.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                        কোনো এন্ট্রি নেই
                      </TableCell>
                    </TableRow>
                  ) : (
                    takenReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.date}</TableCell>
                        <TableCell className="text-right font-bold text-green-700">
                          ৳{report.amount.toFixed(0)}
                        </TableCell>
                        <TableCell className="text-sm">{report.note || '-'}</TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteId(report.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Due Reports */}
        <Card className="border-red-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-red-500 to-rose-500">
            <CardTitle className="text-lg text-white">পাওনা রিপোর্ট</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>তারিখ</TableHead>
                    <TableHead className="text-right">পরিমাণ</TableHead>
                    <TableHead>নোট</TableHead>
                    <TableHead className="text-center">অ্যাকশন</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dueReports.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                        কোনো এন্ট্রি নেই
                      </TableCell>
                    </TableRow>
                  ) : (
                    dueReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.date}</TableCell>
                        <TableCell className="text-right font-bold text-red-700">
                          ৳{report.amount.toFixed(0)}
                        </TableCell>
                        <TableCell className="text-sm">{report.note || '-'}</TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteId(report.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="নিশ্চিত করুন"
        description="আপনি কি এই রিপোর্ট সংরক্ষণ করতে চান?"
        onConfirm={handleConfirmSubmit}
        confirmText="হ্যাঁ, সংরক্ষণ করুন"
        cancelText="না"
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="রিপোর্ট মুছুন"
        description="আপনি কি নিশ্চিত যে আপনি এই রিপোর্ট মুছে ফেলতে চান?"
        onConfirm={handleDelete}
        confirmText="হ্যাঁ, মুছুন"
        cancelText="না"
        variant="destructive"
      />
    </>
  );
}
