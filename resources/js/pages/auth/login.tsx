import LoginCore from '@core/pages/auth/login';

export default function Login({ canResetPassword = false }: { canResetPassword?: boolean }) {
    return <LoginCore canResetPassword={canResetPassword} />;
}
