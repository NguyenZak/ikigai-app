import { useState, useEffect, useCallback } from 'react';

interface Author {
  name?: string;
  email: string;
}

interface News {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  featuredImage?: string;
  publishedAt: string;
  createdAt: string;
  author: Author;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface UseNewsOptions {
  page?: number;
  limit?: number;
  autoFetch?: boolean;
}

export function useNews(options: UseNewsOptions = {}) {
  const { page = 1, limit = 6, autoFetch = true } = options;
  
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(page);

  const fetchNews = useCallback(async (pageNum: number = currentPage, limitNum: number = limit) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('useNews - Fetching news with:', { pageNum, limitNum });
      
      const response = await fetch(`/api/news?page=${pageNum}&limit=${limitNum}`);
      
      console.log('useNews - Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch news: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('useNews - Received data:', data);
      
      setNews(data.news);
      setPagination(data.pagination);
      setCurrentPage(pageNum);
    } catch (error) {
      console.error('useNews - Error fetching news:', error);
      setError('Có lỗi xảy ra khi tải tin tức');
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit]);

  const refetch = () => {
    fetchNews(currentPage, limit);
  };

  const setPage = (pageNum: number) => {
    fetchNews(pageNum, limit);
  };

  useEffect(() => {
    if (autoFetch) {
      fetchNews(page, limit);
    }
  }, [autoFetch, fetchNews, limit, page]);

  return {
    news,
    loading,
    error,
    pagination,
    currentPage,
    fetchNews,
    refetch,
    setPage
  };
} 