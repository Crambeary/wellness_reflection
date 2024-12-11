import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

export default async function Page() {

    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        notFound();
    }

    return (
        <main className="container mt-4">
            <div className="card" style={{ width: '18rem' }}>
                <div className="card-header">Profile</div>
                <ul className="list-group">
                    <li className="list-group-item">Name: {user.user_metadata.full_name}</li>
                    <li className="list-group-item">Email: {user.email}</li>
                    <li className="list-group-item">Timezone: {user.user_metadata.timezone}</li>
                </ul>
            </div>
        </main>
    )
}