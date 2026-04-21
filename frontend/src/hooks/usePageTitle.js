import { useEffect } from "react";

const usePageTitle = (title) => {
  useEffect(() => {
    document.title = `${title} | ApexIQ`;
  }, [title]);
};

export default usePageTitle;

