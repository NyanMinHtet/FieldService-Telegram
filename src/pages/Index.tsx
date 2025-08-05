import { LoginForm } from "@/components/auth/LoginForm";
import { Dashboard } from "@/components/dashboard/Dashboard";

const Index = ({ isAuthenticated, onLoginSuccess }: { isAuthenticated: boolean, onLoginSuccess: () => void }) => {
  if (!isAuthenticated) {
    return <LoginForm onLoginSuccess={onLoginSuccess} />;
  }

  return <Dashboard />;
};

export default Index;
