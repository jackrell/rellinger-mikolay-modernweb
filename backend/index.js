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
You are simulating a fictional 5v5 NBA game between two user-created lineups. Respond in this exact JSON format, and nothing else:

\`\`\`json
{
  "teamA": "Team A Name",
  "teamB": "Team B Name",
  "scoreA": 120,
  "scoreB": 115,
  "mvp": "Player Name — 32 PTS, 10 REB, 7 AST",
  "summary": "A few fun sentences describing the game’s flow and standout moments."
}
\`\`\`

Make the summary exciting and dramatic. Do NOT include commentary or explanation before or after the JSON block. Player stats are there as a guide, players can often over or under perform their projections. The MVPs can vary. Upsets can happen, but reasonably. No bench players, only starters.

${includeMatchupInstructions ? "Since positional data is provided, feel free to comment briefly on key position matchups (e.g., point guard vs point guard, center vs center) if relevant to the game's story." : ""}

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
        max_tokens: 500,
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

    // Extract JSON block from response using regex
    const jsonMatch = aiOutput.match(/```json\s*([\s\S]*?)\s*```/i);
    if (!jsonMatch) {
      throw new Error("No valid JSON block found in AI response.");
    }

    const parsed = JSON.parse(jsonMatch[1]);

    console.log("✅ Parsed Simulation Result:", parsed);
    res.json({ result: parsed });
  } catch (err) {
    console.error("❌ Failed to parse JSON response:", err);
    res.status(500).json({ error: "Invalid JSON format returned from AI." });
  }
});

app.listen(PORT, () => {
  console.log("🔥 Backend server starting up...");
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
