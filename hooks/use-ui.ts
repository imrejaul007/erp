import { useEffect, useState } from 'react';
import { useUIStore } from '@/store/ui';

// UI state hooks
export const useSidebar = () => {
  const {
    sidebarOpen,
    sidebarCollapsed,
    setSidebarOpen,
    setSidebarCollapsed,
    toggleSidebar,
    toggleSidebarCollapse,
  } = useUIStore();

  return {
    isOpen: sidebarOpen,
    isCollapsed: sidebarCollapsed,
    setOpen: setSidebarOpen,
    setCollapsed: setSidebarCollapsed,
    toggle: toggleSidebar,
    toggleCollapse: toggleSidebarCollapse,
  };
};

export const useModal = (modalId: string) => {
  const { isModalOpen, openModal, closeModal, toggleModal } = useUIStore();

  return {
    isOpen: isModalOpen(modalId),
    open: () => openModal(modalId),
    close: () => closeModal(modalId),
    toggle: () => toggleModal(modalId),
  };
};

export const useLoading = (key: string) => {
  const { isLoading, setLoading } = useUIStore();

  return {
    isLoading: isLoading(key),
    setLoading: (loading: boolean) => setLoading(key, loading),
  };
};

export const useNotifications = () => {
  const { notifications, addNotification, removeNotification, clearNotifications } = useUIStore();

  const notify = {
    success: (title: string, message?: string, duration?: number) =>
      addNotification({ type: 'success', title, message, duration }),
    error: (title: string, message?: string, duration?: number) =>
      addNotification({ type: 'error', title, message, duration }),
    warning: (title: string, message?: string, duration?: number) =>
      addNotification({ type: 'warning', title, message, duration }),
    info: (title: string, message?: string, duration?: number) =>
      addNotification({ type: 'info', title, message, duration }),
  };

  return {
    notifications,
    notify,
    remove: removeNotification,
    clear: clearNotifications,
  };
};

// Theme hook
export const useTheme = () => {
  const { theme, setTheme } = useUIStore();

  return {
    theme,
    setTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    isSystem: theme === 'system',
  };
};

// Media query hook
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
};

// Responsive breakpoint hooks
export const useBreakpoint = () => {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');
  const isLarge = useMediaQuery('(min-width: 1280px)');

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLarge,
    current: isMobile ? 'mobile' : isTablet ? 'tablet' : isDesktop ? 'desktop' : 'large',
  };
};

// Click outside hook
export const useClickOutside = (
  ref: React.RefObject<HTMLElement>,
  handler: () => void
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ref, handler]);
};

// Keyboard shortcut hook
export const useKeyboard = (key: string, callback: () => void, deps: any[] = []) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === key) {
        event.preventDefault();
        callback();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, deps);
};

// Copy to clipboard hook
export const useCopyToClipboard = () => {
  const [copied, setCopied] = useState(false);
  const { notify } = useNotifications();

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      notify.success('Copied to clipboard');

      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      notify.error('Failed to copy to clipboard');
    }
  };

  return { copied, copy };
};

// Scroll position hook
export const useScrollPosition = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollY;
};

// Window size hook
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};