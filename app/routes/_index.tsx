import {LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface LoaderData {
  currentUser: User | null;
  error?: string;
}

export const loader: LoaderFunction = async () => {
  try {
    const response = await fetch('http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/auth/session', {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch current user');
    }

    const data = await response.json();

    return Response.json({
      currentUser: data.currentUser || null,
    });
  } catch (error) {
    return Response.json(
      { currentUser: null, error: 'Error fetching current user' }, 
      { status: 500 }
    );
  }
};


export default function Index() {
  const { currentUser, error } = useLoaderData<LoaderData>();

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Current User</h1>

      {error ? (
        <div style={{ color: 'red', padding: '1rem', border: '1px solid red' }}>
          {error}
        </div>
      ) : currentUser ? (
        <div style={{ padding: '1rem', border: '1px solid #ccc' }}>
          <h2>{currentUser.name}</h2>
          <p>Email: {currentUser.email}</p>
          <p>ID: {currentUser.id}</p>
        </div>
      ) : (
        <p>No user logged in</p>
      )}
    </main>
  );
}