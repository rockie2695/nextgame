import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function useWorld(query) {
  const { data, error } = useSWR(`/api/worlds?${query}`, fetcher);
  const loading = !data && !error;
  return { loading, error, data };
}
