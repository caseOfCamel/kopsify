# Self-Hosted Fonts

This directory contains locally-hosted font files to ensure the application complies with Content Security Policy (CSP) requirements and doesn't rely on external content delivery networks.

## Included Fonts

The application primarily uses the Helvetica Neue font family, with fallbacks to Helvetica, Arial, and the system's sans-serif font.

### Font Files
For a production application, you would add the following files:

- `helvetica-neue-regular.woff2`
- `helvetica-neue-regular.woff`
- `helvetica-neue-medium.woff2`
- `helvetica-neue-medium.woff`
- `helvetica-neue-bold.woff2`
- `helvetica-neue-bold.woff`

## Font Loading

These fonts are loaded via CSS using @font-face declarations in the global.css file:

```css
@font-face {
  font-family: 'Helvetica Neue';
  src: url('/assets/fonts/helvetica/helvetica-neue-regular.woff2') format('woff2'),
       url('/assets/fonts/helvetica/helvetica-neue-regular.woff') format('woff');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Helvetica Neue';
  src: url('/assets/fonts/helvetica/helvetica-neue-medium.woff2') format('woff2'),
       url('/assets/fonts/helvetica/helvetica-neue-medium.woff') format('woff');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Helvetica Neue';
  src: url('/assets/fonts/helvetica/helvetica-neue-bold.woff2') format('woff2'),
       url('/assets/fonts/helvetica/helvetica-neue-bold.woff') format('woff');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

## Legal Considerations

Please ensure you have the appropriate licenses to use these fonts in your application. Helvetica Neue is not a free font, and proper licensing is required for commercial use.

## Alternatives

If you don't have a license for Helvetica Neue, consider using one of these alternative free fonts that provide a similar aesthetic:

- Inter (open source)
- Public Sans (open source)
- Work Sans (open source)

You would need to download these fonts and place them in this directory to maintain CSP compliance.