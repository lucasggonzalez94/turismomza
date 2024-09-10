export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="min-h-screen bg-red-500">{children}</main>;
}
