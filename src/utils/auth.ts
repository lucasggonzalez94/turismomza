import { cookies } from 'next/headers';

export async function getUserSession() {
  const cookieStore = cookies();
  const token = cookieStore.get('authToken')?.value;

  if (!token) return null;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-session`,
    {
      method: 'GET',
      headers: { Cookie: `authToken=${token}` },
      credentials: 'include',
    },
  );

  if (response?.status !== 200) return null;

  return await response.json();
}
