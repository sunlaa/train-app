import { MARKER_BORDER_COLOR, MARKER_BORDER_WEIGHT } from '../config/consts';

export const mapMarkerTemplate = (color: string): string => {
  return `<svg width="40" height="40" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="${color}" stroke="${MARKER_BORDER_COLOR}" stroke-width="${MARKER_BORDER_WEIGHT}" d="M12 2C8.1 2 5 5.1 5 9c0 5.3 7 13 7 13s7-7.7 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5s2.5 1.1 2.5 2.5S13.4 11.5 12 11.5z"/>
  </svg>`;
};
