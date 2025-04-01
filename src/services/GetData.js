// src/services/getData
// Fetches all the players from the local players.json

let cachedPlayers = null;

export async function loadAllPlayers() {
  if (cachedPlayers) return cachedPlayers;

  const res = await fetch("/players.json");
  const data = await res.json();
  cachedPlayers = data;
  return data;
}

export async function searchPlayers(query = "") {
  const allPlayers = await loadAllPlayers();
  return allPlayers.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );
}

export async function getPlayerByName(name) {
  const allPlayers = await loadAllPlayers();
  return allPlayers.find(p => p.name.toLowerCase() === name.toLowerCase());
}
