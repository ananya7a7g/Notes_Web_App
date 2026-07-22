export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

export const PERMISSIONS = {
  READ: 'read',
  WRITE: 'write',
};

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 50;

export const API_VERSION = 'v1';

export const ABOUT_INFO = {
  name: 'Notes App',
  email: 'support@example.com',
  'my features': {
    'Visual Rich-Text Editing':
      'Format notes instantly with bold, italics, checklists, and code styling using built-in editor controls.',
    'Fast Keyboard Shortcuts':
      'Maximize note productivity using inline key combinations like Ctrl+B (Bold), Ctrl+I (Italic), and Ctrl+Shift+8 (Bulleted List).',
    'Custom Pastel Color Themes':
      'Organize and distinguish notes visually on the dashboard using a palette of custom color themes.',
    'Version History & Snapshot Restores':
      'Track modifications across saving cycles and restore previous versions of notes easily.',
    'Secure Sharing & Collaboration':
      'Collaborate in real-time by sharing notes securely with other registered users.',
  },
};
