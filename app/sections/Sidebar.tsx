'use client'

import { FiShield, FiTarget, FiBarChart2, FiFileText, FiBell, FiRefreshCw, FiLogOut, FiUser } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

export type ScreenId = 'risk-overview' | 'account-drilldown' | 'simulation' | 'executive-summary' | 'alerts' | 'feedback'

interface SidebarProps {
  activeScreen: ScreenId
  onNavigate: (screen: ScreenId) => void
  userName?: string
  onLogout: () => void
}

const NAV_ITEMS: { id: ScreenId; label: string; icon: React.ReactNode }[] = [
  { id: 'risk-overview', label: 'Risk Overview', icon: <FiShield className="w-4 h-4" /> },
  { id: 'account-drilldown', label: 'Account Drilldown', icon: <FiTarget className="w-4 h-4" /> },
  { id: 'simulation', label: 'Simulation', icon: <FiBarChart2 className="w-4 h-4" /> },
  { id: 'executive-summary', label: 'Executive Summary', icon: <FiFileText className="w-4 h-4" /> },
  { id: 'alerts', label: 'Alerts & Timeline', icon: <FiBell className="w-4 h-4" /> },
  { id: 'feedback', label: 'Feedback & Learning', icon: <FiRefreshCw className="w-4 h-4" /> },
]

export default function Sidebar({ activeScreen, onNavigate, userName, onLogout }: SidebarProps) {
  return (
    <div className="w-64 h-screen border-r border-border bg-card flex flex-col font-serif">
      <div className="p-6 border-b border-border">
        <h1 className="text-lg font-medium tracking-widest text-foreground uppercase">Omnisight</h1>
        <p className="text-xs tracking-wider text-muted-foreground mt-1">Enterprise Intelligence</p>
      </div>
      <ScrollArea className="flex-1 py-4">
        <nav className="px-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm tracking-wide transition-all duration-200 ${activeScreen === item.id ? 'bg-primary/10 text-primary border-l-2 border-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 border-l-2 border-transparent'}`}
            >
              {item.icon}
              <span className="font-light">{item.label}</span>
            </button>
          ))}
        </nav>
      </ScrollArea>
      <Separator />
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
          <FiUser className="w-4 h-4" />
          <span className="font-light truncate">{userName ?? 'User'}</span>
        </div>
        <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground" onClick={onLogout}>
          <FiLogOut className="w-4 h-4" />
          <span className="font-light tracking-wide">Sign Out</span>
        </Button>
      </div>
    </div>
  )
}
