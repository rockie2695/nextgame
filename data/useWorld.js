import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function useWorld(email) {
  const { data, error } = useSWR(
    `/api/worlds?email=${email}`,
    fetcher
  );
  const useloading = !data && !error;
  return { useloading, error, data };
}
