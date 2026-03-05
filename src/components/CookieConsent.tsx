import { useState, useEffect } from "react";
import { X, ChevronDown, ChevronRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface CookieCategory {
  key: string;
  label: string;
  description: string;
  required?: boolean;
  enabled: boolean;
}

const defaultCategories: CookieCategory[] = [
  {
    key: "necessary",
    label: "Nécessaire",
    description:
      "Les cookies nécessaires sont absolument essentiels au bon fonctionnement du site Web. Ces cookies assurent les fonctionnalités de base et les fonctions de sécurité du site Web, de manière anonyme.",
    required: true,
    enabled: true,
  },
  {
    key: "functional",
    label: "Fonctionnel",
    description:
      "Les cookies fonctionnels aident à exécuter certaines fonctionnalités telles que le partage du contenu du site Web sur les plates-formes de médias sociaux, la collecte de commentaires et d'autres fonctionnalités tierces.",
    enabled: false,
  },
  {
    key: "performance",
    label: "Performance",
    description:
      "Les cookies de performance sont utilisés pour comprendre et analyser les principaux indices de performance du site Web, ce qui contribue à offrir une meilleure expérience utilisateur aux visiteurs.",
    enabled: false,
  },
  {
    key: "analytics",
    label: "Analytique",
    description:
      "Les cookies analytiques sont utilisés pour comprendre comment les visiteurs interagissent avec le site Web. Ces cookies aident à fournir des informations sur les mesures du nombre de visiteurs, du taux de rebond, de la source du trafic, etc.",
    enabled: false,
  },
  {
    key: "advertising",
    label: "Publicité",
    description:
      "Les cookies publicitaires sont utilisés pour fournir aux visiteurs des publicités et des campagnes marketing pertinentes. Ces cookies suivent les visiteurs sur les sites Web et collectent des informations pour fournir des publicités personnalisées.",
    enabled: false,
  },
  {
    key: "other",
    label: "Autres",
    description: "",
    enabled: false,
  },
];

export const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [categories, setCategories] = useState<CookieCategory[]>(defaultCategories);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setVisible(true);
    }

    const handleReopen = () => {
      setShowSettings(false);
      setVisible(true);
    };
    window.addEventListener("open-cookie-settings", handleReopen);
    return () => window.removeEventListener("open-cookie-settings", handleReopen);
  }, []);

  const acceptAll = () => {
    const all = categories.map((c) => ({ ...c, enabled: true }));
    localStorage.setItem("cookie-consent", JSON.stringify(Object.fromEntries(all.map((c) => [c.key, true]))));
    setVisible(false);
  };

  const saveSettings = () => {
    const prefs = Object.fromEntries(categories.map((c) => [c.key, c.enabled]));
    localStorage.setItem("cookie-consent", JSON.stringify(prefs));
    setVisible(false);
    setShowSettings(false);
  };

  const toggleCategory = (key: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.key === key && !c.required ? { ...c, enabled: !c.enabled } : c))
    );
  };

  const toggleExpand = (key: string) => {
    setExpandedKey((prev) => (prev === key ? null : key));
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      {!showSettings ? (
        /* ─── Banner ─── */
        <div className="mx-4 max-w-lg rounded-xl bg-white p-6 shadow-2xl text-gray-800">
          <p className="text-sm leading-relaxed">
            Nous utilisons des cookies sur notre site pour vous offrir l'expérience la plus pertinente possible en
            mémorisant vos préférences et les visites répétées. En cliquant sur «TOUT ACCEPTER », vous consentez à
            l'utilisation de TOUS les cookies. Cependant, vous pouvez visiter "Paramètres des cookies" pour fournir un
            consentement contrôlé.
          </p>
          <div className="mt-5 flex items-center justify-between">
            <button
              onClick={() => setShowSettings(true)}
              className="text-sm font-medium text-gray-700 underline underline-offset-4 hover:text-accent transition-colors"
            >
              Paramètres des cookies
            </button>
            <button
              onClick={acceptAll}
              className="rounded bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
            >
              TOUT ACCEPTER
            </button>
          </div>
        </div>
      ) : (
        /* ─── Settings panel ─── */
        <div className="mx-4 max-w-lg w-full rounded-xl bg-white shadow-2xl text-gray-800 max-h-[85vh] flex flex-col">
          {/* Close */}
          <div className="flex justify-end p-4 pb-0">
            <button onClick={() => setShowSettings(false)} className="text-gray-500 hover:text-gray-800 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Intro text */}
          <div className="px-6 pb-4">
            <p className="text-sm leading-relaxed text-gray-700">
              Notre site utilise des cookies pour améliorer votre expérience pendant votre visite. Parmi ceux-ci, les
              cookies classés comme nécessaires sont stockés sur votre navigateur car ils sont essentiels au fonctionnement
              des fonctionnalités de base du site. Nous utilisons également des cookies tiers qui nous aident à analyser et
              à comprendre comment vous utilisez ce site. Ces cookies ne seront pas stockés dans votre navigateur qu'avec
              votre consentement. Vous avez également la possibilité de désactiver ces cookies. Mais la désactivation de
              certains de ces cookies peut affecter votre expérience de navigation.
            </p>
          </div>

          {/* Categories */}
          <div className="flex-1 overflow-y-auto px-6 pb-4">
            <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
              {categories.map((cat) => (
                <div key={cat.key}>
                  {/* Row header */}
                  <button
                    onClick={() => cat.description && toggleExpand(cat.key)}
                    className="flex w-full items-center justify-between py-3 text-left"
                  >
                    <span className="flex items-center gap-1.5 text-sm font-medium text-gray-800">
                      {cat.description ? (
                        expandedKey === cat.key ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )
                      ) : (
                        <ChevronRight className="h-4 w-4 opacity-0" />
                      )}
                      {cat.label}
                    </span>
                    <span className="flex items-center gap-2">
                      {cat.required ? (
                        <span className="text-xs text-gray-500">Toujours activé</span>
                      ) : (
                        <>
                          <span className={cn("text-xs", cat.enabled ? "text-accent" : "text-gray-500")}>
                            {cat.enabled ? "Activé" : "Désactivé"}
                          </span>
                          <Switch
                            checked={cat.enabled}
                            onCheckedChange={() => toggleCategory(cat.key)}
                            className="data-[state=checked]:bg-accent"
                          />
                        </>
                      )}
                    </span>
                  </button>
                  {/* Expanded description */}
                  {expandedKey === cat.key && cat.description && (
                    <p className="pb-3 pl-6 text-sm leading-relaxed text-gray-600">{cat.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Save button */}
          <div className="flex justify-end px-6 py-4 border-t border-gray-100">
            <button
              onClick={saveSettings}
              className="rounded bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground hover:opacity-90 transition-opacity"
            >
              Enregistrer & appliquer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
