import axios, { AxiosError } from 'axios';

const BASE_URL = process.env.API_URL ?
  process.env.API_URL :
  'http://localhost:8080';

const TIMEOUT = process.env.API_TIMEOUT ?
  parseInt(process.env.API_TIMEOUT) : 10000;

export const httpService = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    common: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  },
});

export async function POST(url: string, object: {}, headers = {}) {
  if (Object.keys(headers).length === 0) {
    headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  try {
    const response = await httpService.post(url, object, { headers: headers })
    return response;
  } catch (error: any) {
    if (error instanceof axios.AxiosError) {
      return error.response;
    }
    return { status: 500, data: error.message };
  };

}

export async function GET(url: string, headers = {}) {
  if (Object.keys(headers).length === 0) {
    headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  try {
    const response = await httpService.get(url, { headers: headers })
    return response;
  } catch (error: any) {
    if (error instanceof axios.AxiosError) {
      return error.response;
    }
    return { status: 500, data: error.message };
  };

}