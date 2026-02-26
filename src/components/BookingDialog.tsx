import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00",
];

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BookingDialog = ({ open, onOpenChange }: BookingDialogProps) => {
  const [date, setDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    if (date && selectedTime) {
      setConfirmed(true);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setDate(undefined);
      setSelectedTime(undefined);
      setConfirmed(false);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            Réservez votre visio
          </DialogTitle>
          <DialogDescription>
            Choisissez une date et un créneau horaire pour votre démonstration personnalisée.
          </DialogDescription>
        </DialogHeader>

        {!confirmed ? (
          <div className="space-y-6">
            {/* Calendar */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CalendarIcon className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">Choisir une date</span>
              </div>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(d) => d < new Date() || d.getDay() === 0 || d.getDay() === 6}
                className="rounded-xl border border-border pointer-events-auto"
                locale={fr}
              />
            </div>

            {/* Time slots */}
            {date && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium">
                    Créneaux disponibles — {format(date, "d MMMM yyyy", { locale: fr })}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={cn(
                        "px-3 py-2 rounded-lg text-sm font-medium transition-all border",
                        selectedTime === time
                          ? "bg-accent text-accent-foreground border-accent"
                          : "bg-secondary/50 text-foreground border-border hover:border-accent/50"
                      )}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Confirm button */}
            {date && selectedTime && (
              <Button
                variant="hero"
                size="lg"
                className="w-full"
                onClick={handleConfirm}
              >
                Confirmer le {format(date, "d MMMM", { locale: fr })} à {selectedTime}
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
              <CalendarIcon className="w-8 h-8 text-accent" />
            </div>
            <h3 className="font-display text-lg font-semibold">Rendez-vous confirmé !</h3>
            <p className="text-muted-foreground">
              Votre démo est prévue le{" "}
              <span className="text-foreground font-medium">
                {date && format(date, "d MMMM yyyy", { locale: fr })}
              </span>{" "}
              à <span className="text-foreground font-medium">{selectedTime}</span>.
            </p>
            <p className="text-sm text-muted-foreground">
              Un email de confirmation vous sera envoyé sous peu.
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
