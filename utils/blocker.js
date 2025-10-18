let blocking = false;
let whitelist = [];

export function setWhitelist(apps) {
  whitelist = apps;
}

export function startBlocking() {
  blocking = true;
}

export function stopBlocking() {
  blocking = false;
}

export function isBlocked(appName) {
  return blocking && !whitelist.includes(appName);
}
