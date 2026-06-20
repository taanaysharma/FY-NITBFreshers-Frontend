// ─────────────────────────────────────────────────────────────
// auth.js — Login, logout, aur page guard
// Har protected page pe include karo
// ─────────────────────────────────────────────────────────────

// ─── Guard — Protected pages pe call karo ────────────────────
// Agar logged in nahi → login page pe bhej do
async function requireAuth() {
    try {
        const user = await Auth.me();
        // User data localStorage mein save karo (fast access ke liye)
        localStorage.setItem('user', JSON.stringify(user));
        return user;
    } catch {
        localStorage.removeItem('user');
        window.location.href = '/index.html';
        return null;
    }
}

// ─── Redirect if already logged in ───────────────────────────
// Login page pe call karo — agar already logged in → dashboard
async function redirectIfLoggedIn() {
    try {
        await Auth.me();
        window.location.href = '/dashboard.html';
    } catch {
        // Not logged in — login page pe rehne do
    }
}

// ─── Logout ───────────────────────────────────────────────────
async function logout() {
    try {
        await Auth.logout();
    } catch {
        // Error aaye toh bhi logout karo
    } finally {
        localStorage.removeItem('user');
        window.location.href = '/index.html';
    }
}

// ─── Get current user from localStorage ──────────────────────
function getUser() {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
}

// ─── Show error message ───────────────────────────────────────
function showError(elementId, message) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = message;
    el.classList.remove('hidden');
    setTimeout(() => el.classList.add('hidden'), 5000);
}

// ─── Show success message ─────────────────────────────────────
function showSuccess(elementId, message) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = message;
    el.classList.remove('hidden');
    setTimeout(() => el.classList.add('hidden'), 3000);
}

// ─── Loading button state ─────────────────────────────────────
function setLoading(btnId, loading, text = 'Loading...') {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.disabled = loading;
    btn.dataset.originalText = btn.dataset.originalText || btn.textContent;
    btn.textContent = loading ? text : btn.dataset.originalText;
}