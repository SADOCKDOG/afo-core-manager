export function formatEUR(amount: number): string {
    return amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
}

export function sum(amounts: number[]): number {
    return amounts.reduce((a, b) => a + b, 0)
}
