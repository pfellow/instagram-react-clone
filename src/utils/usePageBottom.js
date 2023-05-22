import { useState, useEffect } from 'react';

const usePageBottom = () => {
  const [bottom, setBottom] = useState(false);

  useEffect(() => {
    const scrollHandler = () => {
      const isBottom =
        // window.innerHeight + document.documentElement.scrollTop ===
        // document.documentElement.offsetHeight;
        window.scrollY >=
        document.documentElement.scrollHeight - window.innerHeight;
      setBottom(isBottom);
    };

    window.addEventListener('scroll', scrollHandler);

    return () => {
      window.removeEventListener('scroll', scrollHandler);
    };
  }, []);

  return bottom;
};

export default usePageBottom;
