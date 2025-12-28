import { ProjectSelector } from '../common/ProjectSelector'

export function Topbar() {
    return (
        <header className="topbar">
            <div>
                <div className="eyebrow">Aplicación Web</div>
                <div className="title">Gestión integral de expedientes</div>
            </div>
            <div className="topbar-actions">
                <ProjectSelector />
                <button className="ghost">Buscar</button>
                <button className="primary">Nueva acción</button>
            </div>
        </header>
    )
}
