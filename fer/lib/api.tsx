export async function loginUser(email: string, password: string) {
    try {
      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error en login');
      }
  
      return await res.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  