const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getHeaders = (token) => ({
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

const handleResponse = async (res) => {
    const contentType = res.headers.get("content-type");
    let data;
    if (contentType && contentType.includes("application/json")) {
        data = await res.json();
    } else {
        const text = await res.text();
        throw new Error(text || "Server returned an unexpected response.");
    }
    if (!res.ok) throw new Error(data.message || "Something went wrong");
    return data;
};

// ── Auth ──────────────────────────────────────────────────
export const registerUser = async ({ name, email, password, role }) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ name, email, password, role }),
    });
    return handleResponse(res);
};

export const loginUser = async ({ email, password }) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
};

// ── Job Seeker Profile ────────────────────────────────────
export const getProfile = async (token) => {
    const res = await fetch(`${BASE_URL}/profile`, {
        headers: getHeaders(token),
    });
    return handleResponse(res);
};

export const saveProfile = async (token, profileData) => {
    const res = await fetch(`${BASE_URL}/profile`, {
        method: "PUT",
        headers: getHeaders(token),
        body: JSON.stringify(profileData),
    });
    return handleResponse(res);
};

export const uploadResume = async (token, file) => {
    const form = new FormData();
    form.append("resume", file);
    const res = await fetch(`${BASE_URL}/profile/resume`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
    });
    return handleResponse(res);
};

// ── Jobs ──────────────────────────────────────────────────
export const getJobs = async (token, params = {}) => {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${BASE_URL}/jobs?${qs}`, {
        headers: getHeaders(token),
    });
    return handleResponse(res);
};

export const getJobById = async (token, id) => {
    const res = await fetch(`${BASE_URL}/jobs/${id}`, {
        headers: getHeaders(token),
    });
    return handleResponse(res);
};

export const applyToJob = async (token, jobId) => {
    const res = await fetch(`${BASE_URL}/jobs/${jobId}/apply`, {
        method: "POST",
        headers: getHeaders(token),
    });
    return handleResponse(res);
};

// ── Employer ──────────────────────────────────────────────
export const getEmployerProfile = async (token) => {
    const res = await fetch(`${BASE_URL}/employer/profile`, {
        headers: getHeaders(token),
    });
    return handleResponse(res);
};

export const saveEmployerProfile = async (token, data) => {
    const res = await fetch(`${BASE_URL}/employer/profile`, {
        method: "PUT",
        headers: getHeaders(token),
        body: JSON.stringify(data),
    });
    return handleResponse(res);
};

export const postJob = async (token, jobData) => {
    const res = await fetch(`${BASE_URL}/jobs`, {
        method: "POST",
        headers: getHeaders(token),
        body: JSON.stringify(jobData),
    });
    return handleResponse(res);
};

export const getPostedJobs = async (token) => {
    const res = await fetch(`${BASE_URL}/employer/jobs`, {
        headers: getHeaders(token),
    });
    return handleResponse(res);
};

export const getApplicants = async (token, jobId) => {
    const res = await fetch(`${BASE_URL}/employer/jobs/${jobId}/applicants`, {
        headers: getHeaders(token),
    });
    return handleResponse(res);
};

export const getCandidateProfile = async (token, candidateId) => {
    const res = await fetch(`${BASE_URL}/employer/candidates/${candidateId}`, {
        headers: getHeaders(token),
    });
    return handleResponse(res);
};

// ── AI Interview & Learning Path ──────────────────────────
export const startInterview = async (token) => {
    const res = await fetch(`${BASE_URL}/interview/start`, {
        method: "POST",
        headers: getHeaders(token),
    });
    return handleResponse(res);
};

export const sendInterviewMessage = async (token, sessionId, message) => {
    const res = await fetch(`${BASE_URL}/interview/message`, {
        method: "POST",
        headers: getHeaders(token),
        body: JSON.stringify({ sessionId, message }),
    });
    return handleResponse(res);
};

export const finishInterview = async (token, sessionId) => {
    const res = await fetch(`${BASE_URL}/interview/finish`, {
        method: "POST",
        headers: getHeaders(token),
        body: JSON.stringify({ sessionId }),
    });
    return handleResponse(res);
};

export const getLearningPath = async (token) => {
    const res = await fetch(`${BASE_URL}/learning-path`, {
        headers: getHeaders(token),
    });
    return handleResponse(res);
};

// ── Notifications ─────────────────────────────────────────
export const getNotifications = async (token) => {
    const res = await fetch(`${BASE_URL}/notifications`, {
        headers: getHeaders(token),
    });
    return handleResponse(res);
};

export const markNotificationRead = async (token, id) => {
    const res = await fetch(`${BASE_URL}/notifications/${id}/read`, {
        method: "PUT",
        headers: getHeaders(token),
    });
    return handleResponse(res);
};

export const sendNotification = async (token, recipientId, title, message) => {
    const res = await fetch(`${BASE_URL}/notifications/send`, {
        method: "POST",
        headers: getHeaders(token),
        body: JSON.stringify({ recipientId, title, message }),
    });
    return handleResponse(res);
};

// ── Part-Time Jobs ────────────────────────────────────────
export const applyPartTime = async (token, applicationData) => {
    const res = await fetch(`${BASE_URL}/part-time/apply`, {
        method: "POST",
        headers: getHeaders(token),
        body: JSON.stringify(applicationData),
    });
    return handleResponse(res);
};

export const getPartTimeApplicants = async (token) => {
    const res = await fetch(`${BASE_URL}/employer/part-time-applicants`, {
        headers: getHeaders(token),
    });
    return handleResponse(res);
};

export const updatePartTimeApplicantStatus = async (token, applicationId, status) => {
    const res = await fetch(`${BASE_URL}/employer/part-time-applicants/${applicationId}/status`, {
        method: "PUT",
        headers: getHeaders(token),
        body: JSON.stringify({ status }),
    });
    return handleResponse(res);
};
