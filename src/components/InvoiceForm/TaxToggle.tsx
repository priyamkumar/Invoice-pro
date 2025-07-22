import React from 'react';
import { TaxSettings } from '../../types';

interface TaxToggleProps {
  taxSettings: TaxSettings;
  onChange: (settings: TaxSettings) => void;
}

const TaxToggle: React.FC<TaxToggleProps> = ({ taxSettings, onChange }) => {
  const handleToggle = (key: keyof TaxSettings) => {
    const updatedSettings = { ...taxSettings };

    if (key === 'showIGST') {
      const newValue = !taxSettings.showIGST;
      updatedSettings.showIGST = newValue;
      if (newValue) {
        updatedSettings.showCGST = false;
        updatedSettings.showUTGST = false;
      }
    } else if (key === 'showCGST' || key === 'showUTGST') {
      const newValue = !taxSettings[key];
      updatedSettings[key] = newValue;
      if (newValue) {
        updatedSettings.showIGST = false;
      }
    } else {
      updatedSettings[key] = !taxSettings[key];
    }

    onChange(updatedSettings);
  };


  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax Settings</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Tax Included in Rate</label>
          <button
            type="button"
            onClick={() => handleToggle('taxIncluded')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              taxSettings.taxIncluded ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                taxSettings.taxIncluded ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">CGST</label>
            <button
              type="button"
              onClick={() => handleToggle('showCGST')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                taxSettings.showCGST ? 'bg-green-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  taxSettings.showCGST ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">IGST</label>
            <button
              type="button"
              onClick={() => handleToggle('showIGST')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                taxSettings.showIGST ? 'bg-orange-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  taxSettings.showIGST ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">UTGST</label>
            <button
              type="button"
              onClick={() => handleToggle('showUTGST')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                taxSettings.showUTGST ? 'bg-purple-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  taxSettings.showUTGST ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxToggle;