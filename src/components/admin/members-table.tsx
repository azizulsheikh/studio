'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Member } from '@/lib/definitions';
import { deleteMember } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { MemberForm } from './member-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function MembersTable({ members }: { members: Member[] }) {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = React.useState(false);
  const [selectedMember, setSelectedMember] = React.useState<Member | null>(null);
  
  const memberImages = PlaceHolderImages.filter(p => p.id.startsWith('member-'));
  const newMemberImage = PlaceHolderImages.find(p => p.id === 'new-member-avatar');

  const handleDelete = async (id: string) => {
    const result = await deleteMember(id);
    toast({
      title: result.message,
    });
  };

  const openEditDialog = (member: Member) => {
    setSelectedMember(member);
    setDialogOpen(true);
  }

  const openDeleteDialog = (member: Member) => {
    setSelectedMember(member);
    setAlertDialogOpen(true);
  }

  const openCreateDialog = () => {
    setSelectedMember(null);
    setDialogOpen(true);
  }
  
  return (
    <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
                <div>
                    <CardTitle>All Members</CardTitle>
                    <CardDescription>A list of all members in the system.</CardDescription>
                </div>
                <Button size="sm" className="gap-1" onClick={openCreateDialog}>
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Add Member
                    </span>
                </Button>
            </div>
        </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="hidden md:table-cell">Join Date</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => {
              const avatar = memberImages.find(img => img.id === member.id) ?? newMemberImage;
              return (
              <TableRow key={member.id}>
                <TableCell className="hidden sm:table-cell">
                    {avatar && 
                        <Image
                            alt="Member avatar"
                            className="aspect-square rounded-full object-cover"
                            height="40"
                            src={avatar.imageUrl}
                            width="40"
                            data-ai-hint={avatar.imageHint}
                        />
                    }
                </TableCell>
                <TableCell className="font-medium">
                  <Link href={`/admin/members/${member.id}`} className="hover:underline">
                    {member.name}
                  </Link>
                </TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {new Date(member.joinDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onSelect={() => router.push(`/admin/members/${member.id}`)}>View Profile</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => openEditDialog(member)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => openDeleteDialog(member)} className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )})}
          </TableBody>
        </Table>
      </CardContent>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedMember ? 'Edit Member' : 'Add New Member'}</DialogTitle>
          </DialogHeader>
          <MemberForm member={selectedMember} onFinished={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>
      <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the member profile for {selectedMember?.name}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => selectedMember && handleDelete(selectedMember.id)}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}