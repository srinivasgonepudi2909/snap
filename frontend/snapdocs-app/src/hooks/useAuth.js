// Ensure login function redirects
const useAuth = () => {
  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      // Add redirect here if not in authService
      window.location.href = '/dashboard';
      return data;
    } catch (error) {
      throw error;
    }
  };
};