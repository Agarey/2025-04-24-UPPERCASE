import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '../../styles/pages/Detail.module.css';

const PLACEHOLDER = process.env.NEXT_PUBLIC_PLACEHOLDER_IMAGE ?? '';

interface Props {
  data: Record<string, any> | null;
  error?: string;
}

export default function MovieDetail({ data, error }: Props) {
  const router = useRouter();

  if (error) return <p className={styles.error}>{error}</p>;
  if (!data) return <p className={styles.error}>No data</p>;

  return (
    <>
      <Head>
        <title>{`${data.Title} – Movie catalog`}</title>
        <meta name="description" content={data.Plot} />
      </Head>

      <div className={styles.wrapper}>
        <button type="button" onClick={router.back} className={styles.backbtn}>
          ← Back
        </button>

        <img
          src={
            data.Poster && data.Poster !== 'N/A' ? data.Poster : PLACEHOLDER
          }
          alt={data.Title}
          className={styles.poster}
        />

        <div className={styles.info}>
          <h1 className={styles.title}>{data.Title}</h1>
          <p className={styles.meta}>
            {data.Year} • {data.Runtime} • {data.Genre}
          </p>

          <p className={styles.plot}>{data.Plot}</p>

          <ul className={styles.list}>
            <li><strong>Director:</strong> {data.Director}</li>
            <li><strong>Writer:</strong> {data.Writer}</li>
            <li><strong>Actors:</strong> {data.Actors}</li>
            <li><strong>Language:</strong> {data.Language}</li>
            <li><strong>Country:</strong> {data.Country}</li>
            <li><strong>Awards:</strong> {data.Awards}</li>
            <li><strong>IMDb:</strong> {data.imdbRating} ({data.imdbVotes} votes)</li>
            {data.BoxOffice && (
              <li><strong>Box&nbsp;office:</strong> {data.BoxOffice}</li>
            )}
          </ul>

          {data.Ratings?.length > 0 && (
            <div className={styles.ratings_block}>
              {data.Ratings.map((r: any) => (
                <span key={r.Source} className={styles.rating_item}>
                  {r.Source}: {r.Value}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  params,
  req,
}) => {
  const id = params?.id as string;
  try {
    const base =
      process.env.NEXT_PUBLIC_SITE_URL ??
      `http://${req.headers.host ?? 'localhost:3000'}`;

    const res = await fetch(`${base}/api/movie/${id}`);
    if (!res.ok) throw new Error(`status ${res.status}`);
    const data = await res.json();

    return { props: { data } };
  } catch {
    return { props: { data: null, error: 'Cannot load movie info' } };
  }
};
