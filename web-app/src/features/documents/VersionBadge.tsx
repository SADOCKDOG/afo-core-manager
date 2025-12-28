interface VersionBadgeProps { version: string }
export function VersionBadge({ version }: VersionBadgeProps) {
    return <span className="badge">{version}</span>
}
