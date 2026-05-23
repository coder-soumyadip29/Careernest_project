import SiteLayout from '@/components/layout/SiteLayout';
import SignupForm from '@/components/auth/SignupForm';

export default function SignupPage() {
  return (
    <SiteLayout>
      <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
        <SignupForm />
      </div>
    </SiteLayout>
  );
}
