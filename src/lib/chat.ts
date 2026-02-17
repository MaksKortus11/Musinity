import { getSessionUser, getUsers } from "./auth";

export function getCurrentUserData() {
  const username = getSessionUser();
  if (!username) return null;

  const users = getUsers();
  return users.find(u => u.username === username) || null;
}

// fake wiadomości na start
export const MOCK_MESSAGES: Record<string, { user: string; text: string }[]> =
  {
    Jazz: [
      { user: "DJMike", text: "Ktoś coś?" },
      { user: "BassHead", text: "Ja o 19" },
    ],
    "R&B": [
      { user: "GuitarFan", text: "Najlepsze wokale 2025?" },
    ],
    Latin: [
      { user: "12345", text: "Nowy album mega catchy!" },
      { user: "BadBunny", text: "Thanks homie!" },
    ],
    "Hip-Hop": [
      { user: "młody_G", text: "[*] Mobbyn"}
    ]
  };
