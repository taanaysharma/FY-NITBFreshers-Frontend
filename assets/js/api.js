// ─────────────────────────────────────────────────────────────
// api.js — Saari fetch() calls yahan hain
// Bas BASE_URL change karo — baaki sab automatically kaam karega
// ─────────────────────────────────────────────────────────────

const BASE_URL = 'https://nitbfreshers.42web.io/userlogin/api';
// ⚠️ Upar apna InfinityFree domain daalo

// ─── Core Fetch Helpers ───────────────────────────────────────

async function _get(path, params = {}) {
    const url = new URL(BASE_URL + path);
    Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));

    const res = await fetch(url.toString(), {
        method: 'GET',
        credentials: 'include',
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
}

async function _post(path, body = {}) {
    const res = await fetch(BASE_URL + path, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
}

async function _upload(path, formData) {
    const res = await fetch(BASE_URL + path, {
        method: 'POST',
        credentials: 'include',
        body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Upload failed');
    return data;
}

// ─── Auth ─────────────────────────────────────────────────────
const Auth = {
    login:  (username, password) => _post('/login.php',  { username, password }),
    logout: ()                   => _post('/logout.php'),
    me:     ()                   => _get('/me.php'),
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
    fileUrl:  (group, subject, folder, file)   =>
        `${BASE_URL}/resources.php?group=${encodeURIComponent(group)}&subject=${encodeURIComponent(subject)}&folder=${encodeURIComponent(folder)}&file=${encodeURIComponent(file)}`,
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