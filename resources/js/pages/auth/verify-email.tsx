import VerifyEmailCore from '@/core/pages/auth/verify-email';

export default function VerifyEmail({ status }: { status?: string }) {
    return <VerifyEmailCore status={status} />;
}
