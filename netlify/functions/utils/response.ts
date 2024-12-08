import { corsHeaders } from './headers';

export const success = (data: any, statusCode = 200) => ({
  statusCode,
  headers: corsHeaders,
  body: JSON.stringify({
    status: 'success',
    data,
    timestamp: new Date().toISOString()
  })
});

export const error = (message: string, statusCode = 500, errorDetails?: any) => ({
  statusCode,
  headers: corsHeaders,
  body: JSON.stringify({
    status: 'error',
    message,
    error: errorDetails,
    timestamp: new Date().toISOString()
  })
});