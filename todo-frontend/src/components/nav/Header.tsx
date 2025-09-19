import Link from "next/link";

export default function Header() {
    return (
        <header>
            <nav className="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3">
                <div className="container-fluid">
                    <Link className="navbar-brand" href="/todo">
                        <span className="material-symbols-outlined">add_task</span>
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="navbar-collapse" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </div>
            </nav>
        </header>
    );
}