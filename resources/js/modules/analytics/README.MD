# Analytics Module Documentation

- Version : 1.0.0
- Author : [Janith Nirmal](https://github.com/janithnirmal)
- Last Updated : 16-09-2025
- Created At : 10-08-2025

## 1. Overview

Welcome to the Analytics Module documentation. This module provides a self-contained, robust system for tracking, processing, and visualizing analytical data within your Laravel application. It is designed to be loosely coupled, allowing developers to easily integrate analytics tracking into any part of the backend or frontend with minimal effort.

The module handles everything from capturing raw event data to processing it into meaningful statistics and rendering interactive charts on the frontend.

### Core Concepts

- **Raw Events**: Individual data points captured as they happen (e.g., a user logs in, a button is clicked). These are stored in JSON files.
- **Processed Data**: Aggregated, calculated data derived from raw events. This is the data that is queried by the frontend for visualization (e.g., the total number of logins per day for the last 30 days).
- **Event Key**: A unique string identifier for a specific type of event (e.g., `user_login`, `project_created`, `test_button_clicked`).
- **Analyzers**: Backend classes responsible for transforming Raw Events into Processed Data. Each analyzer focuses on a specific metric.
- **System vs. User Events**:
    - **System Level**: Events that provide high-level insights about the application as a whole (e.g., total daily visits).
    - **User Level**: Events tied to a specific user, providing insights into their individual activity.

## 2. Backend Usage

The backend system is responsible for tracking events and processing the raw data.

### 2.1. Tracking Events

You can record events from anywhere in your Laravel backend (Controllers, Services, Jobs, etc.) using the `Analytics` facade. The service is already registered and available via the `analytics` alias.

#### Recording a System-Level Event

System-level events are for tracking application-wide metrics.

**Method:** `Analytics::recordSystemEvent(string $eventKey, array $payload = []): void`

- `$eventKey`: A descriptive name for the event.
- `$payload` (optional): An associative array of additional data to store with the event. A `timestamp` is added automatically.

**Example: Tracking a new user registration**
Place this code within your user registration logic.

```php
use Modules\Analytics\Facades\Analytics;

// When a new user successfully registers
$user = User::create($validatedData);

Analytics::recordSystemEvent('user_registered', ['user_id' => $user->id]);
```

#### Recording a User-Level Event

User-level events are for tracking actions specific to an individual user.

**Method:** `Analytics::recordUserEvent(int $userId, string $eventKey, array $payload = []): void`

- `$userId`: The ID of the user associated with the event.
- `$eventKey`: A descriptive name for the event.
- `$payload` (optional): An associative array of additional data. A `timestamp` is added automatically.

**Example: Tracking when a user creates a new project**

```php
use Illuminate\Support\Facades\Auth;
use Modules\Analytics\Facades\Analytics;

// Inside a method that creates a project
$project = $this->projectRepository->create($data);
$userId = Auth::user()->id;

Analytics::recordUserEvent($userId, 'project_created', ['project_id' => $project->id]);
```

### 2.2. Processing Raw Data

Raw event logs are not suitable for direct querying. They must be processed into an aggregated format. This is handled by "Analyzers".

#### How Data Processing Works

1.  A scheduled Artisan command `php artisan analytics:process` runs periodically (configured for every minute in `app/Console/Kernel.php`).
2.  This command discovers all `Analyzer` classes within the `Modules\Analytics\Services\Analyzers` namespace.
3.  It executes the `analyze()` method on each one.
4.  Each analyzer fetches relevant raw data, performs calculations (e.g., counting daily occurrences), and saves the result as a processed data file.

#### Creating a New Analyzer

To calculate a new metric, you simply need to create a new Analyzer class.

**Step 1: Create the Analyzer File**
Create a new PHP class in `Modules/Analytics/Services/Analyzers/`. For example, `NewUserWelcomeEmailOpenedAnalyzer.php`.

**Step 2: Implement the `AnalyzerInterface`**
Your class must implement `AnalyzerInterface`, which requires three methods: `key()`, `type()`, and `analyze()`.

**Example: An analyzer that counts how many times users click the test button.**

Let's assume the frontend tracks a `test_button_clicked` event.

```php
<?php

namespace Modules\Analytics\Services\Analyzers;

use Carbon\Carbon;
use Modules\Analytics\Contracts\AnalyzerInterface;
use Modules\Analytics\Helpers\AnalyticsStorage;

class TestButtonClickedAnalyzer implements AnalyzerInterface
{
    protected $storage;

    public function __construct(AnalyticsStorage $storage)
    {
        $this->storage = $storage;
    }

    /**
     * The unique key the frontend will use to query this data.
     */
    public function key(): string
    {
        // This MUST match the key used in the frontend query
        return 'test_button_clicked';
    }

    /**
     * The type of data this analyzer processes.
     */
    public function type(): string
    {
        return 'system';
    }

    /**
     * The core logic: read raw data, process it, save it.
     */
    public function analyze(?int $companyId = null): void
    {
        // 1. Get the raw events for 'test_button_clicked'
        // This event key is what you pass to Analytics::recordSystemEvent()
        $rawEvents = $this->storage->getRawEvents('system/raw', 'test_button_clicked');

        // 2. Process the data (e.g., count clicks per day)
        $clicksByDay = collect($rawEvents)
            ->countBy(function ($event) {
                return Carbon::parse($event['timestamp'])->format('Y-m-d');
            })
            ->sortKeys();

        // 3. Save the processed data
        $this->storage->saveProcessedData('system/processed', $this->key(), $clicksByDay->all());
    }
}
```

That's it! The scheduler will automatically pick up and run this new analyzer. The processed data will now be available for the frontend to query using the key `test_button_clicked`.

## 3. Frontend Usage

The frontend system allows you to track events occurring in the browser and visualize the processed data from the backend.

### 3.1. Tracking Frontend Events

A global `analyticsTracker` service is available for tracking events from any React component.

**Location:** `@@/analytics/services/AnalyticsService.ts`

#### Tracking a System Event

Use this for general frontend events that are not user-specific.

**Method:** `analyticsTracker.trackSystem(string $eventKey)`

**Example: Tracking a button click**

```tsx
import { Button } from '@@/components/ui/button';
import { analyticsTracker } from '@@/analytics/services/AnalyticsService';

function MyComponent() {
    return (
        <Button
            onClick={() => {
                analyticsTracker.trackSystem('test_button_clicked');
            }}
        >
            Test Button
        </Button>
    );
}
```

#### Tracking a User Event

Use this when the event is directly related to the logged-in user's actions. The backend automatically associates the event with the authenticated user.

**Method:** `analyticsTracker.trackUser(string $eventKey)`

**Example: Tracking when a user opens a settings modal**

```tsx
import { analyticsTracker } from '@@/analytics/services/AnalyticsService';

function openSettingsModal() {
    // logic to open modal...
    analyticsTracker.trackUser('settings_modal_opened');
}
```

### 3.2. Visualizing Data

Displaying data is a three-step process: **Query**, **Filter**, and **Visualize**.

#### Step 1: Query the Data

First, fetch the processed data from the backend using the `analyticsTracker.query()` method.

**Method:** `async query(queries: Array<{ key: string; type: 'system' | 'user' }>)`

- `key`: The key of the analyzer whose data you want to fetch (e.g., `daily_user_logins`).
- `type`: The type of the analyzer (`system` or `user`).

**Example: Fetching daily user logins and button click data**

```tsx
import { useEffect, useState } from 'react';
import { analyticsTracker } from '../services/AnalyticsService';

function AnalyticsDashboard() {
    const [rawAnalyticsData, setRawAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const data = await analyticsTracker.query([
                { key: 'daily_user_logins', type: 'system' },
                { key: 'test_button_clicked', type: 'system' },
            ]);
            setRawAnalyticsData(data);
            setLoading(false);
        }

        fetchData();
    }, []);

    // ... rest of the component
}
```

The `rawAnalyticsData` state will now contain an object like this:

```json
{
    "daily_user_logins": {
        "2025-09-14": 5,
        "2025-09-15": 12
    },
    "test_button_clicked": {
        "2025-09-15": 25
    }
}
```

#### Step 2: Filter and Transform the Data (Client-Side)

The data from the backend is often not in the exact format required by charting libraries. For example, a line chart needs a continuous array of data points, but the backend data may have gaps on days with no activity.

The `useAnalyticsFilter` hook solves this by applying a chain of transformations to the raw data.

**Hook:** `useAnalyticsFilter(rawData, filterMapping, globalOptions)`

- `rawData`: The data object fetched in Step 1.
- `filterMapping`: A configuration object defining which filters to apply to which data key.
- `globalOptions`: Options available to all filters, such as a `dateRange`.

**Available Filters:**

- `transformDateCountObject`: Converts an object like `{ "2025-09-15": 12 }` into an array `[{ date: "2025-09-15", count: 12 }]`.
- `padDateRange`: Fills in missing dates within a given range with a default value, ensuring a continuous dataset for charts.

**Example: Setting up the filter mapping**

```tsx
import { useAnalyticsFilter, AnalyticsFilterMapping } from '../hooks/useAnalyticsFilter';
import { DateRange } from 'react-day-picker';
import { useState } from 'react';
import { addDays } from 'date-fns';

// ... inside your component

const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
});

// 1. Define the filter mapping
const filterMapping: AnalyticsFilterMapping = {
    // Apply these filters to the 'daily_user_logins' data
    daily_user_logins: [
        {
            name: 'transformDateCountObject',
            options: { dateKey: 'date', valueKey: 'count' }, // Customize output keys
        },
        {
            name: 'padDateRange', // Applied second, to the output of the first filter
            options: { dateKey: 'date', valueKey: 'count', defaultValue: 0 },
        },
    ],
    // Apply the same filters to the 'test_button_clicked' data
    test_button_clicked: [
        { name: 'transformDateCountObject' }, // Can use default options
        { name: 'padDateRange' },
    ],
};

// 2. Use the hook with the raw data and the mapping
const analyticsData = useAnalyticsFilter(rawAnalyticsData, filterMapping, {
    dateRange: date,
});
```

The `analyticsData` variable now holds the fully transformed data, ready for visualization.

#### Step 3: Visualize the Data

The `AnalyticsVisualizationService` is a component that automatically renders the correct chart for each piece of data based on a mapping you provide.

**Component:** `<AnalyticsVisualizationService data={...} mapping={...} />`

- `data`: The processed data from the `useAnalyticsFilter` hook.
- `mapping`: A configuration object that tells the service which chart component to use for each data key and what options to pass to it.

**Example: Setting up the visualization mapping**

```tsx
import { AnalyticsVisualizationService } from '../services/AnalyticsVisualizationService';

// 1. Define the visualization mapping
const visualizationMapping = {
    daily_user_logins: {
        component: 'LineChart', // Must match a key in the chartComponents map
        options: {
            title: 'Daily User Logins',
            description: 'A line chart showing the number of user logins per day.',
            chartConfig: {
                count: { label: 'Logins', color: '#2563eb' },
            },
            xAxisKey: 'date', // The key for the X-axis in your data array
            lineDataKeys: ['count'], // The key(s) for the line(s) in your data array
        },
    },
    test_button_clicked: {
        component: 'BarChart', // We can use a different chart
        options: {
            title: 'Daily Button Clicks',
            chartConfig: {
                count: { label: 'Clicks', color: '#84cc16' },
            },
            xAxisKey: 'date',
            barDataKeys: ['count'],
        },
    },
};

// 2. Render the service component
// ... inside your component's return statement
return (
    <section>
        {/* ... other elements like headers and date filters */}

        {!loading && analyticsData && <AnalyticsVisualizationService data={analyticsData} mapping={visualizationMapping} />}
    </section>
);
```

## 4. Extending the Module

The module is designed to be extensible.

### 4.1. Adding a New Frontend Filter

1.  Open `@@/analytics/lib/analyticsFilters.ts`.
2.  Create a new function that accepts `data` and an `options` object and returns the transformed data.
3.  Add your new function to the `analyticsFilters` exported object.
4.  You can now use its key as a `name` in your `filterMapping` configuration.

### 4.2. Adding a New Chart Component

1.  Create your new chart component (e.g., `CustomAreaChart.tsx`). It should accept `data` and `options` props.
2.  Open `@@/analytics/services/AnalyticsVisualizationService.tsx`.
3.  Import your new chart component.
4.  Add it to the `chartComponents` map with a unique key (e.g., `AreaChart: CustomAreaChart`).
5.  You can now use `'AreaChart'` as a `component` value in your `visualizationMapping` configuration.

### 4.3. Adding a New Event

1. tracking a new event type is very simple. just track witha new name and the record will be stored automatically

### 4.4. Processing the event raw data

1. Processing involved taking reading the raw data and processing them in different methods. for that simply create a new analyser and analyzer will handle the processing. the key you give for an analyzer is the retreval key of that proceesed data.


## 5. API Reference

The module exposes two primary API endpoints.

### `POST /api/analytics` (Tracking)

This endpoint is used by the frontend `analyticsTracker` service to record events.

**Request Body:**

```json
{
    "event_key": "your_event_name",
    "type": "system" | "user",
    "payload": { "additional": "data" }
}
```

### `GET /api/analytics` (Querying)

This endpoint is used by the frontend `analyticsTracker` service to fetch processed data.

**Query Parameters:**

The request is sent as a GET request with query parameters structured like this:
`?queries[0][key]=daily_user_logins&queries[0][type]=system`

**Success Response Body:**

```json
{
    "daily_user_logins": {
        "2025-09-14": 5,
        "2025-09-15": 12
    }
}
```

## 6. Future Development (Roadmap)

The following features are planned for future updates:

- **Analyzing Scheduling Feature**: More granular control over when specific analyzers run.
- **Implement Module Failing System**: A more robust system for handling and logging failures during event tracking or processing.
