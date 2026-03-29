import { useState } from "react";
import { useEvents } from "@/context/EventContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Edit, Trash2, Plus } from "lucide-react";
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

export default function TopicsPage() {
  const { topics, events, addTopic, updateTopic, deleteTopic } = useEvents();
  const { toast } = useToast();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  
  const [currentTopic, setCurrentTopic] = useState("");
  const [newTopicName, setNewTopicName] = useState("");

  const handleCreate = () => {
    if (!newTopicName.trim()) return;
    
    if (topics.includes(newTopicName.trim())) {
      toast({
        title: "Topic exists",
        description: "This topic already exists.",
        variant: "destructive",
      });
      return;
    }

    addTopic(newTopicName.trim());
    setIsCreateOpen(false);
    setNewTopicName("");
    toast({
      title: "Topic Created",
      description: `Training topic "${newTopicName}" has been created.`,
    });
  };

  const handleEdit = () => {
    if (!newTopicName.trim() || newTopicName.trim() === currentTopic) return;
    
    if (topics.includes(newTopicName.trim())) {
      toast({
        title: "Topic exists",
        description: "A training topic with this name already exists.",
        variant: "destructive",
      });
      return;
    }

    updateTopic(currentTopic, newTopicName.trim());
    setIsEditOpen(false);
    toast({
      title: "Topic Updated",
      description: `Training topic has been updated to "${newTopicName}".`,
    });
  };

  const handleDelete = () => {
    deleteTopic(currentTopic);
    setIsDeleteAlertOpen(false);
    toast({
      title: "Topic Deleted",
      description: `Training topic "${currentTopic}" has been removed.`,
    });
  };

  const openEdit = (topic: string) => {
    setCurrentTopic(topic);
    setNewTopicName(topic);
    setIsEditOpen(true);
  };

  const openDelete = (topic: string) => {
    setCurrentTopic(topic);
    setIsDeleteAlertOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground">
            Training <span className="text-amber-600">Topics</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Manage your presentation topics and training plans.
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2 bg-amber-600 hover:bg-amber-700 text-white">
          <Plus className="h-4 w-4" /> New Topic
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => {
          const topicEvents = events.filter((e) => e.topic === topic);
          return (
            <Card key={topic} className="glass-card flex flex-col h-full border-t-4" style={{ borderTopColor: 'hsl(38 92% 50%)' }}>
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-xl font-serif">{topic}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="mb-4">
                  <span className="text-3xl font-bold text-foreground">{topicEvents.length}</span>
                  <span className="text-muted-foreground ml-2">Planned Events</span>
                </div>
                
                <div className="space-y-2 mt-auto">
                  <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                    <Button variant="outline" size="sm" onClick={() => openEdit(topic)}>
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => openDelete(topic)}>
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
            <DialogTitle>Create New Training Topic</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input 
              placeholder="e.g. AI Workflow Automation" 
              value={newTopicName}
              onChange={(e) => setNewTopicName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} className="bg-amber-600 hover:bg-amber-700 text-white">Create Topic</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Training Topic</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input 
              placeholder="Topic name" 
              value={newTopicName}
              onChange={(e) => setNewTopicName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleEdit} className="bg-amber-600 hover:bg-amber-700 text-white">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Alert */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Training Topic?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{currentTopic}"? 
              <br/><br/>
              <span className="font-semibold text-red-500">Warning:</span> This will NOT delete the events that used this topic, but they will no longer be associated with this topic name.
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