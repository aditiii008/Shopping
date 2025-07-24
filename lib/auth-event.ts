
export const authEvent = new EventTarget();

export function emitAuthChange() {
  authEvent.dispatchEvent(new Event("auth-change"));
}
