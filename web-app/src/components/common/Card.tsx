import { PropsWithChildren, ReactNode } from 'react'

interface CardProps extends PropsWithChildren {
    title?: string
    icon?: ReactNode
    subtitle?: string
    extra?: ReactNode
}

export function Card({ title, icon, subtitle, extra, children }: CardProps) {
    return (
        <section className="card">
            <div className="card-head">
                <div className="card-title-row">
                    {icon && <span className="card-icon">{icon}</span>}
                    <div>
                        {title && <h2>{title}</h2>}
                        {subtitle && <p className="muted">{subtitle}</p>}
                    </div>
                </div>
                {extra && <div className="card-extra">{extra}</div>}
            </div>
            <div className="card-body">{children}</div>
        </section>
    )
}
