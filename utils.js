export const centsOffToPercentage = (cents) =>
  cents ? 0.5 + cents / 100 : 0.5

export const getColorsArray = () => {
  const primaryColor = "#EA506F";
  const lightPink = "#e89eac";
  const baseColors = new Array(31).fill(lightPink);
  // Orta 5 çubuğu primary color yap
  baseColors[13] = primaryColor;
  baseColors[14] = primaryColor;
  baseColors[15] = primaryColor;
  baseColors[16] = primaryColor;
  baseColors[17] = primaryColor;
  return baseColors;
}

export const getSegmentLengths = () => {
  // Orta 5 segment daha uzun, diğerleri daha kısa
  return Array.from({ length: 31 }, (_, i) => (i >= 13 && i <= 17 ? 1.0 : 0.8));
}

export const noteStrings = [
  "C", "C#", "D", "D#", "E", "F",
  "F#", "G", "G#", "A", "A#", "B"
];

export function getNoteFromPitchFrequency(freq) {
  return Math.round(12 * (Math.log(freq / 440) / Math.log(2))) + 69;
}

export function getPitchFrequencyFromNote(note) {
  return 440 * Math.pow(2, (note - 69) / 12);
}

export function centsOffPitch(frequencyPlayed, correctFrequency) {
  return Math.floor(
    (1200 * Math.log(frequencyPlayed / correctFrequency)) / Math.log(2)
  );
} 