import { NavLink } from 'react-router-dom'
import { navItems } from '../../lib/navigation'

export function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-brand">AFO Core</div>
            <nav className="sidebar-nav">
                {navItems.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            isActive ? 'nav-item nav-item-active' : 'nav-item'
                        }
                    >
                        {item.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    )
}
