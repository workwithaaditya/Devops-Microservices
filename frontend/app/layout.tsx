import '../styles/globals.css';

export const metadata = {
  title: 'Social Media App',
  description: 'A simple social media application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
