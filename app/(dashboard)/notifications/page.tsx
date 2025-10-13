import NotificationList from "@/app/components/Notification/NotificationList";
import NotificationMarkAsRead from "@/app/components/Notification/NotificationMarkAsRead";
export default function NotificationsPage() {

  return (
    <div className="max-w-full  mx-auto p-4">
      <div className="flex justify-between items-center mb-4 bg-white rounded-2xl px-5 py-3">
        <h2 className="text-xl font-semibold">Notifications</h2>
        <NotificationMarkAsRead/>
      </div>

     <NotificationList />
    </div>
  );
}
