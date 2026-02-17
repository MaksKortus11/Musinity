const USERS_KEY = "musinity_users";
const SESSION_KEY = "musinity_session";

export type UserData = {
  username: string;
  mainGenres: string[];
  favoriteArtists?: {
    id: string;
    name: string;
    country?: string;
  }[];
};




// ===== USERS =====

export function getUsers(): User[] {
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// ===== REGISTER =====

export function registerUser(user: User): { ok: boolean; message?: string } {
  const users = getUsers();

  const exists = users.some(u => u.username === user.username);
  if (exists) {
    return { ok: false, message: "Użytkownik już istnieje" };
  }

  users.push(user);
  saveUsers(users);

  // auto login po rejestracji
  localStorage.setItem(SESSION_KEY, user.username);

  return { ok: true };
}

// ===== LOGIN =====

export function loginUser(
  username: string,
  password: string
): { ok: boolean; message?: string } {
  const users = getUsers();

  const found = users.find(
    u => u.username === username && u.password === password
  );

  if (!found) {
    return { ok: false, message: "Nieprawidłowe dane" };
  }

  localStorage.setItem(SESSION_KEY, username);
  return { ok: true };
}

// ===== SESSION =====

export function getSessionUser(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
}
