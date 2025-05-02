<x-mail::message>
    # Admin Invitation

    Hi, {{ $name }}! Welcome to {{ config('app.name') }}

    You have been invited to join {{ config('app.name') }} as an admin.

    <x-mail::panel>
        <p>
            Your Account Email: {{ $email }}
        </p>
        <p>
            Your temporary password is: {{ $password }}
        </p>
        <p>
            Please change your password after logging in.
        </p>
    </x-mail::panel>

    <x-mail::button :url="route('login')">
        Login
    </x-mail::button>

    Thanks,
    {{ config('app.name') }}
</x-mail::message>
