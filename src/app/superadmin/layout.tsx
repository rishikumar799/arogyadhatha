import SuperAdminHeader from '@/app/superadmin/components/layout/superadmin-header';
import SuperAdminSidebar from '@/app/superadmin/components/layout/superadmin-sidebar';
import { SettingsProvider } from '@/context/settings-context';
import { Toaster } from 'react-hot-toast';

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SettingsProvider>
      <div className="flex h-screen bg-background text-foreground">
        <SuperAdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
          <SuperAdminHeader />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-8">
            {children}
          </main>
        </div>
        <Toaster position="bottom-right" />
      </div>
    </SettingsProvider>
  );
}
