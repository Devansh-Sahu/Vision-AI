"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { User, Bell, Shield, LogOut, Phone, Plus, Trash2, Eye, AlertTriangle } from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface SettingsFormProps {
  user: SupabaseUser
}

interface EmergencyContact {
  id: string
  name: string
  phone: string
  isPrimary: boolean
}

export function SettingsForm({ user }: SettingsFormProps) {
  const router = useRouter()
  const [contacts, setContacts] = useState<EmergencyContact[]>([{ id: "1", name: "", phone: "", isPrimary: true }])
  const [alertThreshold, setAlertThreshold] = useState(50)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
  }

  const addContact = () => {
    setContacts([...contacts, { id: Date.now().toString(), name: "", phone: "", isPrimary: false }])
  }

  const removeContact = (id: string) => {
    setContacts(contacts.filter((c) => c.id !== id))
  }

  const updateContact = (id: string, field: keyof EmergencyContact, value: string | boolean) => {
    setContacts(contacts.map((c) => (c.id === id ? { ...c, [field]: value } : c)))
  }

  return (
    <div className="space-y-6">
      {/* Profile */}
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile
          </CardTitle>
          <CardDescription>Your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" defaultValue={user.user_metadata?.full_name || ""} className="bg-background/50" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={user.email || ""} disabled className="bg-background/50" />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      {/* Emergency Contacts - NEW */}
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-warning" />
            Emergency Contacts
          </CardTitle>
          <CardDescription>Contacts to notify when drowsiness or hazards are detected</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {contacts.map((contact, index) => (
            <div key={contact.id} className="p-4 rounded-lg bg-secondary/30 border border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Contact {index + 1}</span>
                {contacts.length > 1 && (
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeContact(contact.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label>Name</Label>
                  <Input
                    placeholder="Contact name"
                    value={contact.name}
                    onChange={(e) => updateContact(contact.id, "name", e.target.value)}
                    className="bg-background/50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Phone</Label>
                  <Input
                    placeholder="+91 98765 43210"
                    value={contact.phone}
                    onChange={(e) => updateContact(contact.id, "phone", e.target.value)}
                    className="bg-background/50"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={contact.isPrimary}
                  onCheckedChange={(checked) => updateContact(contact.id, "isPrimary", checked)}
                />
                <Label className="text-sm">Primary contact (receives SMS/calls)</Label>
              </div>
            </div>
          ))}
          <Button variant="outline" className="w-full bg-transparent" onClick={addContact}>
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </CardContent>
      </Card>

      {/* Detection Settings - NEW */}
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Detection Settings
          </CardTitle>
          <CardDescription>Configure detection thresholds and alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Drowsiness Alert Threshold</Label>
              <span className="text-sm font-mono text-primary">{alertThreshold}%</span>
            </div>
            <input
              type="range"
              min="30"
              max="70"
              value={alertThreshold}
              onChange={(e) => setAlertThreshold(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Alert when alertness drops below this level. Lower = more sensitive.
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Drowsiness Detection
              </p>
              <p className="text-sm text-muted-foreground">Monitor driver alertness via webcam</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Hazard Detection
              </p>
              <p className="text-sm text-muted-foreground">Detect road hazards in video feed</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Audio Alerts</p>
              <p className="text-sm text-muted-foreground">Play alarm sound on detection</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>Configure how you receive alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">SMS Alerts</p>
              <p className="text-sm text-muted-foreground">Send SMS to emergency contacts</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">Receive alerts via email</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Daily Summary</p>
              <p className="text-sm text-muted-foreground">Receive a daily detection summary</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security
          </CardTitle>
          <CardDescription>Manage your account security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" className="bg-background/50" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" className="bg-background/50" />
          </div>
          <Button variant="secondary">Update Password</Button>
        </CardContent>
      </Card>

      {/* Sign Out */}
      <Card className="bg-destructive/5 border-destructive/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Sign Out</p>
              <p className="text-sm text-muted-foreground">Sign out of your account on this device</p>
            </div>
            <Button variant="destructive" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
