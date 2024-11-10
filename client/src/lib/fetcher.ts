export class FetchError extends Error {
  info: any;
  status: number;
  constructor(message: string, info: any, status: number) {
    super(message);
    this.info = info;
    this.status = status;
  }
}

// Fetcher function for SWR that includes credentials and handles non-200 responses
export const fetcher = async (url: string) => {
  // Use the current origin in production, and port 3001 in development
  const baseUrl = process.env.NODE_ENV === 'development'
    ? `${window.location.protocol}//${window.location.hostname}:3001`
    : window.location.origin;
    
  const res = await fetch(baseUrl + url, {
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });

  // For non-200 responses
  if (!res.ok) {
    const error = new FetchError(
      'An error occurred while fetching the data.',
      await res.json(),
      res.status
    );
    throw error;
  }

  return res.json();
};
