import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(_: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    name: 'John Doe',
    avatarUrl: '',
  });
}
