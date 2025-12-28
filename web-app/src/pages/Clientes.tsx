import { useMemo, useState } from 'react'
import { Section } from '../components/common/Section'
import { mockClients } from '../lib/data/mockClients'
import { mockProjects } from '../lib/data/mockProjects'
import { linkProjectToClient, listProjectsForClient } from '../lib/services/client-project-link'
import { createClient, listClients } from '../lib/services/clients'

export function ClientesPage() {
    const [refresh, setRefresh] = useState(0)
    const clients = useMemo(() => {
        const stored = listClients()
        return stored.length ? stored : mockClients
    }, [refresh])

    const [form, setForm] = useState({ name: '', email: '' })
    const [selectedClient, setSelectedClient] = useState<string | undefined>(clients[0]?.id)
    const [selectedProject, setSelectedProject] = useState<string | undefined>(mockProjects[0]?.id)

    const handleCreate = () => {
        if (!form.name) return
        createClient({ name: form.name, email: form.email })
        setForm({ name: '', email: '' })
        setRefresh(x => x + 1)
    }

    const handleLink = () => {
        if (!selectedClient || !selectedProject) return
        linkProjectToClient(selectedClient, selectedProject)
        setRefresh(x => x + 1)
    }

    return (
        <div className="page">
            <div className="page-header">
                <p className="eyebrow">Clientes</p>
                <h1>Gestión de clientes y vinculación de proyectos</h1>
            </div>

            <Section title="Alta de cliente" description="Código automático y datos básicos">
                <div className="grid two">
                    <div className="card">
                        <div className="card-head"><div className="card-title-row"><div className="card-icon">➕</div><div><h2>Nuevo cliente</h2><p className="muted">Nombre y email</p></div></div></div>
                        <div className="card-body">
                            <div className="form-row"><label>Nombre</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                            <div className="form-row"><label>Email</label><input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                            <button className="primary" onClick={handleCreate}>Crear cliente</button>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-head"><div className="card-title-row"><div className="card-icon">🔗</div><div><h2>Vincular proyecto</h2><p className="muted">Asignar proyecto a cliente</p></div></div></div>
                        <div className="card-body">
                            <div className="form-row"><label>Cliente</label>
                                <select value={selectedClient} onChange={e => setSelectedClient(e.target.value)}>
                                    {clients.map(c => (<option key={c.id} value={c.id}>{c.code ? `${c.code} — ${c.name}` : c.name}</option>))}
                                </select>
                            </div>
                            <div className="form-row"><label>Proyecto</label>
                                <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)}>
                                    {mockProjects.map(p => (<option key={p.id} value={p.id}>{p.code ? `${p.code} — ${p.title}` : p.title}</option>))}
                                </select>
                            </div>
                            <button className="primary" onClick={handleLink}>Vincular</button>
                        </div>
                    </div>
                </div>
            </Section>

            <Section title="Clientes" description="Listado y proyectos vinculados">
                <div className="grid two">
                    {clients.map(c => {
                        const linked = listProjectsForClient(c.id)
                        return (
                            <div key={c.id} className="card">
                                <div className="card-head"><div className="card-title-row"><div className="card-icon">👤</div><div><h2>{c.name}</h2><p className="muted">{c.code}</p></div></div></div>
                                <div className="card-body">
                                    <div className="muted">Proyectos vinculados:</div>
                                    <ul className="list">
                                        {(linked.length ? linked : mockProjects.filter(p => p.clientId === c.id).map(p => p.id)).map(pid => {
                                            const p = mockProjects.find(mp => mp.id === pid)
                                            return p ? (<li key={pid} className="list-row"><div className="strong">{p.title}</div><div className="muted">{p.code}</div></li>) : null
                                        })}
                                    </ul>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </Section>
        </div>
    )
}
