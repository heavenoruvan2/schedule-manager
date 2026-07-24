export interface AutoThemeConfig {
  autoEnabled: boolean;
  mode: 'sunset' | 'time' | 'system';
  dayStartHour: number; // 0-23, e.g., 6 for 6:00 AM
  nightStartHour: number; // 0-23, e.g., 18 for 6:00 PM
  manualOverrideTheme: 'light' | 'dark' | 'amoled' | 'material-you' | null;
  useAmoledForNight: boolean;
  userCoords?: { latitude: number; longitude: number } | null;
}

export interface AutoThemeResult {
  theme: 'light' | 'dark' | 'amoled';
  isDaylight: boolean;
  sunriseStr: string;
  sunsetStr: string;
  reason: string;
  nextTransitionText: string;
}

/**
 * Calculates approximate sunrise & sunset for a given lat/lon and date.
 * Uses standard solar declination and zenith formulas.
 */
export function calculateSunriseSunset(
  lat: number = 40.7128,
  lon: number = -74.0060,
  date: Date = new Date()
) {
  try {
    const dayOfYear = Math.floor(
      (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    );

    // Approximate solar declination angle in radians
    const declination = 23.45 * Math.sin(((2 * Math.PI) / 365) * (dayOfYear - 81));
    const latRad = (Math.PI / 180) * lat;
    const decRad = (Math.PI / 180) * declination;

    // Cosine of hour angle for zenith = 90.83 deg (official sunrise/sunset)
    const cosHourAngle =
      (Math.cos((Math.PI / 180) * 90.83) - Math.sin(latRad) * Math.sin(decRad)) /
      (Math.cos(latRad) * Math.cos(decRad));

    let halfDayHours = 6;
    if (cosHourAngle >= 1) {
      // Polar night
      halfDayHours = 0;
    } else if (cosHourAngle <= -1) {
      // Midnight sun
      halfDayHours = 12;
    } else {
      const hourAngleDeg = (180 / Math.PI) * Math.acos(cosHourAngle);
      halfDayHours = hourAngleDeg / 15;
    }

    // Solar noon in local time hours
    const timezoneOffsetHours = date.getTimezoneOffset() / 60;
    const solarNoonLocal = 12 - lon / 15 - timezoneOffsetHours;

    let sunriseHour = solarNoonLocal - halfDayHours;
    let sunsetHour = solarNoonLocal + halfDayHours;

    // Normalize to 0-24 range
    sunriseHour = ((sunriseHour % 24) + 24) % 24;
    sunsetHour = ((sunsetHour % 24) + 24) % 24;

    const formatHourMinutes = (decimalHours: number) => {
      let h = Math.floor(decimalHours);
      let m = Math.floor((decimalHours - h) * 60);
      if (m >= 60) {
        h += 1;
        m = 0;
      }
      const period = h >= 12 && h < 24 ? 'PM' : 'AM';
      const displayH = h % 12 === 0 ? 12 : h % 12;
      return `${displayH}:${m.toString().padStart(2, '0')} ${period}`;
    };

    const currentHourDecimal = date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;

    let isDaylight = false;
    if (sunriseHour < sunsetHour) {
      isDaylight = currentHourDecimal >= sunriseHour && currentHourDecimal < sunsetHour;
    } else {
      // Crosses midnight
      isDaylight = currentHourDecimal >= sunriseHour || currentHourDecimal < sunsetHour;
    }

    return {
      isDaylight,
      sunriseHour,
      sunsetHour,
      sunriseStr: formatHourMinutes(sunriseHour),
      sunsetStr: formatHourMinutes(sunsetHour),
    };
  } catch (e) {
    // Fallback if calculation fails
    const currentH = date.getHours();
    const isDaylight = currentH >= 6 && currentH < 18;
    return {
      isDaylight,
      sunriseHour: 6,
      sunsetHour: 18,
      sunriseStr: '6:00 AM',
      sunsetStr: '6:00 PM',
    };
  }
}

/**
 * Main evaluation function for auto-theming state.
 */
export function evaluateAutoTheme(
  config: AutoThemeConfig,
  currentDate: Date = new Date()
): AutoThemeResult {
  // If manual override is active
  if (config.manualOverrideTheme) {
    const isDark = config.manualOverrideTheme !== 'light';
    return {
      theme: config.manualOverrideTheme as 'light' | 'dark' | 'amoled',
      isDaylight: !isDark,
      sunriseStr: '6:00 AM',
      sunsetStr: '6:00 PM',
      reason: 'Manual Override Active',
      nextTransitionText: 'Auto-switching paused',
    };
  }

  const currentHour = currentDate.getHours() + currentDate.getMinutes() / 60;

  if (config.mode === 'system') {
    const prefersDark =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const nightTheme = config.useAmoledForNight ? 'amoled' : 'dark';
    return {
      theme: prefersDark ? nightTheme : 'light',
      isDaylight: !prefersDark,
      sunriseStr: 'System OS',
      sunsetStr: 'System OS',
      reason: prefersDark ? 'Matched OS Dark Mode' : 'Matched OS Light Mode',
      nextTransitionText: 'Follows device system theme',
    };
  }

  if (config.mode === 'time') {
    const isDay = currentHour >= config.dayStartHour && currentHour < config.nightStartHour;
    const nightTheme = config.useAmoledForNight ? 'amoled' : 'dark';
    const dayStartStr = formatHourSimple(config.dayStartHour);
    const nightStartStr = formatHourSimple(config.nightStartHour);

    let nextTransition = '';
    if (isDay) {
      nextTransition = `Night schedule starts at ${nightStartStr}`;
    } else {
      nextTransition = `Day schedule starts at ${dayStartStr}`;
    }

    return {
      theme: isDay ? 'light' : nightTheme,
      isDaylight: isDay,
      sunriseStr: dayStartStr,
      sunsetStr: nightStartStr,
      reason: isDay
        ? `Daytime schedule (${dayStartStr} – ${nightStartStr})`
        : `Evening schedule (${nightStartStr} – ${dayStartStr})`,
      nextTransitionText: nextTransition,
    };
  }

  // 'sunset' mode
  const lat = config.userCoords?.latitude ?? 40.7128;
  const lon = config.userCoords?.longitude ?? -74.0060;
  const solar = calculateSunriseSunset(lat, lon, currentDate);
  const nightTheme = config.useAmoledForNight ? 'amoled' : 'dark';

  let nextTransition = '';
  if (solar.isDaylight) {
    nextTransition = `Sunset at ${solar.sunsetStr}`;
  } else {
    nextTransition = `Sunrise at ${solar.sunriseStr}`;
  }

  return {
    theme: solar.isDaylight ? 'light' : nightTheme,
    isDaylight: solar.isDaylight,
    sunriseStr: solar.sunriseStr,
    sunsetStr: solar.sunsetStr,
    reason: solar.isDaylight
      ? `Daylight (Sunrise ${solar.sunriseStr} • Sunset ${solar.sunsetStr})`
      : `Dusk/Night (Sunset was at ${solar.sunsetStr})`,
    nextTransitionText: nextTransition,
  };
}

function formatHourSimple(hour: number): string {
  const h = Math.floor(hour);
  const period = h >= 12 && h < 24 ? 'PM' : 'AM';
  const displayH = h % 12 === 0 ? 12 : h % 12;
  return `${displayH}:00 ${period}`;
}
