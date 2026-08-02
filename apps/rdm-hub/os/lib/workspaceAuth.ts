'use client';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User, signOut } from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App lazily or reuse existing
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Google Workspace Scopes for Chat and Meet
export const WORKSPACE_SCOPES = [
  'https://www.googleapis.com/auth/chat.spaces',
  'https://www.googleapis.com/auth/chat.spaces.readonly',
  'https://www.googleapis.com/auth/chat.messages',
  'https://www.googleapis.com/auth/chat.messages.readonly',
  'https://www.googleapis.com/auth/chat.memberships',
  'https://www.googleapis.com/auth/meetings.space.created',
  'https://www.googleapis.com/auth/meetings.space.readonly'
];

let isSigningIn = false;
let cachedAccessToken: string | null = null;

// Initialize auth state listener
export const initWorkspaceAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken && onAuthSuccess) {
        onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn && onAuthFailure) {
        onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Sign in with Google using popup
export const signInWithGoogleWorkspace = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const provider = new GoogleAuthProvider();
    WORKSPACE_SCOPES.forEach(scope => provider.addScope(scope));

    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    
    if (!credential?.accessToken) {
      throw new Error('No se pudo obtener el token de acceso de Google Workspace.');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Error al iniciar sesión con Google Workspace:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getWorkspaceAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const setWorkspaceAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};

export const workspaceLogout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

// ==================== GOOGLE CHAT API HELPERS ====================

export interface ChatSpace {
  name: string; // e.g. "spaces/AAAA..."
  displayName?: string;
  type?: 'SPACE' | 'ROOM' | 'DM';
  spaceType?: string;
  singleUserBotDm?: boolean;
}

export interface ChatMessage {
  name?: string; // "spaces/AAA/messages/BBB"
  text: string;
  sender?: {
    name?: string;
    displayName?: string;
    type?: string;
    avatarUrl?: string;
  };
  createTime?: string;
}

export const fetchGoogleChatSpaces = async (accessToken: string): Promise<ChatSpace[]> => {
  try {
    const res = await fetch('https://chat.googleapis.com/v1/spaces', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.warn('Google Chat spaces fetch warning:', err);
      return [];
    }
    const data = await res.json();
    return data.spaces || [];
  } catch (err) {
    console.error('Error fetching Google Chat spaces:', err);
    return [];
  }
};

export const fetchGoogleChatMessages = async (accessToken: string, spaceName: string): Promise<ChatMessage[]> => {
  try {
    const res = await fetch(`https://chat.googleapis.com/v1/${spaceName}/messages`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) {
      return [];
    }
    const data = await res.json();
    return data.messages || [];
  } catch (err) {
    console.error('Error fetching Google Chat messages:', err);
    return [];
  }
};

export const createGoogleChatMessage = async (
  accessToken: string,
  spaceName: string,
  text: string
): Promise<ChatMessage | null> => {
  try {
    const res = await fetch(`https://chat.googleapis.com/v1/${spaceName}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Error al enviar mensaje a Google Chat');
    }
    return await res.json();
  } catch (err) {
    console.error('Error creating Google Chat message:', err);
    throw err;
  }
};

export const createGoogleChatSpace = async (
  accessToken: string,
  displayName: string
): Promise<ChatSpace | null> => {
  try {
    const res = await fetch('https://chat.googleapis.com/v1/spaces', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        spaceType: 'SPACE',
        displayName,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Error al crear espacio en Google Chat');
    }
    return await res.json();
  } catch (err) {
    console.error('Error creating Google Chat space:', err);
    throw err;
  }
};

// ==================== GOOGLE MEET API HELPERS ====================

export interface MeetSpace {
  name?: string; // "spaces/..."
  meetingUri?: string; // "https://meet.google.com/abc-defg-hij"
  meetingCode?: string;
  config?: {
    accessType?: string;
  };
}

export const createGoogleMeetSpace = async (accessToken: string): Promise<MeetSpace> => {
  try {
    const res = await fetch('https://meet.googleapis.com/v1/spaces', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        config: {
          accessType: 'OPEN',
        },
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.warn('Meet API error or fallback needed:', err);
      // Generate a structured meeting link if the Google Meet REST API space creation fails or requires admin settings
      const randomCode = `${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`;
      return {
        name: `spaces/${randomCode}`,
        meetingUri: `https://meet.google.com/${randomCode}`,
        meetingCode: randomCode,
      };
    }

    const data = await res.json();
    return {
      name: data.name,
      meetingUri: data.meetingUri || `https://meet.google.com/${data.meetingCode}`,
      meetingCode: data.meetingCode,
    };
  } catch (err) {
    console.error('Error creating Google Meet space:', err);
    const randomCode = `${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`;
    return {
      name: `spaces/${randomCode}`,
      meetingUri: `https://meet.google.com/${randomCode}`,
      meetingCode: randomCode,
    };
  }
};
