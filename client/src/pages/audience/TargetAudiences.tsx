import { useState } from "react";
import { useEvents } from "@/context/EventContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Edit, Trash2, Plus, Phone, Mail, MapPin, Target, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import type { Audience } from "@/context/EventContext";

const CLIENT_TYPES = [
  "Non-Profit",
  "Small Business",
  "Enterprise",
  "Government",
  "Education",
  "Healthcare",
  "Startup",
  "Association / Chamber",
  "Community Group",
  "Other",
];

const EMPTY_FORM: Omit<Audience, "id" | "createdAt"> = {
  name: "",
  phone: "",
  email: "",
  address: "",
  mission: "",
  clientType: "",
};

function AudienceForm({
  value,
  onChange,
}: {
  value: typeof EMPTY_FORM;
  onChange: (v: typeof EMPTY_FORM) => void;
}) {
  const set = (field: keyof typeof EMPTY_FORM) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => onChange({ ...value, [field]: e.target.value });

  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-1.5">
        <Label htmlFor="aud-name">Organization Name <span className="text-red-500">*</span></Label>
        <Input
          id="aud-name"
          data-testid="input-audience-name"
          placeholder="e.g. Phoenix Chamber of Commerce"
          value={value.name}
          onChange={set("name")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="aud-phone">Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="aud-phone"
              data-testid="input-audience-phone"
              placeholder="(602) 555-0100"
              className="pl-9"
              value={value.phone ?? ""}
              onChange={set("phone")}
            />
          </div>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="aud-email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="aud-email"
              data-testid="input-audience-email"
              type="email"
              placeholder="contact@org.com"
              className="pl-9"
              value={value.email ?? ""}
              onChange={set("email")}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="aud-address">Address</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="aud-address"
            data-testid="input-audience-address"
            placeholder="123 Main St, Phoenix, AZ 85001"
            className="pl-9"
            value={value.address ?? ""}
            onChange={set("address")}
          />
        </div>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="aud-client-type">Type of Client</Label>
        <Select
          value={value.clientType ?? ""}
          onValueChange={(v) => onChange({ ...value, clientType: v })}
        >
          <SelectTrigger id="aud-client-type" data-testid="select-audience-client-type">
            <SelectValue placeholder="Select client type…" />
          </SelectTrigger>
          <SelectContent>
            {CLIENT_TYPES.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="aud-mission">Organization Mission</Label>
        <Textarea
          id="aud-mission"
          data-testid="input-audience-mission"
          placeholder="Briefly describe this organization's mission and goals…"
          rows={3}
          value={value.mission ?? ""}
          onChange={set("mission")}
        />
      </div>
    </div>
  );
}

export default function TargetAudiencesPage() {
  const { audiences, events, addAudience, updateAudience, deleteAudience } = useEvents();
  const { toast } = useToast();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const [currentAudience, setCurrentAudience] = useState<Audience | null>(null);
  const [form, setForm] = useState<typeof EMPTY_FORM>(EMPTY_FORM);

  const handleCreate = async () => {
    if (!form.name.trim()) {
      toast({ title: "Name required", description: "Please enter an organization name.", variant: "destructive" });
      return;
    }
    if (audiences.some((a) => a.name.toLowerCase() === form.name.trim().toLowerCase())) {
      toast({ title: "Already exists", description: "An audience with this name already exists.", variant: "destructive" });
      return;
    }
    try {
      await addAudience({ ...form, name: form.name.trim() });
      setIsCreateOpen(false);
      setForm(EMPTY_FORM);
      toast({ title: "Audience Created", description: `"${form.name.trim()}" has been added.` });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleEdit = async () => {
    if (!form.name.trim() || !currentAudience) return;
    try {
      await updateAudience(currentAudience.id, { ...form, name: form.name.trim() });
      setIsEditOpen(false);
      toast({ title: "Audience Updated", description: `"${form.name.trim()}" has been saved.` });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!currentAudience) return;
    try {
      await deleteAudience(currentAudience.id);
      setIsDeleteAlertOpen(false);
      toast({ title: "Audience Deleted", description: `"${currentAudience.name}" has been removed.` });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const openEdit = (audience: Audience) => {
    setCurrentAudience(audience);
    setForm({
      name: audience.name,
      phone: audience.phone ?? "",
      email: audience.email ?? "",
      address: audience.address ?? "",
      mission: audience.mission ?? "",
      clientType: audience.clientType ?? "",
    });
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
            Track your outreach contacts — organizations, clients, and community partners.
          </p>
        </div>
        <Button
          data-testid="button-new-audience"
          onClick={() => { setForm(EMPTY_FORM); setIsCreateOpen(true); }}
          className="gap-2 bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Plus className="h-4 w-4" /> New Audience
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {audiences.map((audience) => {
          const audienceEvents = events.filter((e) => e.category === audience.name);
          return (
            <Card
              key={audience.id}
              data-testid={`card-audience-${audience.id}`}
              className="glass-card flex flex-col border-t-4 border-t-purple-500"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="p-2 rounded-lg bg-purple-100 text-purple-600 shrink-0">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-lg font-serif leading-tight truncate">
                        {audience.name}
                      </CardTitle>
                      {audience.clientType && (
                        <span className="inline-block text-xs bg-purple-100 text-purple-700 rounded-full px-2 py-0.5 mt-1 font-medium">
                          {audience.clientType}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => openEdit(audience)}
                      data-testid={`button-edit-audience-${audience.id}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-red-500"
                      onClick={() => openDelete(audience)}
                      data-testid={`button-delete-audience-${audience.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col gap-3 text-sm">
                {audience.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    <span data-testid={`text-audience-phone-${audience.id}`}>{audience.phone}</span>
                  </div>
                )}
                {audience.email && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <a
                      href={`mailto:${audience.email}`}
                      className="hover:text-primary truncate"
                      data-testid={`text-audience-email-${audience.id}`}
                    >
                      {audience.email}
                    </a>
                  </div>
                )}
                {audience.address && (
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    <span data-testid={`text-audience-address-${audience.id}`}>{audience.address}</span>
                  </div>
                )}
                {audience.mission && (
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <Target className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    <p
                      className="leading-relaxed line-clamp-3"
                      data-testid={`text-audience-mission-${audience.id}`}
                    >
                      {audience.mission}
                    </p>
                  </div>
                )}

                <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-purple-500" />
                    <span className="font-semibold text-foreground">{audienceEvents.length}</span>
                    <span className="text-muted-foreground text-xs">planned events</span>
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
            <p className="text-sm">Click "New Audience" to add your first contact.</p>
          </div>
        )}
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">New Target Audience</DialogTitle>
          </DialogHeader>
          <AudienceForm value={form} onChange={setForm} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button
              onClick={handleCreate}
              className="bg-purple-600 hover:bg-purple-700 text-white"
              data-testid="button-submit-audience"
            >
              Create Audience
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Edit Audience</DialogTitle>
          </DialogHeader>
          <AudienceForm value={form} onChange={setForm} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button
              onClick={handleEdit}
              className="bg-purple-600 hover:bg-purple-700 text-white"
              data-testid="button-save-audience"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Audience?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{currentAudience?.name}"? Events linked to this audience will remain but won't be associated with it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
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
