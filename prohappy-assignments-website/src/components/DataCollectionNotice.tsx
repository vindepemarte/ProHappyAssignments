import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Info, Shield } from 'lucide-react';

interface DataCollectionNoticeProps {
  formType: 'assignment' | 'changes' | 'worker';
  className?: string;
}

const DataCollectionNotice: React.FC<DataCollectionNoticeProps> = ({ 
  formType, 
  className = '' 
}) => {
  const { dispatch } = useAppContext();

  const getFormSpecificText = () => {
    switch (formType) {
      case 'assignment':
        return {
          title: 'Assignment Data Collection',
          description: 'We collect your personal information (name, email), academic details (module, assignment files), and technical data to provide our assignment services.',
          dataTypes: [
            'Personal information (name, email address)',
            'Academic information (module name, assignment details)',
            'Uploaded files and documents',
            'Communication preferences and deadlines'
          ]
        };
      case 'changes':
        return {
          title: 'Change Request Data Collection',
          description: 'We collect your contact information and change request details to process modifications to your existing order.',
          dataTypes: [
            'Email address and order reference',
            'Change request details and notes',
            'Updated deadlines and requirements',
            'Additional files related to changes'
          ]
        };
      case 'worker':
        return {
          title: 'Worker Submission Data Collection',
          description: 'We collect your contact information and completed work files to facilitate delivery to clients.',
          dataTypes: [
            'Email address and order reference',
            'Completed assignment files',
            'Notes and communications for clients',
            'Submission timestamps and metadata'
          ]
        };
      default:
        return {
          title: 'Data Collection Notice',
          description: 'We collect information to provide our services.',
          dataTypes: ['Personal and service-related information']
        };
    }
  };

  const { title, description, dataTypes } = getFormSpecificText();

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center">
            <Info className="w-4 h-4 mr-1" />
            {title}
          </h4>
          <p className="text-sm text-blue-800 mb-3">
            {description}
          </p>
          
          <div className="mb-3">
            <p className="text-xs font-medium text-blue-900 mb-1">Data we collect:</p>
            <ul className="text-xs text-blue-800 space-y-1">
              {dataTypes.map((dataType, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-1 h-1 bg-blue-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                  {dataType}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <button
              type="button"
              onClick={() => dispatch({ type: 'SET_SHOW_PRIVACY', payload: true })}
              className="text-blue-700 hover:text-blue-900 underline font-medium"
            >
              Privacy Policy
            </button>
            <span className="text-blue-600">•</span>
            <button
              type="button"
              onClick={() => dispatch({ type: 'SET_SHOW_TERMS', payload: true })}
              className="text-blue-700 hover:text-blue-900 underline font-medium"
            >
              Terms & Conditions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataCollectionNotice;