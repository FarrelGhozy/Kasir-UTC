import api from './axiosConfig';

// --- API INVENTORY ---
export const getInventory = async () => {
  try {
    const response = await api.get('/inventory');
    return response.data;
  } catch (error) {
    console.error("Error fetching inventory:", error);
    throw error;
  }
};

// --- API SERVIS ---
export const createServis = async (dataTransaksi) => {
  try {
    const response = await api.post('/servis', dataTransaksi);
    return response.data;
  } catch (error) {
    console.error("Error creating servis:", error);
    throw error;
  }
};

export const getRiwayatServis = async () => {
  try {
    const response = await api.get('/servis');
    return response.data;
  } catch (error) {
    console.error("Error fetching history:", error);
    throw error;
  }
};

export const getLaporanTeknisi = async () => {
  try {
    const response = await api.get('/servis/laporan');
    return response.data;
  } catch (error) {
    console.error("Error fetching report:", error);
    throw error;
  }
};