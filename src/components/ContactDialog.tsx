import { useState, useEffect } from "react";
import { Send, CheckCircle } from "lucide-react";
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

interface ContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingInfo?: BookingInfo | null;
}

const CONTACT_EMAIL = "phil.normand31@gmail.com";
const MAX_MESSAGE_LENGTH = 300;

export const ContactDialog = ({ open, onOpenChange, bookingInfo }: ContactDialogProps) => {
  const { toast } = useToast();
  const [sent, setSent] = useState(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    const subject = encodeURIComponent(
      `Contact LUDIGAMI — ${form.prenom} ${form.nom}`
    );
    const body = encodeURIComponent(
      `Nom : ${form.nom}\nPrénom : ${form.prenom}\nFonction : ${form.fonction}\nÉtablissement : ${form.etablissement}\nTéléphone : ${form.telephone}\nE-mail : ${form.email}\n\nMessage :\n${form.message}`
    );
    window.open(`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`, "_self");
    setSent(true);
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
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Contactez-nous</DialogTitle>
          <DialogDescription>
            Remplissez le formulaire ci-dessous et nous vous répondrons rapidement.
          </DialogDescription>
        </DialogHeader>

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
              disabled={!isValid}
            >
              <Send className="w-4 h-4 mr-2" />
              Envoyer
            </Button>
          </form>
        ) : (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-accent" />
            </div>
            <h3 className="font-display text-lg font-semibold">Message envoyé !</h3>
            <p className="text-muted-foreground">
              Merci pour votre message. Nous reviendrons vers vous très rapidement.
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
