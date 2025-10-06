import { apiGet, apiPost } from '@core/lib/api';

interface TrackEventPayload {
    [key: string]: any;
}

type AnalyticalTypes = 'system' | 'user';

/**
 * Service for sending frontend analytics events to the backend.
 */
class AnalyticsService {
    /**
     * Tracks a generic event.
     * @param eventKey A descriptive name for the event (e.g., 'project_form_opened').
     * @param payload Optional additional data.
     */
    trackEvent(eventKey: string, type: AnalyticalTypes, payload: TrackEventPayload = {}) {
        console.log(`[Analytics] Tracking Event: ${eventKey}`, { payload });

        const params: { event_key: string; type: AnalyticalTypes; payload: object; companyId?: number } = {
            event_key: eventKey,
            type,
            payload,
        };

        apiPost('/analytics', {
            data: params,
            displayError: false, // Fail silently
        }).catch((err) => console.error('Analytics tracking failed:', err));
    }

    async query(query: any) {
        return await apiGet('analytics', {
            data: {
                queries: query,
            },
        });
    }

    trackSystem(event: string) {
        this.trackEvent(event, 'system');
    }

    trackUser(event: string) {
        this.trackEvent(event, 'user');
    }
}

// Export a singleton instance for easy use across the app
export const analyticsTracker = new AnalyticsService();
