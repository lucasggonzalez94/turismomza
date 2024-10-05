'use server';

import axiosInstance from '@/config/axiosInstance';

export const getAttractions = async (): Promise<any> => {
  // eslint-disable-next-line no-constant-condition
  if (true) {
    const response = await axiosInstance.get('/attractions');

    return response?.data;
  } else {
    return new Promise((res, rej) => {
      const response = require('../../mocks/listAttractions.json');
      if (response < 0) {
        rej(null);
      }
      res(response);
    });
  }
};
