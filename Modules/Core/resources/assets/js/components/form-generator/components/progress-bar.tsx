// src/components/form-generator/components/ProgressBar.tsx
import React from 'react';

interface ProgressBarProps {
    totalSteps: number;
    currentStep: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ totalSteps, currentStep }) => {
    const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

    return (
        <div className="bg-muted mb-6 h-2.5 w-full rounded-full">
            <div className="h-2.5 rounded-full bg-blue-600" style={{ width: `${progressPercentage}%`, transition: 'width 0.3s ease-in-out' }}></div>
        </div>
    );
};

export default ProgressBar;
