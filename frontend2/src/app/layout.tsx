import { Providers } from './providers'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white min-h-screen">
        <Providers>
          <div className="flex min-h-screen">
            {/* Sidebar */}
            <div className="w-64 bg-gray-800 border-r border-gray-700">
              <div className="p-4">
                <h1 className="text-xl font-bold mb-8">Sonic Dream AI</h1>
                <nav className="space-y-2">
                  <NavLink href="/" icon="🏠">Dashboard</NavLink>
                  <NavLink href="/workflows" icon="⚡">Workflows</NavLink>
                  <NavLink href="/monitor" icon="📊">AI Monitor</NavLink>
                  <NavLink href="/settings" icon="⚙️">Settings</NavLink>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}

function NavLink({ href, icon, children }: { href: string; icon: string; children: React.ReactNode }) {
  return (
    <a 
      href={href}
      className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-700/50 transition-colors"
    >
      <span>{icon}</span>
      <span>{children}</span>
    </a>
  )
}
