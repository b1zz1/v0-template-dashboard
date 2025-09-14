import RebelManager from "@/components/admin/rebel-manager"
import DashboardPageLayout from "@/components/dashboard/layout"
import { Settings } from "lucide-react"

export default function AdminPage() {
  return (
    <DashboardPageLayout
      header={{
        title: "Admin Panel",
        description: "Manage dashboard data and settings",
        icon: Settings,
      }}
    >
      <div className="space-y-8">
        <RebelManager />
      </div>
    </DashboardPageLayout>
  )
}
