'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Member, MemberSchema } from '@/lib/definitions';
import { createMember, updateMember } from '@/lib/actions';
import { useRouter } from 'next/navigation';

const FormSchema = MemberSchema.pick({ name: true, email: true, role: true, imageUrl: true });

type MemberFormProps = {
  member: Member | null;
  onFinished: () => void;
};

export function MemberForm({ member, onFinished }: MemberFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: member?.name || '',
      email: member?.email || '',
      role: member?.role || 'member',
      imageUrl: member?.imageUrl || '',
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    let result;
    if (member) {
      formData.append('id', member.id);
      result = await updateMember(formData);
    } else {
      result = await createMember(formData);
    }

    if (result.errors) {
      // Handle server-side validation errors
      console.error(result.errors);
      toast({
        title: 'Error',
        description: result.message,
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Success!',
        description: result.message,
      });
      router.refresh();
      onFinished();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john.doe@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField control={form.control} name="imageUrl" render={({ field }) => (
            <FormItem>
                <FormLabel>Profile Picture URL (Optional)</FormLabel>
                <FormControl>
                    <Input placeholder="https://example.com/image.png" {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
        )} />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Saving...' : 'Save Member'}
        </Button>
      </form>
    </Form>
  );
}
