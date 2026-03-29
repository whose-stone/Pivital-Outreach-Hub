import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, Plus, Trash2, KeyRound, User } from "lucide-react";

interface AppUser {
  id: string;
  username: string;
  isAdmin: boolean;
  createdAt: string;
}

async function apiRequest(path: string, options?: RequestInit) {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(err.message);
  }
  return res.status === 204 ? null : res.json();
}

export default function AdminPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [targetUser, setTargetUser] = useState<AppUser | null>(null);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isNewAdmin, setIsNewAdmin] = useState(false);
  const [resetPassword, setResetPassword] = useState("");

  const { data: users = [] } = useQuery<AppUser[]>({
    queryKey: ["/api/users"],
    queryFn: () => apiRequest("/api/users"),
    enabled: !!user?.isAdmin,
  });

  const createMutation = useMutation({
    mutationFn: (data: { username: string; password: string; isAdmin: boolean }) =>
      apiRequest("/api/users", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setIsCreateOpen(false);
      setNewUsername(""); setNewPassword(""); setIsNewAdmin(false);
      toast({ title: "User Created", description: `Account "${vars.username}" has been created.` });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const resetMutation = useMutation({
    mutationFn: ({ id, password }: { id: string; password: string }) =>
      apiRequest(`/api/users/${id}/password`, {
        method: "PATCH",
        body: JSON.stringify({ password }),
      }),
    onSuccess: () => {
      setIsResetOpen(false);
      setResetPassword("");
      toast({ title: "Password Reset", description: `Password updated for "${targetUser?.username}".` });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/users/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setIsDeleteOpen(false);
      toast({ title: "User Deleted", description: `Account "${targetUser?.username}" has been removed.` });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  if (!user?.isAdmin) {
    setLocation("/");
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-primary" />
            Admin <span className="text-primary">Panel</span>
          </h1>
          <p className="text-muted-foreground text-lg">Manage user accounts and access.</p>
        </div>
        <Button
          data-testid="button-create-user"
          onClick={() => { setNewUsername(""); setNewPassword(""); setIsNewAdmin(false); setIsCreateOpen(true); }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" /> New User
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((u) => (
          <Card key={u.id} data-testid={`card-user-${u.id}`} className="glass-card border-none">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <User className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-lg font-serif">{u.username}</CardTitle>
                </div>
                {u.isAdmin && (
                  <Badge className="bg-primary/20 text-primary border-none text-xs">Admin</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-4">
                Created {new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  data-testid={`button-reset-password-${u.id}`}
                  className="gap-1 flex-1"
                  onClick={() => { setTargetUser(u); setResetPassword(""); setIsResetOpen(true); }}
                >
                  <KeyRound className="h-3 w-3" /> Reset Password
                </Button>
                {u.username !== "admin" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    data-testid={`button-delete-user-${u.id}`}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    onClick={() => { setTargetUser(u); setIsDeleteOpen(true); }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create User Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Create New User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Username</Label>
              <Input
                data-testid="input-new-username"
                placeholder="Enter username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                data-testid="input-new-password"
                type="password"
                placeholder="Enter password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="is-admin"
                type="checkbox"
                checked={isNewAdmin}
                onChange={(e) => setIsNewAdmin(e.target.checked)}
                className="rounded"
                data-testid="checkbox-is-admin"
              />
              <Label htmlFor="is-admin" className="cursor-pointer">Grant admin privileges</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button
              data-testid="button-confirm-create-user"
              onClick={() => createMutation.mutate({ username: newUsername, password: newPassword, isAdmin: isNewAdmin })}
              disabled={createMutation.isPending || !newUsername || !newPassword}
            >
              {createMutation.isPending ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={isResetOpen} onOpenChange={setIsResetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Reset Password — {targetUser?.username}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label>New Password</Label>
            <Input
              data-testid="input-reset-password"
              type="password"
              placeholder="Enter new password (min 6 chars)"
              value={resetPassword}
              onChange={(e) => setResetPassword(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetOpen(false)}>Cancel</Button>
            <Button
              data-testid="button-confirm-reset"
              onClick={() => targetUser && resetMutation.mutate({ id: targetUser.id, password: resetPassword })}
              disabled={resetMutation.isPending || resetPassword.length < 6}
            >
              {resetMutation.isPending ? "Resetting..." : "Reset Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the account "{targetUser?.username}". This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              data-testid="button-confirm-delete-user"
              onClick={() => targetUser && deleteMutation.mutate(targetUser.id)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
