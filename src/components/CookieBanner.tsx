import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  const handleConsent = (value: string) => {
    localStorage.setItem("cookie-consent", value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 flex justify-center">
      <div className="glass-card rounded-2xl p-6 md:p-8 max-w-3xl w-full border border-border/60 shadow-elevated">
        <p className="text-foreground text-sm md:text-base leading-relaxed mb-6">
          Nous respectons votre vie privée. Nous utilisons des cookies pour améliorer votre
          expérience de navigation, diffuser des publicités ou des contenus personnalisés et
          analyser notre trafic. En cliquant sur « Tout accepter », vous consentez à notre
          utilisation des cookies.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleConsent("customize")}
            className="text-muted-foreground hover:text-foreground"
          >
            Personnaliser
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleConsent("rejected")}
          >
            Tout rejeter
          </Button>
          <Button
            variant="hero"
            size="sm"
            onClick={() => handleConsent("accepted")}
          >
            Accepter tout
          </Button>
        </div>
      </div>
    </div>
  );
};
