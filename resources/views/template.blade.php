<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Modern PDF Design</title>
    <style>
        body {
            font-family: 'Roboto', Helvetica, Arial, sans-serif;
            box-sizing: border-box;
            padding: 0
        }
    </style>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <script defer src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>

<body>

    <div class="d-flex justify-content-center align-items-center p-4"
        style="height: 100vh; width: 100%; background-color: #155043 !important;">
        <div class="text-center text-white">
            <img src="https://esg.ceygenic.co/storage/images/branding/icon.png" alt="Logo"
                style="height: 100px; width: 100px; object-fit: contain;">
            <h1>ESG Report</h1>
            <div class="d-flex justify-content-center align-items-center lrv-text-sub mt-4">
            </div>
        </div>
    </div>


    @pageBreak

    {{-- section cover --}}
    @php
        $sectionCount = count($sections);
        $sectionIndex = 0;
    @endphp

    @foreach ($sections as $section)
        <div class="section-cover px-5 py-2 text-white pb-2 vh-100 w-100 rounded-2 d-flex flex-column justify-content-center align-items-center"
            style="background-color: #002d16;">
            <h4>Section {{ $sectionIndex + 1 }}</h4>
            <h1>{{ $section['title'] }}</h1>
        </div>

        @pageBreak

        {{-- sub section header --}}
        @php
            $subSectionCount = count($section['subSections'] ?? []);
            $subSectionIndex = 0;
        @endphp
        @foreach ($section['subSections'] as $subSection)
            <div class="sub-section-header px-5 py-2 text-white pb-1 d-flex flex-column justify-content-center align-items-center"
                style="background-color: #004f4f;">
                <h6>Sub Section {{ $subSectionIndex + 1 }}</h6>
                <h2>{{ $subSection['title'] }}</h2>
            </div>

            {{-- nodes --}}
            @php
                $nodeCount = count($subSection['nodes'] ?? []);
                $nodeIndex = 0;
            @endphp
            @foreach ($subSection['nodes'] as $node)
                <div class="node px-5 py-1 text-dark bg-white pb-1 my-2">
                    <hr>
                    <p style="font-size: 10px;">{{ $node['code'] }}</p>
                    <h7>{{ $node['label'] }}</h7>
                    <p class="text-secondary">{{ $node['tooltip'] }}</p>
                    <p class="">{{ isset($node['response']['data']) ? $node['response']['data'] : '' }}</p>
                </div>

                @php
                    $nodeIndex++;
                @endphp


                @if ($sectionIndex == $sectionCount - 1 && $subSectionIndex == $subSectionCount - 1 && $nodeIndex == $nodeCount - 1)
                    @pageBreak
                @endif
            @endforeach


            @php
                $subSectionIndex++;
            @endphp
        @endforeach

        @php
            $sectionIndex++;
        @endphp

        @pageBreak
    @endforeach


    <div class="d-flex justify-content-center align-items-center p-4"
        style="height: 100vh; background-color: #155043 !important;">
        <div class="container text-center text-white">
            <h1>Thank You!</h1>
            <p class="lrv-fs-6">Powered By Greenlect (Pvt) Ltd</p>
            <p class="lrv-fs-7">ESG Reporting Platform</p>
        </div>
    </div>
</body>

</html>
