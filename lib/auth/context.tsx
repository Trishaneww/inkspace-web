"use client";

// Next.js
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

// Libs
import { authApi } from "@/lib/api/auth";
import type {
  AuthenticatedResponse,
  LoginResponse,
  OAuthCallbackPayload,
  OAuthCallbackResponse,
  OAuthCompletePayload,
  PhoneVerificationRequiredResponse,
  SignupPayload,
} from "@/lib/api/auth";
import { clearTokens, getAccessToken, setTokens } from "@/lib/auth/session";
import { onAuthCleared } from "@/lib/api/refresh";
import type { User } from "@/types/index";

type AuthState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
};

type AuthContextValue = AuthState & {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>;
  signup: (
    payload: SignupPayload,
  ) => Promise<PhoneVerificationRequiredResponse>;
  verifyPhone: (
    verificationId: string,
    code: string,
  ) => Promise<AuthenticatedResponse>;
  resendPhoneCode: (verificationId: string) => Promise<void>;
  completeOAuth: (
    payload: OAuthCallbackPayload,
  ) => Promise<OAuthCallbackResponse>;
  completeOAuthSignup: (
    payload: OAuthCompletePayload,
  ) => Promise<PhoneVerificationRequiredResponse>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
  });

  useEffect(() => {
    const token = getAccessToken();
    const restoreSession: Promise<User | null> = token
      ? authApi.getSession(token)
      : Promise.resolve(null);

    restoreSession
      .then((user) => {
        if (user && token) {
          setState({ user, token, isLoading: false });
        } else {
          setState((s) => ({ ...s, isLoading: false }));
        }
      })
      .catch(() => {
        clearTokens();
        setState({ user: null, token: null, isLoading: false });
      });
  }, []);

  useEffect(() => {
    return onAuthCleared(() => {
      setState({ user: null, token: null, isLoading: false });
    });
  }, []);

  const applyAuth = useCallback((res: AuthenticatedResponse) => {
    setTokens(res.token, res.refreshToken);
    setState({ user: res.user, token: res.token, isLoading: false });
    return res;
  }, []);

  const login = useCallback<AuthContextValue["login"]>(
    async (email, password) => {
      const res = await authApi.login({ email, password });
      if (res.status === "authenticated") applyAuth(res);
      return res;
    },
    [applyAuth],
  );

  const signup = useCallback<AuthContextValue["signup"]>(async (payload) => {
    return authApi.signup(payload);
  }, []);

  const verifyPhone = useCallback<AuthContextValue["verifyPhone"]>(
    async (verificationId, code) => {
      const res = await authApi.verifyPhone({ verificationId, code });
      applyAuth(res);
      return res;
    },
    [applyAuth],
  );

  const resendPhoneCode = useCallback<AuthContextValue["resendPhoneCode"]>(
    async (verificationId) => {
      await authApi.resendPhoneCode(verificationId);
    },
    [],
  );

  const completeOAuth = useCallback<AuthContextValue["completeOAuth"]>(
    async (payload) => {
      const res = await authApi.oauthCallback(payload);
      if (res.status === "authenticated") applyAuth(res);
      return res;
    },
    [applyAuth],
  );

  const completeOAuthSignup = useCallback<
    AuthContextValue["completeOAuthSignup"]
  >(async (payload) => {
    return authApi.completeOAuthSignup(payload);
  }, []);

  const logout = useCallback<AuthContextValue["logout"]>(async () => {
    const token = state.token;
    clearTokens();
    setState({ user: null, token: null, isLoading: false });
    if (token) authApi.logout(token).catch(() => undefined);
  }, [state.token]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        isAuthenticated: !!state.user,
        login,
        signup,
        verifyPhone,
        resendPhoneCode,
        completeOAuth,
        completeOAuthSignup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
