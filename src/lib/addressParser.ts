import { Address } from '../types/auth';
import { US_STATES } from './utils';

interface GooglePlaceResult {
  address_components: {
    long_name: string;
    short_name: string;
    types: string[];
  }[];
  formatted_address: string;
  place_id: string;
}

export const parseGoogleAddress = (place: GooglePlaceResult): Partial<Address> => {
  const addressComponents = place.address_components;
  const result: Partial<Address> = {
    placeId: place.place_id
  };

  // Initialize empty strings for address components
  let streetNumber = '';
  let route = '';

  // Map address components to our format
  addressComponents.forEach(component => {
    const type = component.types[0];

    switch (type) {
      case 'street_number':
        streetNumber = component.long_name;
        break;
      case 'route':
        route = component.long_name;
        break;
      case 'locality':
        result.city = component.long_name;
        break;
      case 'administrative_area_level_1':
        // Ensure the state exists in our US_STATES array
        const stateMatch = US_STATES.find(
          state => state.value === component.short_name
        );
        if (stateMatch) {
          result.state = stateMatch.value;
        }
        break;
      case 'postal_code':
        result.zipCode = component.long_name;
        break;
      case 'country':
        result.country = component.long_name;
        break;
    }
  });

  // Combine street number and route for street address
  if (streetNumber && route) {
    result.street = `${streetNumber} ${route}`;
  } else if (route) {
    result.street = route;
  }

  return result;
};