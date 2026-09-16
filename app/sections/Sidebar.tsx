'use client'

import { Shield, Target, BarChart2, FileText, Bell, RefreshCw, LogOut, User } from 'lucide-react'
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
  { id: 'risk-overview', label: 'Risk Overview', icon: <Shield className="w-4 h-4 text-sidebar-foreground/70" /> },
  { id: 'account-drilldown', label: 'Account Drilldown', icon: <Target className="w-4 h-4 text-sidebar-foreground/70" /> },
  { id: 'simulation', label: 'Simulation', icon: <BarChart2 className="w-4 h-4 text-sidebar-foreground/70" /> },
  { id: 'executive-summary', label: 'Executive Summary', icon: <FileText className="w-4 h-4 text-sidebar-foreground/70" /> },
  { id: 'alerts', label: 'Alerts & Timeline', icon: <Bell className="w-4 h-4 text-sidebar-foreground/70" /> },
  { id: 'feedback', label: 'Feedback & Learning', icon: <RefreshCw className="w-4 h-4 text-sidebar-foreground/70" /> },
]

export default function Sidebar({ activeScreen, onNavigate, userName, onLogout }: SidebarProps) {
  return (
    <div className="w-64 h-screen bg-[hsl(30,8%,4%)] flex flex-col font-sans border-r border-[hsl(30,4%,14%)]">
      <div className="p-6 border-b border-[hsl(30,4%,14%)]">
        <h1 className="text-lg font-serif tracking-wider font-light text-[hsl(30,8%,90%)]">Omnisight</h1>
        <p className="text-xs text-[hsl(30,8%,55%)] mt-1 tracking-wide">Enterprise Intelligence</p>
      </div>
      <ScrollArea className="flex-1 py-4">
        <nav className="px-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-none transition-all duration-200 ${activeScreen === item.id ? 'bg-[hsl(30,6%,12%)] text-[hsl(40,50%,55%)] font-medium border-l-2 border-[hsl(40,50%,55%)]' : 'text-[hsl(30,8%,75%)] hover:text-[hsl(30,8%,90%)] hover:bg-[hsl(30,6%,10%)]'}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </ScrollArea>
      <Separator className="bg-[hsl(30,4%,14%)]" />
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-2 px-3 py-2 text-sm text-[hsl(30,8%,55%)]">
          <User className="w-4 h-4" />
          <span className="truncate">{userName ?? 'User'}</span>
        </div>
        <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-[hsl(30,8%,55%)] hover:text-[hsl(30,8%,90%)] hover:bg-[hsl(30,6%,10%)] rounded-none" onClick={onLogout}>
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </Button>
      </div>
    </div>
  )
}
