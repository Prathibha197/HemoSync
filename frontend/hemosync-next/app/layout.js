import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { SocketProvider } from '@/context/SocketContext'

export const metadata = {
  title: 'HemoSync — Blood Donation & Emergency Donor Network',
  description: 'Real-time blood donation network connecting donors, hospitals, and blood banks across India.',
  themeColor: '#0a0a0b',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-bg text-ink font-sans antialiased min-h-screen">
        <AuthProvider>
          <SocketProvider>
            {children}
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
