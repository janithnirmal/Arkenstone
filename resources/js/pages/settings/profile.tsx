import ProfileCore from '@/core/pages/settings/profile';

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    return <ProfileCore mustVerifyEmail={mustVerifyEmail} status={status} />;
}
