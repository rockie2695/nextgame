import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function usePlace(query) {
  const { data, error } = useSWR(`/api/places?${query}`, fetcher);
  const loading = !data && !error;
  return { loading, error, data };
}
