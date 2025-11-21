import React from 'react';

// Типи
export type Route = {
  path: string;
  component: React.ComponentType;
  exact?: boolean;
};

export type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  to: string;
};

// --- 1. Основний хук роутера ---
export const useRouter = () => {
  const getPath = () =>
    typeof window !== 'undefined' ? window.location.pathname : '/';

  const [currentPath, setCurrentPath] = React.useState(getPath);

  React.useEffect(() => {
    const handlePopState = () => {
      const newPath = getPath();
      setCurrentPath(newPath);
    };

    // Слухаємо подію "popstate" (браузерна кнопка "Назад")
    window.addEventListener('popstate', handlePopState);
    // Слухаємо нашу кастомну подію "pushstate" (кліки по Link)
    window.addEventListener('pushstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('pushstate', handlePopState);
    };
  }, []);

  const navigate = React.useCallback((path: string) => {
    if (typeof window === 'undefined') return;
    if (window.location.pathname === path) return;

    window.history.pushState({}, '', path);
    
    // Важливо: створюємо подію, щоб інші компоненти дізналися про зміну
    const navEvent = new Event('pushstate');
    window.dispatchEvent(navEvent);
    
    window.scrollTo(0, 0);
  }, []);

  return { currentPath, navigate };
};

// --- 2. Компонент Link ---
export const Link: React.FC<LinkProps> = ({
  to,
  onClick,
  children,
  className,
  ...rest
}) => {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // Забороняємо стандартне перезавантаження
    onClick?.(e);
    navigate(to);
  };

  return (
    <a href={to} onClick={handleClick} className={className} {...rest}>
      {children}
    </a>
  );
};

// --- 3. Компонент Router ---
export const Router: React.FC<{
  routes: Route[];
  fallback?: React.ComponentType;
}> = ({ routes, fallback: Fallback }) => {
  const { currentPath } = useRouter();

  const matchedRoute = React.useMemo(() => {
    return routes.find(route => {
      if (route.exact) {
        return route.path === currentPath;
      }
      return currentPath.startsWith(route.path);
    });
  }, [routes, currentPath]);

  if (matchedRoute) {
    const Component = matchedRoute.component;
    return <Component key={currentPath} />;
  }

  if (Fallback) {
    const F = Fallback;
    return <F />;
  }

  return null;
};