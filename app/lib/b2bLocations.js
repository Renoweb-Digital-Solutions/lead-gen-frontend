import { Country, State, City } from "country-state-city";

// # Country is determined by the directory, never by saved location text or an editable input.
export const DIRECTORY_COUNTRIES = {
  yellowpages: "US",
  indiamart: "IN",
  justdial: "IN",
};

const stateOptions = new Map();
const cityOptions = new Map();

export function directoryCountry(directory) {
  return Country.getCountryByCode(DIRECTORY_COUNTRIES[directory]);
}

export function directoryStates(countryCode) {
  if (!stateOptions.has(countryCode)) {
    stateOptions.set(
      countryCode,
      State.getStatesOfCountry(countryCode)
        .map((state) => ({ value: state.isoCode, label: state.name }))
        .sort((left, right) => left.label.localeCompare(right.label)),
    );
  }
  return stateOptions.get(countryCode);
}

export function directoryCities(countryCode, stateCode) {
  const key = `${countryCode}:${stateCode}`;
  if (!cityOptions.has(key)) {
    // # Avoid filtering the global city dataset again on every form render or slider change.
    cityOptions.set(
      key,
      [
        ...new Set(
          City.getCitiesOfState(countryCode, stateCode).map(
            (city) => city.name,
          ),
        ),
      ]
        .sort((left, right) => left.localeCompare(right))
        .map((name) => ({ value: name, label: name })),
    );
  }
  return cityOptions.get(key);
}

export function resolveDirectoryLocation(directory, selection) {
  const country = directoryCountry(directory);
  if (!country || !selection?.stateCode) return null;
  const state = directoryStates(country.isoCode).find(
    (item) => item.value === selection.stateCode,
  );
  if (!state) return null;
  const city = selection.city || "";
  if (
    city &&
    !directoryCities(country.isoCode, state.value).some(
      (item) => item.value === city,
    )
  ) {
    return null;
  }
  // # Send structured country/state/city fields. FastAPI rebuilds this display string from trusted data.
  return {
    country_code: country.isoCode,
    state_code: state.value,
    city,
    location: [city, state.label, country.name].filter(Boolean).join(", "),
  };
}
