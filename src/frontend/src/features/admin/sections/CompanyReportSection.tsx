import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { addCompanyReport, getReportsByType, ReportType, CompanyReportEntry } from '../../../lib/storage/companyReportStorage';
import { notify } from '../../../components/feedback/notify';

export default function CompanyReportSection() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<ReportType>('taken');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [takenReports, setTakenReports] = useState<CompanyReportEntry[]>([]);
  const [dueReports, setDueReports] = useState<CompanyReportEntry[]>([]);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = () => {
    const taken = getReportsByType('taken');
    const due = getReportsByType('due');
    setTakenReports(taken.sort((a, b) => b.timestamp - a.timestamp));
    setDueReports(due.sort((a, b) => b.timestamp - a.timestamp));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || Number(amount) <= 0) {
      notify.error('সঠিক পরিমাণ লিখুন');
      return;
    }

    addCompanyReport({
      date,
      type,
      amount: Number(amount),
      note: note.trim(),
    });

    setAmount('');
    setNote('');
    loadReports();
    notify.success('রিপোর্ট সফলভাবে যোগ করা হয়েছে');
  };

  return (
    <div className="space-y-6">
      <Card className="border-emerald-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500">
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
              <Label>ধরন</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="taken"
                    checked={type === 'taken'}
                    onChange={(e) => setType(e.target.value as ReportType)}
                    className="w-5 h-5 accent-emerald-600"
                  />
                  <span className="font-medium">নেওয়া</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="due"
                    checked={type === 'due'}
                    onChange={(e) => setType(e.target.value as ReportType)}
                    className="w-5 h-5 accent-rose-600"
                  />
                  <span className="font-medium">পাওনা</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">পরিমাণ (৳)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="পরিমাণ লিখুন"
                className="border-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">নোট</Label>
              <Textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="নোট লিখুন (ঐচ্ছিক)"
                rows={3}
                className="border-2"
              />
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3">
              সাবমিট করুন
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-emerald-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500">
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {takenReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                      কোনো রিপোর্ট নেই
                    </TableCell>
                  </TableRow>
                ) : (
                  takenReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.date}</TableCell>
                      <TableCell className="text-right font-bold text-emerald-700">
                        ৳{report.amount.toFixed(0)}
                      </TableCell>
                      <TableCell>{report.note || '-'}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="border-rose-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-rose-500 to-pink-500">
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {dueReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                      কোনো রিপোর্ট নেই
                    </TableCell>
                  </TableRow>
                ) : (
                  dueReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.date}</TableCell>
                      <TableCell className="text-right font-bold text-rose-700">
                        ৳{report.amount.toFixed(0)}
                      </TableCell>
                      <TableCell>{report.note || '-'}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
