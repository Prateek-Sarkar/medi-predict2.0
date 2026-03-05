
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import './Layout.css';

export function Layout() {
    return (
        <div className="layout">
            <Navbar />
            <main className="main-content">
                <Outlet />
            </main>
            <footer className="footer">
                <p>© {new Date().getFullYear()} MediPredict AI — For educational & screening purposes only. Not a substitute for professional medical diagnosis.</p>
            </footer>
        </div>
    );
}
