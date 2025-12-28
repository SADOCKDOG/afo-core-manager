import { PropsWithChildren } from 'react'
import '../../styles/global.css'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function AppLayout({ children }: PropsWithChildren) {
    return (
        <div className="layout">
            <Sidebar />
            <div className="content">
                <Topbar />
                <main className="content-body">{children}</main>
            </div>
        </div>
    )
}
