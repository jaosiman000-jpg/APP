import { useState, useEffect } from 'react';

export type UserSession = {
  email: string;
  name: string;          // derivado da parte antes do @
  loggedInAt: string;    // ISO date
  installPromptDismissed: boolean;
  lastReadModule: number | null;
};

export type Progress = {
  completedModules: number[];  // array de IDs
  currentModule: number | null;
};

const SESSION_KEY = 'rm_session';
const PROGRESS_KEY = 'rm_progress';

const getLocalStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

const setLocalStorage = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  try {
    if (value === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
    // Dispatch a custom event to notify other instances/hooks in the same tab
    window.dispatchEvent(new CustomEvent(`local-storage-${key}`, { detail: value }));
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
};

export const getSession = (): UserSession | null => {
  return getLocalStorage<UserSession | null>(SESSION_KEY, null);
};

export const setSession = (session: UserSession | null): void => {
  setLocalStorage(SESSION_KEY, session);
};

export const getProgress = (): Progress => {
  return getLocalStorage<Progress>(PROGRESS_KEY, {
    completedModules: [],
    currentModule: null,
  });
};

export const setProgress = (progress: Progress): void => {
  setLocalStorage(PROGRESS_KEY, progress);
};

export const useSession = () => {
  const [session, setSessionState] = useState<UserSession | null>(null);

  useEffect(() => {
    // Initial load
    setSessionState(getSession());

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === SESSION_KEY) {
        setSessionState(e.newValue ? JSON.parse(e.newValue) : null);
      }
    };

    const handleCustomChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setSessionState(customEvent.detail);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(`local-storage-${SESSION_KEY}`, handleCustomChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(`local-storage-${SESSION_KEY}`, handleCustomChange);
    };
  }, []);

  const updateSession = (newSession: Partial<UserSession> | null) => {
    if (newSession === null) {
      setSession(null);
      setSessionState(null);
    } else {
      const current = getSession() || {
        email: '',
        name: '',
        loggedInAt: new Date().toISOString(),
        installPromptDismissed: false,
        lastReadModule: null,
      };
      const updated = { ...current, ...newSession };
      setSession(updated);
      setSessionState(updated);
    }
  };

  return { session, setSession: updateSession };
};

export const useProgress = () => {
  const [progress, setProgressState] = useState<Progress>({
    completedModules: [],
    currentModule: null,
  });

  useEffect(() => {
    // Initial load
    setProgressState(getProgress());

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === PROGRESS_KEY) {
        setProgressState(e.newValue ? JSON.parse(e.newValue) : { completedModules: [], currentModule: null });
      }
    };

    const handleCustomChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setProgressState(customEvent.detail || { completedModules: [], currentModule: null });
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(`local-storage-${PROGRESS_KEY}`, handleCustomChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(`local-storage-${PROGRESS_KEY}`, handleCustomChange);
    };
  }, []);

  const updateProgress = (newProgress: Partial<Progress>) => {
    const current = getProgress();
    const updated = { ...current, ...newProgress };
    setProgress(updated);
    setProgressState(updated);
  };

  return { progress, setProgress: updateProgress };
};
