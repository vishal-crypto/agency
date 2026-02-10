import { Header, Footer } from '@/components/layout';

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-16 lg:pt-20">{children}</main>
      <Footer />
    </>
  );
}
