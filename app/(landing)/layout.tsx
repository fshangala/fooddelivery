import Footer from "@/lib/components/footer";
import Header from "@/lib/components/header";

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <Header />
    <main className="max-w-7xl mx-auto min-h-screen">
    {children}
    </main>
    <Footer />
    </>
  );
}