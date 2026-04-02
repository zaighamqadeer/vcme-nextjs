import './globals.css';
import { FirebaseProvider } from '../context/FirebaseContext';

export const metadata = {
  title: 'VibeCode Academy',
  description: 'Learn the art of Vibe Coding—building software through natural language and AI—with interactive, Duolingo-style lessons.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <FirebaseProvider>
          {children}
        </FirebaseProvider>
      </body>
    </html>
  );
}
