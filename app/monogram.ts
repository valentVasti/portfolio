/** The "V." monogram used for the favicon: a light V and a square dot on a near-black tile, drawn on a 32-unit grid.
    Shared by the build script that writes app/icon.svg, favicon.ico and apple-icon.png, and by the live favicon that
    recolours the dot to the selected accent. */
export function monogramSvg(dot: string, { rounded = true }: { rounded?: boolean } = {}) {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">` +
    `<rect width="32" height="32"${rounded ? ' rx="6"' : ""} fill="#0a0a0a"/>` +
    `<path d="M6 7h4.2l4.8 13.6L19.8 7H24l-7 18h-4z" fill="#ededed"/>` +
    `<rect x="21.5" y="21" width="4" height="4" fill="${dot}"/>` +
    `</svg>`
  );
}
