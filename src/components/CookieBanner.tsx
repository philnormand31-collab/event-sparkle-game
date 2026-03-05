import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ChevronDown, ChevronUp } from "lucide-react";

const COOKIE_CATEGORIES = [
  {
    key: "necessary",
    label: "Nécessaire",
    alwaysOn: true,
    description:
      "Les cookies nécessaires sont cruciaux pour les fonctions de base du site Web et celui-ci ne fonctionnera pas comme prévu sans eux.\n\nCes cookies ne stockent aucune donnée personnellement identifiable.",
  },
  {
    key: "functional",
    label: "Fonctionnelle",
    alwaysOn: false,
    description:
      "Les cookies fonctionnels permettent d'exécuter certaines fonctionnalités telles que le partage du contenu du site Web sur des plateformes de médias sociaux, la collecte de commentaires et d'autres fonctionnalités tierces.",
  },
  {
    key: "analytics",
    label: "Analytique",
    alwaysOn: false,
    description:
      "Les cookies analytiques sont utilisés pour comprendre comment les visiteurs interagissent avec le site Web. Ces cookies aident à fournir des informations sur le nombre de visiteurs, le taux de rebond, la source de trafic, etc.",
  },
  {
    key: "performance",
    label: "Les résultats",
    alwaysOn: false,
    description:
      "Les cookies de performance sont utilisés pour comprendre et analyser les indices de performance clés du site Web, ce qui permet de fournir une meilleure expérience utilisateur aux visiteurs.",
  },
  {
    key: "advertising",
    label: "Publicité",
    alwaysOn: false,
    description:
      "Les cookies de publicité sont utilisés pour fournir aux visiteurs des publicités personnalisées basées sur les pages visitées précédemment et analyser l'efficacité de la campagne publicitaire.",
  },
];

const INTRO_TEXT_SHORT =
  "Les cookies qui sont catégorisés comme « nécessaires » sont stockés sur votre navigateur car ils sont essentiels pour permettre les fonctionnalités de base du site.";
const INTRO_TEXT_FULL =
  "Les cookies qui sont catégorisés comme « nécessaires » sont stockés sur votre navigateur car ils sont essentiels pour permettre les fonctionnalités de base du site. Nous utilisons également des cookies tiers qui nous aident à analyser et à comprendre comment vous utilisez ce site Web. Ces cookies ne seront stockés dans votre navigateur qu'avec votre consentement. Vous avez également la possibilité de désactiver ces cookies. Mais la désactivation de certains de ces cookies peut affecter votre expérience de navigation.";

export const CookieBanner = () => {
  const [visible, setVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [showMoreIntro, setShowMoreIntro] = useState(false);
  const [preferences, setPreferences] = useState<Record<string, boolean>>({
    necessary: true,
    functional: false,
    analytics: false,
    performance: false,
    advertising: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  const handleConsent = (value: string) => {
    if (value === "accepted") {
      const all: Record<string, boolean> = {};
      COOKIE_CATEGORIES.forEach((c) => (all[c.key] = true));
      localStorage.setItem("cookie-preferences", JSON.stringify(all));
    } else if (value === "save") {
      localStorage.setItem("cookie-preferences", JSON.stringify(preferences));
    }
    localStorage.setItem("cookie-consent", value === "save" ? "customized" : value);
    setVisible(false);
  };

  const togglePref = (key: string) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!visible) return null;

  if (showCustomize) {
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center p-4 md:p-6">
        <div className="glass-card rounded-2xl p-6 md:p-8 max-w-3xl w-full border border-border/60 shadow-elevated max-h-[85vh] overflow-y-auto">
          <h2 className="text-lg md:text-xl font-bold text-foreground mb-4">
            Personnaliser les préférences en matière de consentement
          </h2>

          <p className="text-muted-foreground text-sm leading-relaxed mb-2">
            Nous utilisons des cookies pour vous aider à naviguer efficacement et à exécuter
            certaines fonctionnalités. Vous trouverez des informations détaillées sur tous les
            cookies sous chaque catégorie de consentement ci-dessous.
          </p>

          <p className="text-muted-foreground text-sm leading-relaxed mb-1">
            {showMoreIntro ? INTRO_TEXT_FULL : INTRO_TEXT_SHORT + " ..."}
          </p>
          <button
            onClick={() => setShowMoreIntro(!showMoreIntro)}
            className="text-accent text-sm font-medium mb-6 hover:underline inline-flex items-center gap-1"
          >
            {showMoreIntro ? "Afficher moins" : "Afficher plus"}
            {showMoreIntro ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>

          <div className="space-y-4 mb-6">
            {COOKIE_CATEGORIES.map((cat) => (
              <div key={cat.key} className="border border-border/40 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-foreground text-sm">{cat.label}</span>
                  {cat.alwaysOn ? (
                    <span className="text-xs font-medium text-accent">Toujours actif</span>
                  ) : (
                    <Switch
                      checked={preferences[cat.key]}
                      onCheckedChange={() => togglePref(cat.key)}
                    />
                  )}
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed whitespace-pre-line">
                  {cat.description}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleConsent("rejected")}
            >
              Tout rejeter
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleConsent("save")}
            >
              Enregistrer mes préférences
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
  }

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
            onClick={() => setShowCustomize(true)}
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
