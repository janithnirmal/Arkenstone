import ResetPasswordCore from '@core/pages/auth/reset-password';

export default function ResetPassword({ token, email }: { token: string; email: string }) {
    return <ResetPasswordCore token={token} email={email} />;
}
