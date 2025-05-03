import Button from '@/components/custom/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Roles } from '@/core/enum/Roles';
import { apiPost } from '@/core/lib/api';
import { AdminUser } from '@/types';
import { Label } from '@radix-ui/react-dropdown-menu';
import { useState } from 'react';
export default function CreateAdminDialog({ successCallback }: { successCallback: () => void }) {
    const [data, setData] = useState<AdminUser>({
        id: 0,
        name: '',
        email: '',
        role: Roles.ADMIN,
    });
    const [open, setOpen] = useState(false);

    function handleCreate() {
        apiPost(`/admin`, {
            data: {
                name: data.name,
                email: data.email,
                role: data.role,
            },
            displayError: true,
            displaySuccess: true,
            onSuccess: () => {
                setOpen(false);
                successCallback();
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="primary" size="sm">
                    Create Admin
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Admin</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2">
                        <Label>Name</Label>
                        <Input
                            className="w-full"
                            placeholder="Admin Name"
                            value={data.name}
                            onChange={(e) => setData({ ...data, name: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label>Email</Label>
                        <Input
                            className="w-full"
                            placeholder="Admin Email"
                            value={data.email}
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label>Role</Label>
                        <Select>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value={Roles.ADMIN}>Admin</SelectItem>
                                    <SelectItem value={Roles.SUPER_ADMIN}>Super Admin</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="primary" onClick={handleCreate}>
                        Create
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
