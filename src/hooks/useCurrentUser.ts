import { useEffect, useState } from 'react';

export interface User {
  name: string;
  avatarUrl: string;
}

export const useCurrentUser = (): User | null => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch('/api/user')
      .then((r) => r.json())
      .then((u: User) => {
        setUser(u);
        localStorage.setItem('user', u.name);
      })
      .catch(() => setUser(null));
  }, []);

  return user;
};
