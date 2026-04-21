"use client";

import type { User } from "firebase/auth";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { AppUserRole } from "@/cms/types/enums";
import { subscribeCmsAuth } from "@/firebase/auth";
import { isFirebaseClientConfigured } from "@/firebase/client";
import { fetchCmsUserRole } from "./fetch-cms-role";
import { roleHasPermission, type CmsPermission } from "./permissions";

type CmsAuthState = {
  configured: boolean;
  /** Firebase user; `undefined` = noch nicht bekannt, `null` = abgemeldet */
  user: User | null | undefined;
  /** Rolle aus Firestore `users/{uid}`; `undefined` = wird geladen */
  role: AppUserRole | null | undefined;
  roleReady: boolean;
  /** Gesamt-Ladezustand für geschützte Seiten */
  ready: boolean;
};

const CmsAuthContext = createContext<
  | (CmsAuthState & {
      refreshRole: () => Promise<void>;
      /** True when the resolved role may perform the permission (admin = all). */
      hasPermission: (permission: CmsPermission) => boolean;
    })
  | null
>(null);

export function CmsAuthProvider({ children }: { children: React.ReactNode }) {
  const configured = isFirebaseClientConfigured();
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [role, setRole] = useState<AppUserRole | null | undefined>(undefined);
  const [roleReady, setRoleReady] = useState(false);
  const roleLoadSeq = useRef(0);

  /** Loads or clears role off the React render path (avoids set-state-in-effect lint). */
  const loadRoleForUser = useCallback((authUser: User | null): Promise<void> => {
    const seq = ++roleLoadSeq.current;
    return new Promise((resolve) => {
      queueMicrotask(() => {
        void (async () => {
          if (roleLoadSeq.current !== seq) {
            resolve();
            return;
          }
          if (!authUser) {
            setRole(null);
            setRoleReady(true);
            resolve();
            return;
          }
          setRoleReady(false);
          try {
            const fromDb = await fetchCmsUserRole(authUser.uid);
            if (roleLoadSeq.current !== seq) {
              resolve();
              return;
            }
            setRole(fromDb ?? "editor");
          } catch {
            if (roleLoadSeq.current !== seq) {
              resolve();
              return;
            }
            setRole("editor");
          } finally {
            if (roleLoadSeq.current === seq) {
              setRoleReady(true);
            }
            resolve();
          }
        })();
      });
    });
  }, []);

  const refreshRole = useCallback(() => loadRoleForUser(user ?? null), [user, loadRoleForUser]);

  useEffect(() => {
    if (!configured) {
      queueMicrotask(() => {
        setUser(null);
        setRole(null);
        setRoleReady(true);
      });
      return;
    }
    return subscribeCmsAuth((nextUser) => {
      setUser(nextUser);
    });
  }, [configured]);

  useEffect(() => {
    if (!configured) return;
    if (user === undefined) return;
    void loadRoleForUser(user);
  }, [user, configured, loadRoleForUser]);

  const ready = useMemo(() => {
    if (!configured) return true;
    if (user === undefined) return false;
    if (user === null) return true;
    return roleReady;
  }, [configured, user, roleReady]);

  const hasPermission = useCallback(
    (permission: CmsPermission) => roleHasPermission(role, permission),
    [role],
  );

  const value = useMemo(
    () => ({
      configured,
      user,
      role,
      roleReady,
      ready,
      refreshRole,
      hasPermission,
    }),
    [configured, user, role, roleReady, ready, refreshRole, hasPermission],
  );

  return <CmsAuthContext.Provider value={value}>{children}</CmsAuthContext.Provider>;
}

export function useCmsAuth() {
  const ctx = useContext(CmsAuthContext);
  if (!ctx) {
    throw new Error("useCmsAuth muss innerhalb von CmsAuthProvider verwendet werden.");
  }
  return ctx;
}

/** Optional hook: returns `null` outside provider instead of throwing. */
export function useCmsAuthOptional() {
  return useContext(CmsAuthContext);
}

export function useCmsPermission(permission: CmsPermission): boolean {
  const ctx = useCmsAuth();
  return ctx.hasPermission(permission);
}
