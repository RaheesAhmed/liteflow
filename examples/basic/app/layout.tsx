import "./globals.css";

export const metadata = {
  title: "LiteFlow UI Demo",
  description: "A demo of LiteFlow UI components",
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
