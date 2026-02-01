// frontend/src/services/assetService.js

import axios from 'axios';

import { API_BASE as API_URL } from '../api/http.js';

export const assetService = {
  // Add Sunsynk as asset to Bertha House
  addSunsynkToBerthaHouse: async (token) => {
    try {
      const response = await axios.post(`${API_URL}/api/assets/sunsynk/add-to-bertha-house`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error adding Sunsynk asset to Bertha House:', error);
      throw error;
    }
  },

  // Get Sunsynk asset data with carbon emissions
  getBerthaHouseSunsynkAsset: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/api/assets/sunsynk/bertha-house-asset`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting Bertha House Sunsynk asset:', error);
      throw error;
    }
  },

  // Get all Bertha House assets including Sunsynk
  getBerthaHouseAssets: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/api/assets/bertha-house`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting Bertha House assets:', error);
      throw error;
    }
  }
};
