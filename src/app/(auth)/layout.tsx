import Sidebar from '../components/ui/Sidebar';
import Trending from '../components/ui/Trending';
import getCurrentUser from '../lib/auth';
import { auth, currentUser } from '@clerk/nextjs';

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
    return (
        <section className="mx-auto max-w-7xl">
            <div className=" grid min-h-screen grid-cols-4">
                <Sidebar />
                <div className="col-span-2 mt-8">{children}</div>
                <Trending />
            </div>
        </section>
    );
};

export default DashboardLayout;
