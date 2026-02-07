import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { validateMtLoanPassword, getMtLoanName } from '@/lib/storage/mtLoanSettingsStorage';
import { setMtLoanAuthorized } from '@/lib/storage/mtLoanAuthStorage';
import { createMtLoanIdentity } from '@/lib/storage/mtLoanIdentityStorage';
import { notify } from '@/components/feedback/notify';

interface MtLoanPasswordPromptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MtLoanPasswordPrompt({ open, onOpenChange }: MtLoanPasswordPromptProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setError('');
    setIsSubmitting(true);

    try {
      if (!password.trim()) {
        setError('পাসওয়ার্ড প্রয়োজন');
        setIsSubmitting(false);
        return;
      }

      const isValid = validateMtLoanPassword(password);

      if (isValid) {
        // Set authorization
        setMtLoanAuthorized();

        // Create identity
        const name = getMtLoanName();
        createMtLoanIdentity(name);

        // Success
        notify.success('সফলভাবে প্রবেশ করেছেন');
        setPassword('');
        setError('');
        onOpenChange(false);
      } else {
        setError('ভুল পাসওয়ার্ড');
      }
    } catch (err) {
      setError('একটি সমস্যা হয়েছে');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setPassword('');
    setError('');
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-3xl border-2 shadow-2xl max-w-md">
        <AlertDialogHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 -m-6 mb-4 p-6 rounded-t-3xl">
          <AlertDialogTitle className="text-xl font-bold text-white">
            MT Loan প্রবেশ
          </AlertDialogTitle>
          <AlertDialogDescription className="text-blue-50">
            প্রবেশ করতে পাসওয়ার্ড দিন
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 px-2">
          <div>
            <Label htmlFor="mt-loan-password" className="text-sm font-semibold">
              পাসওয়ার্ড
            </Label>
            <Input
              id="mt-loan-password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isSubmitting) {
                  handleSubmit();
                }
              }}
              placeholder="পাসওয়ার্ড লিখুন"
              className="mt-2 border-2 text-base py-5"
              disabled={isSubmitting}
              autoFocus
            />
            {error && (
              <p className="text-red-600 text-sm mt-2 font-semibold">{error}</p>
            )}
          </div>
        </div>

        <AlertDialogFooter className="flex-col sm:flex-row gap-2 mt-4">
          <AlertDialogCancel
            onClick={handleCancel}
            disabled={isSubmitting}
            className="w-full sm:w-auto min-h-[48px] rounded-xl border-2 font-bold"
          >
            বাতিল
          </AlertDialogCancel>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full sm:w-auto min-h-[48px] rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-lg"
          >
            {isSubmitting ? 'যাচাই করা হচ্ছে...' : 'প্রবেশ করুন'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
