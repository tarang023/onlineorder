// app/layout.js

import './globals.css';
import Providers from './providers.js'

export const metadata = {
  title: 'Taste bite restaurant',
  description: ' Experience fast & easy online ordering on the tastebite',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}