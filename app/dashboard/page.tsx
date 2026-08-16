import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export default async function DashboardPage() {
  const headersList = await headers();
  const userRole = headersList.get('x-user-role');

  if (userRole === 'Admin') {
    redirect('/dashboard/admin');
  }

  // Non-admin users (Students, Faculty, HODs, Exam Cell) go to my-requests by default
  redirect('/dashboard/my-requests');
}
