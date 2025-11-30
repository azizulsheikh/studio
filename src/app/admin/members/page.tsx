import { getMembers } from '@/lib/data';
import MembersTable from '@/components/admin/members-table';
import PageHeader from '@/components/page-header';
import { Member } from '@/lib/definitions';

export const dynamic = 'force-dynamic';

type MemberWithFormattedDate = Member & {
  formattedJoinDate: string;
};

export default async function AdminMembersPage() {
  const rawMembers = await getMembers();
  
  const members: MemberWithFormattedDate[] = rawMembers.map(member => ({
    ...member,
    formattedJoinDate: new Date(member.joinDate).toLocaleDateString(),
  }));

  return (
    <>
      <PageHeader title="Members" description="Create, view, and manage member profiles." />
      <MembersTable members={members} />
    </>
  );
}
