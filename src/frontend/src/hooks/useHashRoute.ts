import { useState, useEffect } from 'react';

export function useHashRoute(defaultRoute: string = '') {
  const [route, setRoute] = useState<string>(() => {
    const hash = window.location.hash.slice(1);
    return hash || defaultRoute;
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      setRoute(hash || defaultRoute);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [defaultRoute]);

  const navigate = (newRoute: string) => {
    window.location.hash = newRoute;
    setRoute(newRoute);
  };

  return { route, navigate };
}
