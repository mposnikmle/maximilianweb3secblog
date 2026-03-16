/**
 * Lightweight gradient generator for book covers
 * Generates unique, beautiful gradients based on string input (title/slug)
 * Zero dependencies, pure CSS - ~50 lines of code
 */

// Hash function to generate consistent colors from strings
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Generate VIBRANT psychedelic colors from hash
function generateColor(seed: number, index: number): string {
  const hue = (seed + index * 137) % 360; // Full spectrum
  const saturation = 75 + (seed % 25); // 75-100% - highly saturated!
  const lightness = 50 + (seed % 25); // 50-75% - bright and vibrant
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

// Gradient patterns for variety
const gradientTypes = [
  (c1: string, c2: string) => `linear-gradient(135deg, ${c1}, ${c2})`,
  (c1: string, c2: string) => `linear-gradient(45deg, ${c1}, ${c2})`,
  (c1: string, c2: string) =>
    `linear-gradient(135deg, ${c1} 0%, ${c2} 50%, ${c1} 100%)`,
  (c1: string, c2: string) =>
    `radial-gradient(circle at top right, ${c1}, ${c2})`,
  (c1: string, c2: string) =>
    `linear-gradient(to right, ${c1}, ${c2}, ${c1})`,
];

/**
 * Generate a unique gradient for a post
 * @param title - Post title or slug
 * @returns CSS gradient string
 */
export function generateGradient(title: string): string {
  const hash = hashString(title);
  const color1 = generateColor(hash, 0);
  const color2 = generateColor(hash, 1);
  const gradientIndex = hash % gradientTypes.length;
  
  return gradientTypes[gradientIndex](color1, color2);
}

