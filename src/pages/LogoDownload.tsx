import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const logos = [
  { label: "Logo fond sombre (SVG)", file: "/logo-ludigami.svg", desc: "GAMI en blanc — pour fonds sombres" },
  { label: "Logo fond clair (SVG)", file: "/logo-ludigami-dark.svg", desc: "GAMI en noir — pour fonds clairs" },
];

const LogoDownload = () => {
  const handleDownload = (file: string, name: string) => {
    const a = document.createElement("a");
    a.href = file;
    a.download = name;
    a.click();
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <main className="section-padding pt-32">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Logo <span className="gradient-text-accent">LUDIGAMI</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Téléchargez le logo au format SVG (vectoriel)
            </p>
          </div>

          <div className="grid gap-8">
            {logos.map((logo) => (
              <div key={logo.file} className="glass-card rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-6">
                <div
                  className={`flex-1 flex items-center justify-center rounded-xl p-6 ${
                    logo.file.includes("dark") ? "bg-white" : "bg-background"
                  }`}
                >
                  <img src={logo.file} alt={logo.label} className="max-w-[240px] w-full" />
                </div>
                <div className="flex flex-col items-center sm:items-start gap-3 text-center sm:text-left">
                  <h3 className="font-display font-semibold text-foreground">{logo.label}</h3>
                  <p className="text-sm text-muted-foreground">{logo.desc}</p>
                  <Button
                    variant="hero"
                    size="sm"
                    onClick={() =>
                      handleDownload(logo.file, logo.file.split("/").pop()!)
                    }
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LogoDownload;
