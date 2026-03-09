// Get global service views
export function getGlobalViews() {
  const raw = localStorage.getItem("globalServiceViews");
  return raw ? JSON.parse(raw) : {};
}

// Increment global service view count
export function incrementGlobalView(serviceKey) {
  const views = getGlobalViews();
  views[serviceKey] = (views[serviceKey] || 0) + 1;
  localStorage.setItem("globalServiceViews", JSON.stringify(views));
}

// ================= Per-User Recently Viewed =================

// Track recently viewed services per logged-in user
export function incrementServiceView(serviceKey, user) {
  if (!user) return;

  const email = user.email || user.username || user.id;
  const storageKey = `recentlyViewed_${email}`;

  try {
    const raw = localStorage.getItem(storageKey);
    const items = raw ? JSON.parse(raw) : [];

    // Remove if already exists
    const filtered = items.filter((i) => i.id !== serviceKey);

    // Add to front
    const next = [{ id: serviceKey, timestamp: Date.now() }, ...filtered];

    // Keep last 10
    if (next.length > 10) next.splice(10);

    localStorage.setItem(storageKey, JSON.stringify(next));
  } catch (e) {
    localStorage.setItem(
      storageKey,
      JSON.stringify([{ id: serviceKey, timestamp: Date.now() }])
    );
  }
}

// Get recently viewed services for a user
export function getRecentlyViewed(user) {
  if (!user) return [];
  const email = user.email || user.username || user.id;
  const storageKey = `recentlyViewed_${email}`;
  const raw = localStorage.getItem(storageKey);
  return raw ? JSON.parse(raw) : [];
}