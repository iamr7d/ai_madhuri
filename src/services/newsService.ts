import axios from 'axios';

const API_TOKEN = 'nBS5ztfW6bsy7ajEFS37izXuy36uZWOTDoGjXnGo';
const BASE_URL = 'https://api.thenewsapi.com/v1/news';

export interface NewsArticle {
  uuid: string;
  title: string;
  description: string;
  keywords: string;
  snippet: string;
  url: string;
  image_url: string;
  language: string;
  published_at: string;
  source: string;
  categories: string[];
  locale: string;
  similar?: NewsArticle[];
}

export interface NewsResponse {
  meta?: {
    found: number;
    returned: number;
    limit: number;
    page: number;
  };
  data: NewsArticle[];
}

export const fetchNews = async (params: {
  locale?: string;
  language?: string;
  categories?: string;
  limit?: number;
  search?: string;
}): Promise<NewsResponse> => {
  try {
    const { data } = await axios.get(`${BASE_URL}/all`, {
      params: {
        api_token: API_TOKEN,
        locale: params.locale || 'us',
        language: params.language || 'en',
        categories: params.categories,
        limit: params.limit || 5,
        search: params.search
      }
    });
    return data;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

export const searchNews = async (query: string): Promise<NewsResponse> => {
  try {
    const { data } = await axios.get(`${BASE_URL}/all`, {
      params: {
        api_token: API_TOKEN,
        search: query,
        language: 'en',
        limit: 5
      }
    });
    return data;
  } catch (error) {
    console.error('Error searching news:', error);
    throw error;
  }
};
