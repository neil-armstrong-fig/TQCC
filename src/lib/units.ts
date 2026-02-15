/**
 * Unit conversion utilities and localStorage management
 */

export type DistanceUnit = "miles" | "km";

const STORAGE_KEY = "tqcc-distance-unit";
const MILES_TO_KM = 1.609344;

/**
 * Get the user's preferred distance unit from localStorage
 */
export function getPreferredUnit(): DistanceUnit {
  if (typeof window === "undefined") return "miles"; // SSR default

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "km" || stored === "miles") {
      return stored;
    }
  } catch (e) {
    console.warn("Failed to read unit preference:", e);
  }

  return "miles"; // Default to miles
}

/**
 * Save the user's preferred distance unit to localStorage
 */
export function setPreferredUnit(unit: DistanceUnit): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, unit);
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent("unit-change", { detail: { unit } }));
  } catch (e) {
    console.warn("Failed to save unit preference:", e);
  }
}

/**
 * Convert miles to kilometers
 */
export function milesToKm(miles: number): number {
  return miles * MILES_TO_KM;
}

/**
 * Convert kilometers to miles
 */
export function kmToMiles(km: number): number {
  return km / MILES_TO_KM;
}

/**
 * Convert meters to the preferred unit
 */
export function metersToPreferredUnit(meters: number, unit: DistanceUnit): number {
  const miles = meters / 1609.344;
  return unit === "km" ? milesToKm(miles) : miles;
}

/**
 * Format distance with the appropriate unit
 * Miles: 1 decimal place, Kilometers: whole numbers (unless keepDecimals is true)
 */
export function formatDistance(meters: number, unit: DistanceUnit, keepDecimals = false): string {
  const distance = metersToPreferredUnit(meters, unit);
  if (unit === "km" && !keepDecimals) {
    return `${Math.round(distance)} ${unit}`;
  }
  return `${distance.toFixed(1)} ${unit}`;
}

/**
 * Parse a distance string and convert if needed
 * Examples: "50 miles", "30-40 miles", "~25 miles"
 * Miles: 1 decimal place, Kilometers: whole numbers
 */
export function convertDistanceString(distanceStr: string, targetUnit: DistanceUnit): string {
  // If already in target unit, return as-is
  if (distanceStr.toLowerCase().includes(targetUnit)) {
    return distanceStr;
  }

  // Extract numbers and convert
  const milesPattern = /(\d+(?:\.\d+)?)/g;
  const matches = distanceStr.match(milesPattern);

  if (!matches) return distanceStr;

  const converted = matches.map(num => {
    const value = parseFloat(num);
    const newValue = targetUnit === "km" ? milesToKm(value) : kmToMiles(value);
    // Whole numbers for km, 1 decimal for miles
    return targetUnit === "km" ? Math.round(newValue) : Math.round(newValue * 10) / 10;
  });

  // Reconstruct the string
  let result = distanceStr;
  matches.forEach((match, i) => {
    result = result.replace(match, converted[i].toString());
  });

  // Replace unit name
  result = result.replace(/\bmiles?\b/gi, targetUnit);
  result = result.replace(/\bkm\b/gi, targetUnit);

  return result;
}

/**
 * Format speed from meters and seconds to the preferred unit
 * Returns mph or km/h with unit label
 */
export function formatSpeed(distanceMeters: number, movingTimeSeconds: number, unit: DistanceUnit): string {
  if (movingTimeSeconds === 0) return `0.0 ${unit === "miles" ? "mph" : "km/h"}`;

  const miles = distanceMeters / 1609.344;
  const hours = movingTimeSeconds / 3600;
  const mph = miles / hours;

  if (unit === "km") {
    const kmh = milesToKm(mph);
    return `${kmh.toFixed(1)} km/h`;
  }

  return `${mph.toFixed(1)} mph`;
}

/**
 * Format elevation from meters to the preferred unit
 * Returns feet or meters with unit label
 */
export function formatElevation(elevationMeters: number, unit: DistanceUnit): string {
  if (unit === "km") {
    return `${Math.round(elevationMeters)} m`;
  }

  const feet = elevationMeters * 3.28084;
  return `${Math.round(feet)} ft`;
}

/**
 * Convert a pace string from mph to km/h or vice versa
 * Examples: "15-17 mph", "17+ mph", "~16 mph"
 */
export function convertPaceString(paceStr: string, targetUnit: DistanceUnit): string {
  const targetLabel = targetUnit === "km" ? "km/h" : "mph";

  // If already in target unit, return as-is
  if (targetUnit === "km" && paceStr.toLowerCase().includes("km/h")) {
    return paceStr;
  }
  if (targetUnit === "miles" && paceStr.toLowerCase().includes("mph")) {
    return paceStr;
  }

  // Extract numbers and convert
  const numberPattern = /(\d+(?:\.\d+)?)/g;
  const matches = paceStr.match(numberPattern);

  if (!matches) return paceStr;

  const converted = matches.map(num => {
    const value = parseFloat(num);
    const newValue = targetUnit === "km" ? milesToKm(value) : kmToMiles(value);
    return Math.round(newValue); // Round to whole number for pace
  });

  // Reconstruct the string
  let result = paceStr;
  matches.forEach((match, i) => {
    result = result.replace(match, converted[i].toString());
  });

  // Replace unit name
  result = result.replace(/\bmph\b/gi, targetLabel);
  result = result.replace(/\bkm\/h\b/gi, targetLabel);

  return result;
}
