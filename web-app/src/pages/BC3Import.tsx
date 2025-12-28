import { BC3Importer } from '../features/importers/BC3Importer'

export function BC3ImportPage() {
    return (
        <div className="page">
            <div className="page-header">
                <p className="eyebrow">BC3</p>
                <h1>Importar Presupuesto BC3</h1>
            </div>
            <BC3Importer />
        </div>
    )
}