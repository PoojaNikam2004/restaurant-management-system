const STORAGE_KEY = "aangan_table_number";

export function captureTableNumberFromUrl(searchParams: URLSearchParams): void {
  const table = searchParams.get("table");
  if (table && table.trim()) {
    localStorage.setItem(STORAGE_KEY, table.trim());
  }
}

export function getStoredTableNumber(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY);
}

export function clearStoredTableNumber(): void {
  localStorage.removeItem(STORAGE_KEY);
}