import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

interface RawSearchItem {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}
interface CleanItem extends RawSearchItem { Poster: string }

const PLACEHOLDER = process.env.NEXT_PUBLIC_PLACEHOLDER_IMAGE ?? '';
const searchCache = new Map<string, { items: CleanItem[]; totalResults: number }>();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { term } = req.query;
  if (!term || typeof term !== 'string') {
    res.status(400).json({ error: 'Missing search term' });
    return;
  }

  if (searchCache.has(term)) {
    res.setHeader('Cache-Control', 'public, max-age=600');
    res.status(200).json(searchCache.get(term));
    return;
  }

  const { OMDB_API_KEY, OMDB_API_URL } = process.env;
  if (!OMDB_API_KEY || !OMDB_API_URL) {
    res.status(500).json({ error: 'Env missing' });
    return;
  }

  try {
    const first = await axios.get(OMDB_API_URL, {
      params: { apikey: OMDB_API_KEY, s: term, page: 1 },
    });

    if (first.data.Response === 'False') {
      const empty = { items: [], totalResults: 0 };
      searchCache.set(term, empty);
      res.setHeader('Cache-Control', 'public, max-age=600');
      res.status(200).json(empty);
      return;
    }

    const totalResults = parseInt(first.data.totalResults);
    const totalPages = Math.ceil(totalResults / 10);

    const restPromises: Promise<any>[] = [];
    for (let p = 2; p <= totalPages; p++) {
      restPromises.push(
        axios.get(OMDB_API_URL, {
          params: { apikey: OMDB_API_KEY, s: term, page: p },
        }),
      );
    }
    const rest = await Promise.all(restPromises);

    const rawItems: RawSearchItem[] = first.data.Search.concat(
      ...rest.flatMap((r) => r.data.Search ?? []),
    );

    const items: CleanItem[] = rawItems.map((item) => ({
      ...item,
      Poster:
        !item.Poster || item.Poster === 'N/A' ? PLACEHOLDER : item.Poster,
    }));

    const payload = { items, totalResults };
    searchCache.set(term, payload);

    res.setHeader('Cache-Control', 'public, max-age=600');
    res.status(200).json(payload);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}
