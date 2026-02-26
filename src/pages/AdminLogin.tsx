import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { LogIn } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error("Identifiants incorrects");
    } else {
      toast.success("Connecté !");
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6 glass-card rounded-3xl p-8">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold">
            <span className="text-accent">Admin</span> Login
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Accès réservé à l'administrateur</p>
        </div>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" className="w-full" disabled={loading}>
          <LogIn className="w-4 h-4 mr-2" />
          {loading ? "Connexion..." : "Se connecter"}
        </Button>
      </form>
    </div>
  );
};

export default AdminLogin;
