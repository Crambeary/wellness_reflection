import { createClient } from "@/utils/supabase/server";
import { login, logout } from "@/login/actions";

export default async function Header() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
            <a className="navbar-brand" href="#"style={{ fontFamily: 'Nunito Sans', fontWeight: 'bold'}}>
                <img src="/logo.svg" alt="Logo" width="48" height="48" />
                Wellness Dashboard
            </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                    <a className="nav-link active" aria-current="page"></a>
                </li>
            </ul>
            {user ? (
                <button onClick={logout} className="btn btn-outline-danger">Logout</button>
            ): 
                <button onClick={login} className="btn btn-outline-success">Log in</button>
                }
            </div>
        </div>
        </nav>
        </>
    )
}