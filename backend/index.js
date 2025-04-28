// backend/index.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true
}));
app.use(express.json());

// Test route
app.get("/api/test", (req, res) => {
  console.log("✅ /api/test route hit");
  res.send("API is working!");
});

// Simulation Route
app.post("/api/simulate-game", async (req, res) => {
  console.log("🎮 POST /api/simulate-game hit");
  const { teamA, teamB } = req.body;

  if (!teamA || !teamB) {
    return res.status(400).json({ error: "Both teams must be provided." });
  }

  const formatRoster = (team) => {
    const name = team.name || "Unknown Team";
    const players = (team.players || []).map((p, i) => {
      const position = p.position ? ` (${p.position})` : "";
      return `${i + 1}. ${p.name}${position}`;
    }).join("\n");
    return `${name}\n${players}`;
  };

  const hasPositions = (team) => {
    return (team.players || []).every(player => player.position);
  };

  const includeMatchupInstructions = hasPositions(teamA) && hasPositions(teamB);

  const prompt = `
You are simulating a fictional 5v5 NBA game between two user-created starting lineups.

Respond ONLY in the following strict JSON format (NO commentary, NO markdown, NO explanations):

{
  "teamA": "Team A Name",
  "teamB": "Team B Name",
  "scoreA": 120,
  "scoreB": 115,
  "mvp": "Player Name — 32 PTS, 10 REB, 7 AST",
  "summary": "An exciting 3–5 sentence description of the game flow and drama.",
  "boxScore": {
    "teamAPlayers": [
      { "name": "Player A1", "pts": 25, "reb": 8, "ast": 5 },
      { "name": "Player A2", "pts": 18, "reb": 4, "ast": 7 }
    ],
    "teamBPlayers": [
      { "name": "Player B1", "pts": 30, "reb": 10, "ast": 2 },
      { "name": "Player B2", "pts": 14, "reb": 6, "ast": 5 }
    ]
  }
}

- Summaries should highlight key moments and possible upsets.
- Player performances should vary realistically.
- Use ONLY starters provided. Do not add imaginary bench players.
- Output only the valid JSON block without extra symbols or markdown.

${includeMatchupInstructions ? "If positional data is given, use it to add flavor to how key matchups shaped the outcome." : ""}

--- TEAM A ---
${formatRoster(teamA)}

--- TEAM B ---
${formatRoster(teamB)}
`;

  try {
    const response = await fetch("https://api.together.xyz/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.TOGETHER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
        temperature: 0.8
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Simulation error:", errorData);
      return res.status(response.status).json({ error: errorData.error?.message || "Failed to simulate game." });
    }

    const data = await response.json();
    const aiOutput = data.choices[0].message.content;

    // Attempt to directly parse the JSON (no regex for markdown fences)
    try {
      const parsed = JSON.parse(aiOutput);
      console.log("✅ Parsed Simulation Result:", parsed);

      // 🏀 Flatten box score here
      const flatBoxScore = [
        ...(parsed.boxScore.teamAPlayers || []).map(player => ({ ...player, team: "A" })),
        ...(parsed.boxScore.teamBPlayers || []).map(player => ({ ...player, team: "B" }))
      ];

      parsed.boxScore = flatBoxScore; // ✨ Now boxScore is a flat array

      res.json({ result: parsed });
    } catch (parseError) {
      console.error("❌ Failed to parse JSON response:", parseError);
      res.status(500).json({ error: "Invalid JSON format returned from AI." });
    }

  } catch (err) {
    console.error("❌ Simulation error:", err);
    res.status(500).json({ error: "Failed to simulate game." });
  }
});

app.listen(PORT, () => {
  console.log("🔥 Backend server starting up...");
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
