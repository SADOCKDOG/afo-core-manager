import { PGOUImporter } from '../features/importers/PGOUImporter'

export function PGOUImporterPage() {
    return (
        <div className="page">
            <div className="page-header">
                <p className="eyebrow">PGOU</p>
                <h1>Importador PGOU / Ordenanzas</h1>
            </div>
            <PGOUImporter />
        </div>
    )
}