import LeadGenApp from "../components/LeadGenApp";
import AuthWrapper from "../components/AuthWrapper";

export default function DashboardPage() {
  return (
    <AuthWrapper>
      <LeadGenApp />
    </AuthWrapper>
  );
}
