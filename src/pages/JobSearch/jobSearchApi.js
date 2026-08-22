import axios from 'axios';
import { API_BASE_URL } from '../../config';

const API_URL = API_BASE_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Ensures cookies/sessions are sent
});

export const matchResume = async (file, params = {}) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post('/api/search/job_search/match', formData, {
      params,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
    }
    throw error;
  }
};

export const listAllJobs = async (skip = 0, limit = 50, filters = {}) => {
  try {
    const params = { skip, limit };
    if (filters.role) params.role = filters.role;
    if (filters.location) params.location = filters.location;
    if (filters.experience !== undefined && filters.experience !== '') params.experience = filters.experience;
    const response = await api.get('/api/search/job_search/', { params });
    const { items = [], total = 0 } = response.data;
    return { items, total };
  } catch (error) {
    throw error;
  }
};

export const getJobDetail = async (jobId) => {
  try {
    const response = await api.get(`/api/search/job_search/${jobId}`);
    return response.data;
  } catch (error) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw error;
  }
};

// Resume Editor APIs
export const uploadResumeForEdit = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post('/api/search/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw error;
  }
};

export const convertPdfToDocx = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post('/api/search/resume/convert/pdf-to-docx', formData, {
      responseType: 'blob',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const saveEditedDocx = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post('/api/search/resume/docx/save', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw error;
  }
};

export const getResumeDocx = async () => {
  try {
    const response = await api.get('/api/search/resume/docx', {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const searchJobsAfterEdit = async (params = {}) => {
  try {
    const response = await api.post('/api/search/resume/search', null, { params });
    return response.data;
  } catch (error) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw error;
  }
};

export const rescoreResume = async (plainText) => {
  try {
    const response = await api.post('/api/search/resume/re-score', { plain_text: plainText });
    return response.data;
  } catch (error) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw error;
  }
};
