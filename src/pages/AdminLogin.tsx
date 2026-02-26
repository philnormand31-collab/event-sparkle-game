import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { LogIn, UserPlus, ArrowLeft } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Compte créé ! Vérifiez votre email pour confirmer votre inscription.");
      setMode("login");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6 glass-card rounded-3xl p-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l'accueil
        </button>

        <div className="text-center">
          <h1 className="font-display text-2xl font-bold">
            <span className="text-accent">Admin</span> {mode === "login" ? "Login" : "Inscription"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {mode === "login" ? "Accès réservé à l'administrateur" : "Créez votre compte administrateur"}
          </p>
        </div>

        <form onSubmit={mode === "login" ? handleLogin : handleSignup} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Mot de passe (min. 6 caractères)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {mode === "login" ? (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                {loading ? "Connexion..." : "Se connecter"}
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                {loading ? "Création..." : "Créer le compte"}
              </>
            )}
          </Button>
        </form>

        <button
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="w-full text-center text-sm text-muted-foreground hover:text-accent transition-colors"
        >
          {mode === "login" ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
