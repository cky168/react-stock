import axios from 'axios';

export default {
    getAll: async () => {
      let res = await axios.get(`/api/getall`);
      return res.data || [];
    }
  }