import { useEffect } from 'haunted';

export const useTitle = (newTitle: string) => {
  useEffect(() => {
    const { title } = document;
    document.title = newTitle;
    return () => (document.title = title);
  });
};
