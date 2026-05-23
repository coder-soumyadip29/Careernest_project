import SiteLayout from '@/components/layout/SiteLayout';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <SiteLayout>
      <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
        <LoginForm />
      </div>
    </SiteLayout>
  );
}
