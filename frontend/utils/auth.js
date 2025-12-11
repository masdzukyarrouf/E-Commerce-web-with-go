export async function getServerUser() {
  const { headers } = await import('next/headers');
  const headersList = await headers();
  
  const userId = headersList.get('x-user-id');
  const userRole = headersList.get('x-user-role');
  const userEmail = headersList.get('x-user-email');
  
  if (!userId) return null;
  
  return {
    id: userId,
    email: userEmail,
    role: userRole || 'user',
  };
}

export function getClientUser() {
  if (typeof window === 'undefined') return null;
  
  const userDataCookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('user_data='))
    ?.split('=')[1];
  
  if (userDataCookie) {
    try {
      return JSON.parse(decodeURIComponent(userDataCookie));
    } catch {
    }
  }
  
  const userCookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('user='))
    ?.split('=')[1];
    
  if (userCookie) {
    try {
      return JSON.parse(decodeURIComponent(userCookie));
    } catch {
      return null;
    }
  }
  
  return null;
}

export async function getCurrentUser() {
  if (typeof window === 'undefined') {
    return await getServerUser();
  } else {
    return getClientUser();
  }
}

export function isAdmin() {
  if (typeof window === 'undefined') {
    return false;
  }
  
  const user = getClientUser();
  return user?.role === 'admin';
}