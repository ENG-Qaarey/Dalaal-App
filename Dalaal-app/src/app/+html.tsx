import { ScrollViewStyleReset } from 'expo-router/html';

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="description" content="Dalaal - Somalia's Real Estate & Vehicle Marketplace. Buy, sell, and rent properties and vehicles." />
        <meta name="theme-color" content="#1e5fb8" />
        <meta property="og:title" content="Dalaal - Real Estate & Vehicles" />
        <meta property="og:description" content="Somalia's Real Estate & Vehicle Marketplace. Buy, sell, and rent properties and vehicles." />
        <meta property="og:type" content="website" />

        <title>Dalaal - Real Estate & Vehicles</title>

        <link rel="icon" href="/favicon.png" sizes="any" />

        <ScrollViewStyleReset />

        <style dangerouslySetInnerHTML={{ __html: globalCSS }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const globalCSS = `
* {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

html, body, #root {
  height: 100%;
  margin: 0;
  padding: 0;
}

body {
  background-color: #E6F4FE;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overscroll-behavior: none;
}

@media (prefers-color-scheme: dark) {
  body {
    background-color: #030407;
  }
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.15);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(0,0,0,0.25);
}

@media (prefers-color-scheme: dark) {
  ::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.15);
  }
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255,255,255,0.25);
  }
}

/* Focus visible for keyboard navigation */
:focus-visible {
  outline: 2px solid #1e5fb8;
  outline-offset: 2px;
}

/* Selection color */
::selection {
  background: rgba(30, 95, 184, 0.3);
}

/* Smooth transitions for theme changes */
body, #root {
  transition: background-color 0.2s ease;
}

/* Responsive container max-width */
@media (min-width: 1200px) {
  #root > div {
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
  }
}
`;
