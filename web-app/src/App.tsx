import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { AFOChecklistPage } from './pages/AFOChecklist'
import { BC3ImportPage } from './pages/BC3Import'
import { BillingManagerPage } from './pages/BillingManager'
import { BudgetManagerPage } from './pages/BudgetManager'
import { ClientesPage } from './pages/Clientes'
import { ComplianceWizardPage } from './pages/ComplianceWizard'
import { DashboardPage } from './pages/Dashboard'
import { DocumentosPage } from './pages/Documentos'
import { EmailConfigPage } from './pages/EmailConfig'
import { EmailLogsPage } from './pages/EmailLogs'
import { ExpedientesPage } from './pages/Expedientes'
import { FinanzasPage } from './pages/Finanzas'
import { NormativaPage } from './pages/Normativa'
import { PGOUImporterPage } from './pages/PGOUImporter'
import { VisaManagerPage } from './pages/VisaManager'

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
                <Route path="/clientes" element={<ClientesPage />} />
                <Route path="/afo" element={<AFOChecklistPage />} />
                <Route path="/cte-wizard" element={<ComplianceWizardPage />} />
                <Route path="/visado" element={<VisaManagerPage />} />
                <Route path="/presupuesto" element={<BudgetManagerPage />} />
                <Route path="/facturacion" element={<BillingManagerPage />} />
                <Route path="/email" element={<EmailConfigPage />} />
                <Route path="/email-logs" element={<EmailLogsPage />} />
                <Route path="/bc3" element={<BC3ImportPage />} />
                <Route path="/pgou" element={<PGOUImporterPage />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </AppLayout>
    )
}
