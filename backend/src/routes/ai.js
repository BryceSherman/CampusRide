const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const router = express.Router();

router.post('/ai-summary', async (req, res) => {
  const { pickup, dropoff, distance, fare } = req.body;

  const response = await fetch(
    `${process.env.AZURE_OPENAI_ENDPOINT}openai/deployments/gpt-4o/chat/completions?api-version=2024-02-01`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.AZURE_OPENAI_API_KEY
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'You are a helpful ride assistant for CampusRide, a campus ride-sharing app.'
          },
          {
            role: 'user',
            content: `A rider just requested a ride:
            - Pickup: ${pickup}
            - Dropoff: ${dropoff}
            - Distance: ${distance} miles
            - Estimated fare: $${fare}
            Give a friendly 1-2 sentence summary and one helpful tip. Be concise.`
          }
        ],
        max_tokens: 150
      })
    }
  );

  const data = await response.json();
  const summary = data.choices[0].message.content;
  res.json({ summary });
});

module.exports = router;