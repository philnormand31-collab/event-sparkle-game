import { useState, useEffect } from "react";
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

const BOOKED_SLOTS_KEY = "ludigami_booked_slots";

export interface BookingInfo {
  date: string;
  time: string;
}

function getBookedSlots(): Record<string, string[]> {
  try {
    return JSON.parse(localStorage.getItem(BOOKED_SLOTS_KEY) || "{}");
  } catch {
    return {};
  }
}

function addBookedSlot(dateKey: string, time: string) {
  const slots = getBookedSlots();
  if (!slots[dateKey]) slots[dateKey] = [];
  if (!slots[dateKey].includes(time)) slots[dateKey].push(time);
  localStorage.setItem(BOOKED_SLOTS_KEY, JSON.stringify(slots));
}

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm?: (info: BookingInfo) => void;
}

export const BookingDialog = ({ open, onOpenChange, onConfirm }: BookingDialogProps) => {
  const [date, setDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [bookedSlots, setBookedSlots] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (open) {
      setBookedSlots(getBookedSlots());
    }
  }, [open]);

  const selectedDateKey = date ? format(date, "yyyy-MM-dd") : "";
  const takenSlots = selectedDateKey ? (bookedSlots[selectedDateKey] || []) : [];

  const handleConfirm = () => {
    if (date && selectedTime) {
      const dateKey = format(date, "yyyy-MM-dd");
      addBookedSlot(dateKey, selectedTime);
      const info: BookingInfo = {
        date: format(date, "d MMMM yyyy", { locale: fr }),
        time: selectedTime,
      };
      handleClose();
      onConfirm?.(info);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setDate(undefined);
      setSelectedTime(undefined);
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
            Choisissez une date et un créneau horaire pour votre rendez-vous pro
          </DialogDescription>
        </DialogHeader>

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
              onSelect={(d) => { setDate(d); setSelectedTime(undefined); }}
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
                {timeSlots.map((time) => {
                  const isTaken = takenSlots.includes(time);
                  return (
                    <button
                      key={time}
                      onClick={() => !isTaken && setSelectedTime(time)}
                      disabled={isTaken}
                      className={cn(
                        "px-3 py-2 rounded-lg text-sm font-medium transition-all border",
                        isTaken
                          ? "bg-muted text-muted-foreground border-border opacity-50 cursor-not-allowed line-through"
                          : selectedTime === time
                            ? "bg-accent text-accent-foreground border-accent"
                            : "bg-secondary/50 text-foreground border-border hover:border-accent/50"
                      )}
                    >
                      {time}
                    </button>
                  );
                })}
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
      </DialogContent>
    </Dialog>
  );
};
