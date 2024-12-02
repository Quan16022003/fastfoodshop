export const API_CONFIG = {
    BASE_URL: process.env.REACT_APP_API_URL,
    SOCKET_URL: process.env.REACT_APP_SOCKET_URL,
    FILE_SIZE_LIMIT: parseInt(process.env.REACT_APP_MAX_FILE_SIZE || '5242880'),
    SUPPORTED_FILE_TYPES: process.env.REACT_APP_SUPPORTED_FILE_TYPES?.split(',') || ['image/jpeg', 'image/png']
}; 