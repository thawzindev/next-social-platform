import Sidebar from '../components/ui/Sidebar';
import Trending from '../components/ui/Trending';
import getCurrentUser from '../lib/auth';
import { auth, currentUser } from '@clerk/nextjs';

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
    return (
        <section className="mx-auto max-w-7xl">
            <div className="flex min-h-screen">
                <Sidebar />
                {children}
                <Trending />
            </div>
        </section>
    );
};

export default DashboardLayout;
