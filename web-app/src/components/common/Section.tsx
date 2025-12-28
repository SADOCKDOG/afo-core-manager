import { PropsWithChildren } from 'react'

interface SectionProps extends PropsWithChildren {
    title: string
    description?: string
}

export function Section({ title, description, children }: SectionProps) {
    return (
        <div className="section">
            <div className="section-head">
                <h3>{title}</h3>
                {description && <p className="muted">{description}</p>}
            </div>
            {children}
        </div>
    )
}
