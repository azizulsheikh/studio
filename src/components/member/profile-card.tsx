import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Member } from '@/lib/definitions';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { User, Mail, Calendar } from 'lucide-react';

export default function ProfileCard({ member }: { member: Member }) {
  const avatar = PlaceHolderImages.find(p => p.id === member.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {avatar && (
            <Image
                alt="Profile picture"
                className="aspect-square rounded-full object-cover mx-auto"
                height="120"
                src={avatar.imageUrl}
                width="120"
                data-ai-hint={avatar.imageHint}
            />
        )}
        <div className="text-center">
            <h2 className="text-2xl font-bold">{member.name}</h2>
            <p className="text-muted-foreground">{member.role}</p>
        </div>
        <div className="space-y-3 pt-4">
            <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm">{member.email}</span>
            </div>
            <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm">Joined on {new Date(member.joinDate).toLocaleDateString()}</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
