import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Trash2, Search, Download, Loader2, Mail, Phone } from "lucide-react";
import { toast } from "sonner";

interface ContactSubmission {
  id: string;
  nom: string;
  prenom: string;
  fonction: string;
  etablissement: string;
  telephone: string;
  email: string;
  message: string | null;
  source: string | null;
  created_at: string;
}

const AdminCRM = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string>("all");

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate("/admin");
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchSubmissions();
    }
  }, [user, isAdmin]);

  const fetchSubmissions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erreur lors du chargement des soumissions");
      console.error(error);
    } else {
      setSubmissions(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("contact_submissions")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Erreur lors de la suppression");
    } else {
      toast.success("Soumission supprimée");
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleExportCSV = () => {
    const headers = ["Date", "Source", "Nom", "Prénom", "Fonction", "Établissement", "Téléphone", "Email", "Message"];
    const rows = filtered.map((s) => [
      new Date(s.created_at).toLocaleString("fr-FR"),
      s.source || "contact",
      s.nom,
      s.prenom,
      s.fonction,
      s.etablissement,
      s.telephone,
      s.email,
      (s.message || "").replace(/"/g, '""'),
    ]);

    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contacts_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = submissions.filter((s) => {
    const matchesSearch =
      !search ||
      `${s.nom} ${s.prenom} ${s.email} ${s.etablissement} ${s.fonction}`
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchesSource = sourceFilter === "all" || s.source === sourceFilter;
    return matchesSearch && matchesSource;
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-display text-2xl font-bold">
                <span className="text-accent">CRM</span> — Contacts
              </h1>
              <p className="text-sm text-muted-foreground">
                {filtered.length} soumission{filtered.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleExportCSV} disabled={filtered.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Exporter CSV
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, email, établissement..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les sources</SelectItem>
              <SelectItem value="contact">Contact</SelectItem>
              <SelectItem value="visio">Visio</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Aucune soumission trouvée.
          </div>
        ) : (
          <div className="rounded-xl border border-border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Nom / Prénom</TableHead>
                  <TableHead>Fonction</TableHead>
                  <TableHead>Établissement</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="whitespace-nowrap text-sm">
                      {new Date(s.created_at).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                      <br />
                      <span className="text-xs text-muted-foreground">
                        {new Date(s.created_at).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={s.source === "visio" ? "default" : "secondary"}>
                        {s.source === "visio" ? "Visio" : "Contact"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {s.nom} {s.prenom}
                    </TableCell>
                    <TableCell className="text-sm">{s.fonction}</TableCell>
                    <TableCell className="text-sm">{s.etablissement}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-sm">
                        <a
                          href={`mailto:${s.email}`}
                          className="flex items-center gap-1 text-accent hover:underline"
                        >
                          <Mail className="w-3 h-3" />
                          {s.email}
                        </a>
                        <a
                          href={`tel:${s.telephone}`}
                          className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                        >
                          <Phone className="w-3 h-3" />
                          {s.telephone}
                        </a>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] text-sm text-muted-foreground truncate">
                      {s.message || "—"}
                    </TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer cette soumission ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Cette action est irréversible. La soumission de {s.prenom} {s.nom} sera définitivement supprimée.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(s.id)}>
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCRM;
