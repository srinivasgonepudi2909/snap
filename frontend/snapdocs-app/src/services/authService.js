// Add redirect after successful login
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Force redirect to dashboard
      window.location.href = '/dashboard';
      // Or if using React Router: navigate('/dashboard');
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};