// ─────────────────────────────────────────────────────────────
// auth.js — Token-based login, logout, guard
// ─────────────────────────────────────────────────────────────

async function requireAuth() {
    const token = getToken();
    if (!token) {
        window.location.href = '/index.html';
        return null;
    }

    try {
        const user = await Auth.me();
        localStorage.setItem('user', JSON.stringify(user));
        return user;
    } catch {
        clearToken();
        localStorage.removeItem('user');
        window.location.href = '/index.html';
        return null;
    }
}

async function redirectIfLoggedIn() {
    const token = getToken();
    if (!token) return;

    try {
        await Auth.me();
        window.location.href = '/dashboard.html';
    } catch {
        clearToken();
    }
}

async function logout() {
    try {
        await Auth.logout();
    } finally {
        localStorage.removeItem('user');
        window.location.href = '/index.html';
    }
}

function getUser() {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
}

function showError(elementId, message) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = message;
    el.classList.remove('hidden');
    setTimeout(() => el.classList.add('hidden'), 5000);
}

function showSuccess(elementId, message) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = message;
    el.classList.remove('hidden');
    setTimeout(() => el.classList.add('hidden'), 3000);
}

function setLoading(btnId, loading, text = 'Loading...') {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.disabled = loading;
    btn.dataset.originalText = btn.dataset.originalText || btn.textContent;
    btn.textContent = loading ? text : btn.dataset.originalText;
}
