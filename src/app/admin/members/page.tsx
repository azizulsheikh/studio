import { getMembers } from '@/lib/data';
import MembersTable from '@/components/admin/members-table';
import PageHeader from '@/components/page-header';

export const dynamic = 'force-dynamic';

export default async function AdminMembersPage() {
  const members = await getMembers();

  return (
    <>
      <PageHeader title="Members" description="Create, view, and manage member profiles." />
      <MembersTable members={members} />
    </>
  );
}
