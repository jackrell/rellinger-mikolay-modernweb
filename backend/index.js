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
    const createdBy = team.createdByUsername || "Unknown";
    const players = (team.players || []).map((p, i) => `${i + 1}. ${p.name}`).join("\n");
    return `🏀 ${name} (created by ${createdBy})\n${players}`;
  };

  const prompt = `
You are simulating a fictional 5v5 NBA game between two user-created five man teams. Respond in the following structured format:

1. Final Score: [Team A Name] [Score A] - [Score B] [Team B Name]
2. MVP: [Player Name] — [Statline, e.g. "32 PTS, 10 REB, 7 AST"]
3. Summary: [3–5 sentences describing the flow and key moments of the game]

--- TEAM A ---
${formatRoster(teamA)}

--- TEAM B ---
${formatRoster(teamB)}

Don't say anything about who created the team. Make it interesting, there's always a chance for an upset.`;

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

    // Extract Final Score
    const scoreRegex = /Final Score:\s*(.+?)\s+(\d+)\s*-\s*(\d+)\s+(.+)/i;
    const scoreMatch = aiOutput.match(scoreRegex);

    const mvpMatch = aiOutput.match(/MVP:\s*(.+)/i);
    const summaryMatch = aiOutput.match(/Summary:\s*([\s\S]*)/i);

    const result = {
      teamA: scoreMatch ? scoreMatch[1].trim() : "Team A",
      scoreA: scoreMatch ? parseInt(scoreMatch[2]) : "N/A",
      scoreB: scoreMatch ? parseInt(scoreMatch[3]) : "N/A",
      teamB: scoreMatch ? scoreMatch[4].trim() : "Team B",
      mvp: mvpMatch ? mvpMatch[1].trim() : "N/A",
      summary: summaryMatch ? summaryMatch[1].trim() : "N/A"
    };

    console.log("✅ Parsed Simulation Result:", result);
    res.json({ result });
  } catch (err) {
    console.error("❌ Simulation error:", err);
    res.status(500).json({ error: "Failed to simulate game." });
  }
});

app.listen(PORT, () => {
  console.log("🔥 Backend server starting up...");
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
