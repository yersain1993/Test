import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";

import type { LoginCredentials } from "@/features/auth/types/loginTypes";
import type { LoginResult } from "@/features/auth/services/loginService";
import { logoutSession, refreshSession } from "@/features/auth/services/authSessionService";
import { loginWithCredentials } from "@/features/auth/services/loginService";
import type { AuthUser } from "@/features/auth/types/loginTypes";

const SESSION_MARKER_KEY = "auth.session.active";

type UserContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<LoginResult>;
  logout: () => Promise<void>;
  bootstrapSession: () => Promise<void>;
};

const defaultValue: UserContextValue = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({ ok: false, reason: "unknown_error" }),
  logout: async () => {},
  bootstrapSession: async () => {},
};

export const UserContext = createContext<UserContextValue>(defaultValue);

export const useAuth = () => useContext(UserContext);

export const UserProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const bootstrapSession = useCallback(async () => {
    const hasPreviousSession = localStorage.getItem(SESSION_MARKER_KEY) === "1";

    if (!hasPreviousSession) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const refreshResult = await refreshSession();

    if (refreshResult) {
      setUser(refreshResult);
      setIsLoading(false);
      return;
    }

    localStorage.removeItem(SESSION_MARKER_KEY);
    setUser(null);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<LoginResult> => {
    const result = await loginWithCredentials(credentials);

    if (result.ok) {
      localStorage.setItem(SESSION_MARKER_KEY, "1");
      setUser(result.data.user);
    }

    return result;
  }, []);

  const logout = useCallback(async () => {
    await logoutSession();
    localStorage.removeItem(SESSION_MARKER_KEY);
    setUser(null);
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => {
      void bootstrapSession();
    });
  }, [bootstrapSession]);

  return createElement(
    UserContext.Provider,
    {
      value: {
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        logout,
        bootstrapSession,
      },
    },
    children
  );
};


 
