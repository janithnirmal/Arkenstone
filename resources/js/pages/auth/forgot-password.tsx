import ForgotPasswordCore from '@/core/pages/auth/forgot-password';

export default function ForgotPassword({ status }: { status?: string }) {
    return <ForgotPasswordCore status={status} />;
}
