import { Card } from '../components/common/Card'
import { Section } from '../components/common/Section'
import { mockFinance } from '../lib/data/mockFinance'

export function FinanzasPage() {
    const pending = mockFinance.filter(f => f.status === 'pending')
    const paid = mockFinance.filter(f => f.status === 'paid')

    return (
        <div className="page">
            <div className="page-header">
                <p className="eyebrow">Finanzas</p>
                <h1>Presupuestos y facturación por hitos</h1>
            </div>
            <Section title="Pendientes de cobro" description="Integrar CFO → factura final">
                <div className="grid two">
                    {pending.map(item => (
                        <Card key={item.id} title={item.concept} subtitle={`Proyecto ${item.projectId}`}>
                            <div className="pill-row">
                                <span className="pill">{item.amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
                                <span className="pill">{item.status}</span>
                            </div>
                        </Card>
                    ))}
                </div>
            </Section>
            <Section title="Pagados" description="Histórico reciente">
                <div className="grid two">
                    {paid.map(item => (
                        <Card key={item.id} title={item.concept} subtitle={`Proyecto ${item.projectId}`}>
                            <div className="pill-row">
                                <span className="pill">{item.amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
                                <span className="pill success">{item.status}</span>
                            </div>
                        </Card>
                    ))}
                </div>
            </Section>
        </div>
    )
}
