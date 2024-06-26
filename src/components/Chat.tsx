import SendbirdApp from '@sendbird/uikit-react/App';
import { useUser } from '@clerk/nextjs';

const APP_ID = '2253F2DD-7980-4BB3-9D5B-2855D2013F8E';

export default async function Page() {
    const { isLoaded, isSignedIn, user } = useUser();

    return (
        <div className="mx-2 h-screen rounded-md">
            <SendbirdApp
                appId={APP_ID}
                userId={user?.fullName}
                nickname={user?.fullName}
            // accessToken="ff606f9a66cb34456d2ca60e63714f1bef6e7e3b"
            />
        </div>
    );
}
