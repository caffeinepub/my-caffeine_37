import ApprovalsSection from './ApprovalsSection';
import BlockUsersSection from './BlockUsersSection';

export default function UserRequestsSection() {
  return (
    <div className="space-y-6">
      <ApprovalsSection />
      <BlockUsersSection />
    </div>
  );
}
