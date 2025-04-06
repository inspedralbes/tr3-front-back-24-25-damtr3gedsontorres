/**
 * Interceptor para peticiones HTTP
 * Añade automáticamente el token de autenticación a todas las peticiones
 */

// Clave para almacenar el token en localStorage
const TOKEN_KEY = 'auth_token';

/**
 * Intercepta una petición fetch y añade el token de autenticación si existe
 * @param {string} url - URL de la petición
 * @param {Object} options - Opciones de fetch
 * @returns {Promise} - Promesa con la respuesta de fetch
 */
export const fetchWithAuth = async (url, options = {}) => {
  // Obtener el token del localStorage
  const token = localStorage.getItem(TOKEN_KEY);
  
  // Preparar los headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  // Añadir el token si existe
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Realizar la petición con los headers actualizados
  const response = await fetch(url, {
    ...options,
    headers
  });
  
  // Si la respuesta es 401 (Unauthorized), limpiar el token y redirigir al login
  if (response.status === 401) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('user_data');
    
    // Si estamos en el navegador, redirigir al login
    // Solo si no estamos ya en la página de login para evitar redirecciones en bucle
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
  }
  
  return response;
};

export default {
  fetchWithAuth
};
