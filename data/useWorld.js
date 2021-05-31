import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function useWorld(query, shouldFetch) {
  const { data, error } = useSWR(
    shouldFetch ? `/api/worlds?${query}` : null,
    fetcher
  );
  const loading = !data && !error;
  return { loading, error, data };
}
