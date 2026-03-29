import { useState } from "react";
import { useEvents } from "@/context/EventContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Edit, Trash2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
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
import type { Audience } from "@/context/EventContext";

export default function TargetAudiencesPage() {
  const { audiences, events, addAudience, updateAudience, deleteAudience } = useEvents();
  const { toast } = useToast();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  
  const [currentAudience, setCurrentAudience] = useState<Audience | null>(null);
  const [newAudienceName, setNewAudienceName] = useState("");

  const handleCreate = async () => {
    if (!newAudienceName.trim()) return;
    
    if (audiences.some((a) => a.name === newAudienceName.trim())) {
      toast({ title: "Audience exists", description: "This target audience already exists.", variant: "destructive" });
      return;
    }
    try {
      await addAudience(newAudienceName.trim());
      setIsCreateOpen(false);
      setNewAudienceName("");
      toast({ title: "Audience Created", description: `Target audience "${newAudienceName}" has been created.` });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleEdit = async () => {
    if (!newAudienceName.trim() || !currentAudience || newAudienceName.trim() === currentAudience.name) return;
    
    if (audiences.some((a) => a.name === newAudienceName.trim())) {
      toast({ title: "Audience exists", description: "A target audience with this name already exists.", variant: "destructive" });
      return;
    }
    try {
      await updateAudience(currentAudience.id, newAudienceName.trim());
      setIsEditOpen(false);
      toast({ title: "Audience Updated", description: `Target audience updated to "${newAudienceName}".` });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!currentAudience) return;
    try {
      await deleteAudience(currentAudience.id);
      setIsDeleteAlertOpen(false);
      toast({ title: "Audience Deleted", description: `Target audience "${currentAudience.name}" has been removed.` });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const openEdit = (audience: Audience) => {
    setCurrentAudience(audience);
    setNewAudienceName(audience.name);
    setIsEditOpen(true);
  };

  const openDelete = (audience: Audience) => {
    setCurrentAudience(audience);
    setIsDeleteAlertOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground">
            Target <span className="text-purple-600">Audiences</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Manage your audience segments and view events targeting them.
          </p>
        </div>
        <Button onClick={() => { setNewAudienceName(""); setIsCreateOpen(true); }} className="gap-2 bg-purple-600 hover:bg-purple-700 text-white">
          <Plus className="h-4 w-4" /> New Audience
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {audiences.map((audience) => {
          const audienceEvents = events.filter((e) => e.category === audience.name);
          return (
            <Card key={audience.id} className="glass-card flex flex-col h-full border-t-4" style={{ borderTopColor: 'hsl(var(--primary))' }}>
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                    <Users className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-xl font-serif">{audience.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="mb-4">
                  <span className="text-3xl font-bold text-foreground">{audienceEvents.length}</span>
                  <span className="text-muted-foreground ml-2">Planned Events</span>
                </div>
                <div className="space-y-2 mt-auto">
                  <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                    <Button variant="outline" size="sm" onClick={() => openEdit(audience)}>
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => openDelete(audience)}>
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {audiences.length === 0 && (
          <div className="col-span-full py-16 text-center text-muted-foreground bg-white/40 rounded-xl border border-dashed border-slate-300">
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-lg font-medium">No audience segments yet</p>
            <p className="text-sm">Click "New Audience" to create your first target audience.</p>
          </div>
        )}
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Audience Segment</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input 
              placeholder="e.g. Non-profits, Enterprise..." 
              value={newAudienceName}
              onChange={(e) => setNewAudienceName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} className="bg-purple-600 hover:bg-purple-700 text-white">Create Audience</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Audience Segment</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input 
              placeholder="Audience name" 
              value={newAudienceName}
              onChange={(e) => setNewAudienceName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleEdit} className="bg-purple-600 hover:bg-purple-700 text-white">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Audience Segment?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{currentAudience?.name}"?
              <br/><br/>
              <span className="font-semibold text-red-500">Note:</span> Events in this category will remain but will no longer be linked to this audience name.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
