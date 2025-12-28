type Json = string | number | boolean | null | Json[] | { [key: string]: Json }

const hasLocalStorage = typeof window !== 'undefined' && !!window.localStorage

export const storage = {
    get<T>(key: string, fallback: T): T {
        try {
            if (hasLocalStorage) {
                const raw = window.localStorage.getItem(key)
                if (raw) return JSON.parse(raw) as T
            }
        } catch { }
        return fallback
    },
    set<T>(key: string, value: T): void {
        try {
            if (hasLocalStorage) {
                window.localStorage.setItem(key, JSON.stringify(value))
            }
        } catch { }
    }
}
