import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { DashboardPage } from './pages/Dashboard'
import { DocumentosPage } from './pages/Documentos'
import { ExpedientesPage } from './pages/Expedientes'
import { FinanzasPage } from './pages/Finanzas'
import { NormativaPage } from './pages/Normativa'

export default function App() {
    return (
        <AppLayout>
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/expedientes" element={<ExpedientesPage />} />
                <Route path="/normativa" element={<NormativaPage />} />
                <Route path="/documentos" element={<DocumentosPage />} />
                <Route path="/finanzas" element={<FinanzasPage />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </AppLayout>
    )
}
