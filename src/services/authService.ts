import type { Credentials, AuthResult } from "../types";

/**
 * Pre-configured credentials for demo.
 * In production, replace with a real auth provider (LDAP, OAuth, etc.).
 */
const VALID_ACCOUNTS: Credentials[] = [
  { username: "admin", password: "admin" },
  { username: "user", password: "1234" },
  { username: "demo", password: "demo" },
  { username: "engineer", password: "comport" },
  { username: "tech", password: "serial" },
];

/**
 * Authenticate a user against the local credential store.
 * Simulates network delay so the UI can show a loading state.
 */
export async function authenticate(credentials: Credentials): Promise<AuthResult> {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 300));

  const match = VALID_ACCOUNTS.find(
    (c) => c.username === credentials.username && c.password === credentials.password,
  );

  if (match) {
    return { success: true, username: match.username };
  }

  return { success: false, error: "Invalid username or password" };
}

/**
 * Check if a username exists (for progressive validation).
 */
export async function checkUsernameExists(username: string): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 100));
  return VALID_ACCOUNTS.some((c) => c.username === username);
}
