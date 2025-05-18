/**
 * Gets a cookie value by name
 */
export function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
}

/**
 * Sets a cookie with the given name, value, and optional days until expiration
 */
export function setCookie(name: string, value: string, days?: number): void {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${value}${expires}; path=/`;
}

/**
 * Deletes a cookie by name
 */
export function deleteCookie(name: string): void {
  document.cookie = `${name}=; Max-Age=-99999999;`;
}