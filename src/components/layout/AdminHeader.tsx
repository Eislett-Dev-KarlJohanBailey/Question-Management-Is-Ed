
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

interface AdminHeaderProps {
  onMenuClick: () => void
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  return (
    <header className="border-b bg-card">
      <div className="flex h-16 items-center px-4 gap-4">
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden">
          <Menu className="h-6 w-6" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        </div>
      </div>
    </header>
  )
}
