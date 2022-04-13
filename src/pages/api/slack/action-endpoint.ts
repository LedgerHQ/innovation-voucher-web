import type { NextApiRequest, NextApiResponse } from "next";

const slackChallenge = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") res.status(400).end();

  try {
    const { challenge } = req.body;
    res.status(200).setHeader("Content-Type", "application/json").json({ challenge });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export default slackChallenge;
