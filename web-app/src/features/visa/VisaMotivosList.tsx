interface VisaMotivosListProps { motivos: string[] }
export function VisaMotivosList({ motivos }: VisaMotivosListProps) {
    return (
        <ul className="motivos-list">
            {motivos.map((m, i) => <li key={i}>{m}</li>)}
        </ul>
    )
}
