import { useEffect } from 'react';
import { Platform } from 'react-native';

type ShortcutConfig = {
  onSearch?: () => void;
  onEscape?: () => void;
};

export function useWebKeyboardShortcuts(config: ShortcutConfig) {
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      if ((e.key === '/' || (e.ctrlKey && e.key === 'k')) && !isInput) {
        e.preventDefault();
        config.onSearch?.();
      }

      if (e.key === 'Escape') {
        config.onEscape?.();
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [config.onSearch, config.onEscape]);
}
