import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const fullInfoCache = new Map<string, any>();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    res.status(400).json({ error: 'Missing id' });
    return;
  }

  if (fullInfoCache.has(id)) {
    res.setHeader(
      'Cache-Control',
      'public, max-age=3600, stale-while-revalidate=86400',
    );
    res.status(200).json(fullInfoCache.get(id));
    return;
  }

  const { OMDB_API_KEY, OMDB_API_URL } = process.env;
  if (!OMDB_API_KEY || !OMDB_API_URL) {
    res.status(500).json({ error: 'Env missing' });
    return;
  }

  try {
    const { data } = await axios.get(OMDB_API_URL, {
      params: { apikey: OMDB_API_KEY, i: id, plot: 'full' },
    });

    fullInfoCache.set(id, data);

    res.setHeader(
      'Cache-Control',
      'public, max-age=3600, stale-while-revalidate=86400',
    );
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}
