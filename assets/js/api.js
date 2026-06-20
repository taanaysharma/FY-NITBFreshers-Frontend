// ─────────────────────────────────────────────────────────────
// api.js — Token-based auth (no cookies — InfinityFree CORS limitation)
// ─────────────────────────────────────────────────────────────

const BASE_URL = 'https://nitbfreshers.42web.io/userlogin/api';

// ─── Token Storage Helpers ──────────────────────────────────
function getToken() {
    return localStorage.getItem('token');
}
function setToken(token) {
    localStorage.setItem('token', token);
}
function clearToken() {
    localStorage.removeItem('token');
}

// ─── Core Fetch Helpers ───────────────────────────────────────

async function _get(path, params = {}) {
    const url = new URL(BASE_URL + path);
    Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));

    const headers = {};
    const token = getToken();
    if (token) headers['Authorization'] = 'Bearer ' + token;

    const res = await fetch(url.toString(), {
        method: 'GET',
        headers,
        // credentials: 'include' — HATAYA GAYA, cookies use nahi ho rahi ab
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
}

async function _post(path, body = {}) {
    const headers = { 'Content-Type': 'text/plain' }; // Preflight avoid karne ke liye
    const token = getToken();
    if (token) headers['Authorization'] = 'Bearer ' + token;

    const res = await fetch(BASE_URL + path, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
}

async function _upload(path, formData) {
    const headers = {};
    const token = getToken();
    if (token) headers['Authorization'] = 'Bearer ' + token;

    const res = await fetch(BASE_URL + path, {
        method: 'POST',
        headers,
        body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Upload failed');
    return data;
}

// ─── Auth ─────────────────────────────────────────────────────
const Auth = {
    login: async (username, password) => {
        const data = await _post('/login.php', { username, password });
        if (data.token) setToken(data.token);
        return data;
    },
    logout: async () => {
        try { await _post('/logout.php'); } finally { clearToken(); }
    },
    me: () => _get('/me.php'),
};

// ─── Dashboard ────────────────────────────────────────────────
const Dashboard = {
    get: () => _get('/dashboard.php'),
};

// ─── Attendance ───────────────────────────────────────────────
const Attendance = {
    get:  (month, year) => _get('/attendance.php', { month, year }),
    mark: (subject, status, date) => _post('/attendance.php', { subject, status, date }),
};

// ─── Resources ────────────────────────────────────────────────
const Resources = {
    groups:   ()                               => _get('/resources.php'),
    subjects: (group)                          => _get('/resources.php', { group }),
    folders:  (group, subject)                 => _get('/resources.php', { group, subject }),
    files:    (group, subject, folder)         => _get('/resources.php', { group, subject, folder }),
    fileUrl:  (group, subject, folder, file) => {
        const token = getToken();
        return `${BASE_URL}/resources.php?group=${encodeURIComponent(group)}&subject=${encodeURIComponent(subject)}&folder=${encodeURIComponent(folder)}&file=${encodeURIComponent(file)}&token=${encodeURIComponent(token)}`;
    },
};

// ─── Password ─────────────────────────────────────────────────
const Password = {
    change: (oldPassword, newPassword, confirmPassword) =>
        _post('/password.php', { oldPassword, newPassword, confirmPassword }),
};

// ─── Upload ───────────────────────────────────────────────────
const Upload = {
    file: (file, subject, group_name, folder) => {
        const form = new FormData();
        form.append('file', file);
        form.append('subject', subject);
        form.append('group_name', group_name);
        form.append('folder', folder);
        return _upload('/upload.php', form);
    },
};
