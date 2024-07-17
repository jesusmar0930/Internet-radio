import React from 'react';

function CountryFilter({ setCountry }) {
  const countries = [
    { code: '', name: 'All Countries' },
    { code: 'us', name: 'United States' },
    { code: 'gb', name: 'United Kingdom' },
    { code: 'de', name: 'Germany' },
    { code: 'fr', name: 'France' },
    { code: 'ca', name: 'Canada' },
    { code: 'au', name: 'Australia' },
    { code: 'br', name: 'Brazil' },
    { code: 'it', name: 'Italy' },
    { code: 'nl', name: 'Netherlands' },
    { code: 'es', name: 'Spain' },
  ];

  return (
    <select onChange={(e) => setCountry(e.target.value)}>
      {countries.map(country => (
        <option key={country.code} value={country.code}>
          {country.name}
        </option>
      ))}
    </select>
  );
}

export default CountryFilter;