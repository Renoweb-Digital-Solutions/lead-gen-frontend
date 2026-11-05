// # Regenerate FastAPI's bounded location reference from the installed frontend package.
// # Keep only US/India names and codes used by these forms, not the global coordinate dataset.
const fs = require("node:fs");
const path = require("node:path");
const { Country, State, City } = require("country-state-city");
const { version, license } = require("country-state-city/package.json");

const outputDirectory = path.resolve(
  __dirname,
  "../../lead-gen-backend/resources",
);
const countries = {};
for (const code of ["US", "IN"]) {
  const country = Country.getCountryByCode(code);
  const states = {};
  for (const state of State.getStatesOfCountry(code)) {
    states[state.isoCode] = {
      name: state.name,
      cities: [
        ...new Set(
          City.getCitiesOfState(code, state.isoCode).map((city) => city.name),
        ),
      ].sort(),
    };
  }
  countries[code] = { name: country.name, states };
}
fs.mkdirSync(outputDirectory, { recursive: true });
fs.writeFileSync(
  path.join(outputDirectory, "b2b-locations.json"),
  JSON.stringify({ source: "country-state-city", version, license, countries }),
);
// # Preserve the upstream attribution with the derived reference data.
fs.copyFileSync(
  path.join(
    path.dirname(require.resolve("country-state-city/package.json")),
    "LICENSE",
  ),
  path.join(outputDirectory, "country-state-city-LICENSE.txt"),
);
process.stdout.write(
  `Exported US/India location reference from country-state-city ${version}.\n`,
);
