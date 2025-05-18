
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  GraduationCap,
  Layers,
  Globe,
  Building,
  BookText
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface AdminSidebarProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function AdminSidebar({ isOpen, onOpenChange }: AdminSidebarProps) {
  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin"
    },
    {
      title: "Subjects",
      icon: BookOpen,
      href: "/admin/subjects"
    },
    {
      title: "Courses",
      icon: BookText,
      href: "/admin/courses"
    },
    {
      title: "Topics",
      icon: Layers,
      href: "/admin/topics"
    },
    {
      title: "Countries",
      icon: Globe,
      href: "/admin/countries"
    },
    {
      title: "Schools",
      icon: Building,
      href: "/admin/schools"
    },
    {
      title: "Users",
      icon: Users,
      href: "/admin/users"
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/admin/settings"
    }
  ]

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden",
          isOpen ? "block" : "hidden"
        )}
        onClick={() => onOpenChange(false)}
      />
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-card border-r transition-transform duration-300 lg:transform-none",
          !isOpen && "lg:w-20",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <h2 className={cn("font-semibold", !isOpen && "lg:hidden")}>Admin Panel</h2>
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex"
            onClick={() => onOpenChange(!isOpen)}
          >
            {isOpen ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
        <nav className="flex-1 space-y-1 p-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                !isOpen && "lg:justify-center"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className={cn("text-sm font-medium", !isOpen && "lg:hidden")}>
                {item.title}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}
