import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { ShieldAlert } from 'lucide-react';
import { useSession } from '../../state/session/useSession';

export default function BlockedAccountView() {
  const { logout } = useSession();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-4">
      <Card className="w-full max-w-md border-red-200 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-8 h-8" />
            <CardTitle className="text-xl">Account Blocked</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="text-center space-y-4">
            <p className="text-lg font-semibold text-gray-800">
              Your account is blocked. Please contact support.
            </p>
            <p className="text-sm text-gray-600">
              If you believe this is an error, please reach out to the administrator for assistance.
            </p>
          </div>
          <Button
            onClick={logout}
            className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold"
          >
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
