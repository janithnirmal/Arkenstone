import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from '../../Modules/Core/resources/assets/js/hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

function pageResolver(name: string) {
    let parts = name.split('::'); // Split by '::' to check for module components

    let isModuleComponent = parts.length > 1;

    if (isModuleComponent) {
        console.log('module');
        // If it's a module component, construct the path to the module's component
        let moduleName = parts[0];
        let componentPath = parts[1]; // e.g., 'Admin/Index'

        // Adjust the path based on your module's structure
        return resolvePageComponent(
            `../../Modules/${moduleName}/resources/assets/js/pages/${componentPath}.tsx`,
            import.meta.glob(`../../Modules/**/resources/assets/js/pages/**/*.tsx`),
        );
    } else {
        console.log('normal');

        return resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx'));
    }
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => pageResolver(name),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#ADD8E6',
    },
});

// This will set light / dark mode on load...
initializeTheme();
