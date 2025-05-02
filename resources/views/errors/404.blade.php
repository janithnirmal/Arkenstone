<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>{{ env('APP_NAME') }} - 404</title>

    <script defer src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
</head>

<body>
    <section class="flex h-screen w-full items-center justify-center bg-gray-900">
        <div class="flex flex-col items-center justify-center">
            <h1 class="text-4xl font-bold text-white">404</h1>
            <p class="text-gray-200">Page not found</p>
            <a href="{{ route('dashboard') }}" class="text-gray-200"><button
                    class="bg-gray-200 text-gray-900 px-4 py-2 mt-5 rounded-full cursor-pointer hover:bg-gray-300">Go to
                    dashboard</button></a>
        </div>
    </section>
</body>

</html>
