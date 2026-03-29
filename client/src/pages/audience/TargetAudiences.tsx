import { useState } from "react";
import { useEvents } from "@/context/EventContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

export default function TargetAudiencesPage() {
  const { categories, events, addCategory, updateCategory, deleteCategory } = useEvents();
  const { toast } = useToast();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  
  const [currentCategory, setCurrentCategory] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleCreate = () => {
    if (!newCategoryName.trim()) return;
    
    if (categories.includes(newCategoryName.trim())) {
      toast({
        title: "Category exists",
        description: "This target audience already exists.",
        variant: "destructive",
      });
      return;
    }

    addCategory(newCategoryName.trim());
    setIsCreateOpen(false);
    setNewCategoryName("");
    toast({
      title: "Audience Created",
      description: `Target audience "${newCategoryName}" has been created.`,
    });
  };

  const handleEdit = () => {
    if (!newCategoryName.trim() || newCategoryName.trim() === currentCategory) return;
    
    if (categories.includes(newCategoryName.trim())) {
      toast({
        title: "Category exists",
        description: "A target audience with this name already exists.",
        variant: "destructive",
      });
      return;
    }

    updateCategory(currentCategory, newCategoryName.trim());
    setIsEditOpen(false);
    toast({
      title: "Audience Updated",
      description: `Target audience has been updated to "${newCategoryName}".`,
    });
  };

  const handleDelete = () => {
    deleteCategory(currentCategory);
    setIsDeleteAlertOpen(false);
    toast({
      title: "Audience Deleted",
      description: `Target audience "${currentCategory}" has been removed.`,
    });
  };

  const openEdit = (category: string) => {
    setCurrentCategory(category);
    setNewCategoryName(category);
    setIsEditOpen(true);
  };

  const openDelete = (category: string) => {
    setCurrentCategory(category);
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
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2 bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4" /> New Audience
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const categoryEvents = events.filter((e) => e.category === category);
          return (
            <Card key={category} className="glass-card flex flex-col h-full border-t-4" style={{ borderTopColor: 'hsl(var(--primary))' }}>
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                    <Users className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-xl font-serif">{category}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="mb-4">
                  <span className="text-3xl font-bold text-foreground">{categoryEvents.length}</span>
                  <span className="text-muted-foreground ml-2">Planned Events</span>
                </div>
                
                <div className="space-y-2 mt-auto">
                  <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                    <Button variant="outline" size="sm" onClick={() => openEdit(category)}>
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => openDelete(category)}>
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Audience Segment</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input 
              placeholder="e.g. Non-profits, Enterprise..." 
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create Audience</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Audience Segment</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input 
              placeholder="Audience name" 
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Alert */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Audience Segment?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{currentCategory}"? 
              <br/><br/>
              <span className="font-semibold text-red-500">Warning:</span> This will NOT delete the events in this category, but they will no longer be associated with this audience name.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}