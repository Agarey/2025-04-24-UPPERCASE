import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

interface RawDetails {
  Plot: string;
  imdbRating: string;
}

const EMPTY_DETAILS: RawDetails = { Plot: 'N/A', imdbRating: 'N/A' };
const detailsCache = new Map<string, RawDetails>();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { ids } = req.query;

  if (!ids || typeof ids !== 'string') {
    res.status(400).json({ error: 'Missing ids' });
    return;
  }

  const { OMDB_API_KEY, OMDB_API_URL } = process.env;
  if (!OMDB_API_KEY || !OMDB_API_URL) {
    res.status(500).json({ error: 'Env missing' });
    return;
  }

  const idArr = ids.split(',');

  const result: Record<string, RawDetails> = {};
  const needFetch: string[] = [];
  idArr.forEach((id) => {
    if (detailsCache.has(id)) {
      result[id] = detailsCache.get(id)!;
    } else {
      needFetch.push(id);
    }
  });

  if (needFetch.length) {
    const settled = await Promise.allSettled(
      needFetch.map((id) =>
        axios
          .get<RawDetails>(OMDB_API_URL, {
            params: { apikey: OMDB_API_KEY, i: id, plot: 'short' },
            timeout: 6000,
          })
          .then((r) => ({ id, data: r.data })),
      ),
    );

    settled.forEach((res, idx) => {
      const id = needFetch[idx];
      if (res.status === 'fulfilled' && res.value.data?.Plot) {
        detailsCache.set(id, res.value.data);
      } else {
        detailsCache.set(id, EMPTY_DETAILS);
      }
      result[id] = detailsCache.get(id)!;
    });
  }

  res.setHeader(
    'Cache-Control',
    'public, max-age=3600, stale-while-revalidate=86400',
  );
  res.status(200).json({ details: result });
}
