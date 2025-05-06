<x-mail::message>
    # Contact Mail

    New contact mail received.

    <p>Name: {{ $contactMail->name }}</p>
    <p>Email: {{ $contactMail->email }}</p>
    <p>Mobile: {{ $contactMail->mobile }}</p>
    <p>Message: {{ $contactMail->message }}</p>
    <p>Get Updates: {{ $contactMail->get_updates ? 'Yes' : 'No' }}</p>

    <x-mail::button :url="env('APP_URL') . '/admin/contact-mails'">
        View Contact Mail
    </x-mail::button>

    Thanks,<br>
    {{ config('app.name') }}
</x-mail::message>
