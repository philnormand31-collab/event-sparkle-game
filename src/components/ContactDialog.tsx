import { useState, useEffect } from "react";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import type { BookingInfo } from "@/components/BookingDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingInfo?: BookingInfo | null;
}

const CONTACT_EMAIL = "infos@ludigami.fr";
const MAX_MESSAGE_LENGTH = 300;

export const ContactDialog = ({ open, onOpenChange, bookingInfo }: ContactDialogProps) => {
  const { toast } = useToast();
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    fonction: "",
    etablissement: "",
    telephone: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    if (open && bookingInfo) {
      setForm((prev) => ({
        ...prev,
        message: `Rendez-vous visio demandé le ${bookingInfo.date} à ${bookingInfo.time}.`,
      }));
    }
  }, [open, bookingInfo]);

  const handleChange = (field: string, value: string) => {
    if (field === "message" && value.length > MAX_MESSAGE_LENGTH) return;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isValid =
    form.nom.trim() &&
    form.prenom.trim() &&
    form.fonction.trim() &&
    form.etablissement.trim() &&
    form.telephone.trim() &&
    form.email.trim() &&
    form.email.includes("@");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || submitting) return;

    setSubmitting(true);
    try {
      // Save to database
      const source = bookingInfo ? "visio" : "contact";
      const { error } = await supabase.from("contact_submissions").insert({
        nom: form.nom.trim(),
        prenom: form.prenom.trim(),
        fonction: form.fonction.trim(),
        etablissement: form.etablissement.trim(),
        telephone: form.telephone.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
        source,
      });

      if (error) {
        console.error("Erreur enregistrement:", error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue. Veuillez réessayer.",
          variant: "destructive",
        });
        return;
      }

      setSent(true);
    } catch (err) {
      console.error("Erreur:", err);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setSent(false);
      setForm({ nom: "", prenom: "", fonction: "", etablissement: "", telephone: "", email: "", message: "" });
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[520px] bg-card border-border max-h-[90vh] overflow-y-auto">
        {!sent && (
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Contactez-nous</DialogTitle>
            <DialogDescription>
              Remplissez le formulaire ci-dessous et nous vous répondrons rapidement.
            </DialogDescription>
          </DialogHeader>
        )}

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="nom">Votre nom *</Label>
                <Input
                  id="nom"
                  placeholder="Dupont"
                  value={form.nom}
                  onChange={(e) => handleChange("nom", e.target.value)}
                  maxLength={100}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="prenom">Votre prénom *</Label>
                <Input
                  id="prenom"
                  placeholder="Jean"
                  value={form.prenom}
                  onChange={(e) => handleChange("prenom", e.target.value)}
                  maxLength={100}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="fonction">Votre fonction *</Label>
              <Input
                id="fonction"
                placeholder="Directeur, Responsable..."
                value={form.fonction}
                onChange={(e) => handleChange("fonction", e.target.value)}
                maxLength={100}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="etablissement">Nom de l'établissement *</Label>
              <Input
                id="etablissement"
                placeholder="École, Entreprise..."
                value={form.etablissement}
                onChange={(e) => handleChange("etablissement", e.target.value)}
                maxLength={150}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="telephone">Votre téléphone *</Label>
                <Input
                  id="telephone"
                  type="tel"
                  placeholder="06 00 00 00 00"
                  value={form.telephone}
                  onChange={(e) => handleChange("telephone", e.target.value)}
                  maxLength={20}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="contact-email">Votre adresse e-mail *</Label>
                <Input
                  id="contact-email"
                  type="email"
                  placeholder="jean@exemple.fr"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  maxLength={255}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="message">Votre message</Label>
              <Textarea
                id="message"
                placeholder="Écrivez votre message ici..."
                value={form.message}
                onChange={(e) => handleChange("message", e.target.value)}
                maxLength={MAX_MESSAGE_LENGTH}
                rows={4}
              />
              <p className="text-xs text-muted-foreground text-right">
                {form.message.length}/{MAX_MESSAGE_LENGTH} caractères
              </p>
            </div>

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={!isValid || submitting}
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              {submitting ? "Envoi en cours..." : "Envoyer"}
            </Button>
          </form>
        ) : (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-accent" />
            </div>
            <h3 className="font-display text-lg font-semibold">Message envoyé !</h3>
            <p className="text-muted-foreground">
              {bookingInfo
                ? "Merci, votre message est en attente de validation. Une confirmation vous sera envoyée rapidement par email avec le lien de connexion pour la visio !"
                : "Merci pour votre message que nous allons traiter dans les meilleurs délais !"}
            </p>
            <Button variant="glass" onClick={handleClose} className="mt-4">
              Fermer
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
