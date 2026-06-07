import AdminDashboardContent from '@/components/admin/AdminDashboardContent';
import AdminNavbar from '@/components/admin/AdminNavbar';
import { getAdminDashboardData } from '@/lib/services/adminService';

export default async function AdminDashboardPage() {
  const data = await getAdminDashboardData();

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-blue-100/30 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-yellow-100/20 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />

      <AdminNavbar />

      <AdminDashboardContent data={data} />
    </main>
  );
}
