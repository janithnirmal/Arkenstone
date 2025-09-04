import Button from '@/components/custom/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiDelete, apiPut } from '@/core/lib/api';
import { User } from '@/types';
import { Edit } from 'lucide-react';
import { useState } from 'react';
export default function SingleAdminDialog({ admin, successCallback }: { admin: User; successCallback: () => void }) {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState<User>(admin);

    function handleDelete() {
        apiDelete(`/admin`, {
            data: {
                id: admin.id,
            },
            displayError: true,
            displaySuccess: true,
            onSuccess: () => {
                setOpen(false);
                successCallback();
            },
        });
    }

    function handleEdit() {
        apiPut(`/admin`, {
            data: {
                id: admin.id,
                name: data.name,
                email: data.email,
            },
            displayError: true,
            displaySuccess: true,
            onSuccess: () => {
                successCallback();
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Edit className="h-5 w-5" />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{admin.name}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2">
                        <Label>Name</Label>
                        <Input placeholder="Name" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label>Email</Label>
                        <Input placeholder="Email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="primary" onClick={handleEdit}>
                        Edit
                    </Button>
                    <Button variant="outline" onClick={handleDelete}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
