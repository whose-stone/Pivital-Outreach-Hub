import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock, User } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#001F17] flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-3 mb-2">
          <div className="h-14 w-14 rounded-xl overflow-hidden bg-[#004435] flex items-center justify-center">
            <img src="/pivital-logo.png" alt="Pivital.ai" className="w-full h-full object-contain p-1" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-serif font-bold text-white">
              Pivital<span className="text-[#00E6BA]">.ai</span>
            </h1>
            <p className="text-sm text-white/50 mt-1">Outreach Calendar</p>
          </div>
        </div>

        <Card className="bg-white/5 border-white/10 shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-serif text-white text-center">Sign In</CardTitle>
            <CardDescription className="text-center text-white/50">
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white/70">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                  <Input
                    id="username"
                    data-testid="input-username"
                    className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#00E6BA]/50"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/70">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                  <Input
                    id="password"
                    data-testid="input-password"
                    type="password"
                    className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#00E6BA]/50"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>

              {error && (
                <p data-testid="text-login-error" className="text-sm text-red-400 text-center">
                  {error}
                </p>
              )}

              <Button
                data-testid="button-login"
                type="submit"
                disabled={loading}
                className="w-full bg-[#00E6BA] hover:bg-[#00c9a3] text-[#001F17] font-semibold"
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
