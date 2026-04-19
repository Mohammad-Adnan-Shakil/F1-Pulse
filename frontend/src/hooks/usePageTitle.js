import { useEffect } from "react";

const usePageTitle = (title) => {
  useEffect(() => {
    document.title = `${title} | F1 Pulse`;
  }, [title]);
};

export default usePageTitle;

