'use client';
import { Dialog } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Diamond, Loader2 } from "lucide-react";

interface User {
  name: string;
  email: string;
  isVerified: boolean;
  isPremium: boolean;
}

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/user/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to change password.");
        return;
      }

      toast.success("Password changed successfully!");
      setIsOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      toast.error("Something went wrong.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-indigo-600">
        <Loader2 className="animate-spin w-6 h-6" />
        <span className="ml-2">Loading user settings...</span>
      </div>
    );
  }

  if (!user) {
    return <div className="p-6 text-red-600">❌ Failed to load user info.</div>;
  }

  return (
    <main className="min-h-screen bg-[#f9fafb] flex items-center justify-center px-4">
      <Card className="w-full max-w-lg shadow-xl border-none bg-white">
        <CardHeader className="pb-0">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-indigo-600">
            ⚙️ User Settings
          </h2>
        </CardHeader>

        <CardContent className="space-y-4 mt-4">
          <div>
            <label className="block text-sm mb-1 text-gray-700">Full Name</label>
            <Input value={user.name} readOnly />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-700">Email Address</label>
            <Input value={user.email} readOnly />
          </div>

          <div className="text-sm mt-4 space-y-1">
            <div className="flex items-center gap-2 text-blue-600">
              <Diamond size={18} />
              <span>{user.isPremium ? "Premium" : "Standard"}</span>
            </div>
          </div>

          <Button
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mt-6"
            onClick={() => setIsOpen(true)}
          >
            Change Password
          </Button>
        </CardContent>
      </Card>

      {/* Password Modal */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} as={Fragment}>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-md p-6 rounded-lg space-y-4 shadow-xl">
            <h3 className="text-lg font-semibold text-indigo-600">🔐 Change Password</h3>

            <Input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <Input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handlePasswordChange} className="bg-indigo-600 text-white">
                Update Password
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </main>
  );
}
