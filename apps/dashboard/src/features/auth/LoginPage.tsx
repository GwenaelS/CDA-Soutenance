/**
 * Page de connexion.
 *
 * Flux OAuth2 Discord :
 * 1. Clic sur le bouton -> redirection navigateur vers `${VITE_API_URL}/auth/discord` (route backend, pas d'appel fetch).
 * 2. Le backend (NestJS, module `auth`) construit l'URL d'autorisation Discord
 *    (https://discord.com/api/oauth2/authorize?client_id=...&redirect_uri=...&response_type=code&scope=identify+guilds)
 *    et redirige l'utilisateur dessus.
 * 3. L'utilisateur valide sur Discord -> Discord redirige vers le callback backend
 *    `${VITE_API_URL}/auth/discord/callback?code=...`.
 * 4. Le backend échange le code contre un token, crée la session (cookie httpOnly)
 *    et redirige vers `${VITE_FRONTEND_URL}/dashboard/:guildId`.
 *
 * Le frontend ne connaît jamais le client_secret ni ne construit l'URL Discord :
 * il se contente d'appeler la route backend qui fait office de point d'entrée.
 */

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

function handleDiscordLogin() {
  window.location.href = `${API_URL}/auth/discord`
}

export function LoginPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-[#0c0020] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <p className="text-xs font-bold text-[#8e7aab] uppercase tracking-wider">
            Wystrelia's Bot / Dashboard
          </p>
          <h1 className="mt-1 text-3xl font-extrabold text-[#cfd9e8]">
            Connexion
          </h1>
          <p className="mt-1 text-xs text-[#8e7aab]">
            Authentifie-toi avec Discord pour accéder à ton serveur
          </p>
        </div>

        <div className="bg-[#140030]/80 border border-border/40 rounded-xl p-6 hover:border-cyan-500/40 transition-all duration-300">
          <div className="flex flex-col items-center text-center gap-4">
            <img
              src="/assets/img/van_blank.png"
              alt="Wystrelia's Bot"
              className="h-16 w-16 rounded-full border border-border/30 bg-[#0c0020]"
            />

            <button
              type="button"
              onClick={handleDiscordLogin}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#5865F2] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#4752c4] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:ring-offset-2 focus:ring-offset-[#140030]"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 127.14 96.36"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
              </svg>
              Se connecter avec Discord
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
