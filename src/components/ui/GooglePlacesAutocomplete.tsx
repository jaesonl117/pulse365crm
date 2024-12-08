import React from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { LoadingSpinner } from './LoadingSpinner';
import { useGoogleMaps } from '../../services/googleMaps';
import { AlertCircle } from 'lucide-react';

interface GooglePlacesAutocompleteWrapperProps {
  onPlaceSelect: (place: any) => void;
  placeholder?: string;
}

export const GooglePlacesAutocompleteWrapper: React.FC<GooglePlacesAutocompleteWrapperProps> = ({
  onPlaceSelect,
  placeholder = 'Start typing your address...'
}) => {
  const { isLoaded, hasError } = useGoogleMaps();

  if (hasError) {
    return (
      <div className="flex items-center justify-center p-4 text-red-500 dark:text-red-400">
        <AlertCircle className="h-5 w-5 mr-2" />
        <span>Failed to load address search. Please try again later.</span>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-4">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <GooglePlacesAutocomplete
      apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      selectProps={{
        onChange: onPlaceSelect,
        placeholder,
        className: 'google-places-autocomplete',
        classNames: {
          control: () => 'p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
          input: () => 'text-gray-900 dark:text-white',
          option: () => 'p-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer',
          menu: () => 'mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg',
        },
        components: {
          DropdownIndicator: null,
        },
      }}
    />
  );
};