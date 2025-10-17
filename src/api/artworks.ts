const API_BASE = "https://api.artic.edu/api/v1/artworks";

export async function fetchArtworks(page: number = 1, limit: number = 12) {
  const res = await fetch(`${API_BASE}?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch artworks");
  return res.json();
}
