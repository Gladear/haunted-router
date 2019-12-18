import { useMemo } from 'haunted';

export const useSearchParams = () => useMemo<{ [key: string]: string }>(() => {
  const searchParams = new URLSearchParams(location.search);

  return [...searchParams].reduce((obj, [key, value]) => ({
    ...obj,
    [key]: value,
  }), {});
}, [location.search]);
