# Environment Configuration

This project uses Vite's environment variable system for configuration management.

## Environment Files

- **`.env.development`** - Used in development mode (`npm run dev`)
- **`.env.production`** - Used in production build (`npm run build`)
- **`.env.example`** - Template file showing all available variables

## Available Environment Variables

All environment variables must be prefixed with `VITE_` to be accessible in the browser.

### Backend Configuration

- `VITE_BACKEND` - Enable/disable backend mode (`true`/`false`)
- `VITE_API_HOST` - API host URL
- `VITE_API_PORT` - API port number
- `VITE_API_BASE_URL` - Complete API base URL

### App Configuration

- `VITE_APP_NAME` - Application name
- `VITE_APP_VERSION` - Application version
- `VITE_APP_URL` - Application URL for redirects

### Authentication

- `VITE_AUTH_EMAIL` - Default authentication email
- `VITE_AUTH_PASSWORD` - Default authentication password

### Debug Settings

- `VITE_DEBUG` - Enable debug logging (`true`/`false`)
- `VITE_CONSOLE_LOGS` - Enable console logging (`true`/`false`)

### Build Settings

- `VITE_SOURCE_MAP` - Enable source maps (`true`/`false`)

## Usage

1. **Development**: Environment variables from `.env.development` are automatically loaded
2. **Production**: Environment variables from `.env.production` are automatically loaded
3. **Local Override**: Create `.env.local` for local-only overrides (gitignored)

## Security Notes

- Never commit sensitive data like API keys or passwords to the repository
- Use `.env.local` for sensitive environment-specific values
- All `VITE_` prefixed variables are exposed to the client-side code

## Example

```javascript
// Accessing environment variables in your code
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const isBackend = import.meta.env.VITE_BACKEND === 'true';
const appName = import.meta.env.VITE_APP_NAME;
```
