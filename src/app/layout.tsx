import './globals.css';
import { Sidebar } from '@/components/Sidebar';

export const metadata = {
  title: 'EPAI Admin Dashboard',
  description: 'Real-time monitoring and analytics for EPAI AI Assistant Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            <div className="p-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}