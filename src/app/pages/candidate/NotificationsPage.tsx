import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Bell, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface Notification {
  id: number;
  type: 'info' | 'success' | 'warning' | 'alert';
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export function NotificationsPage() {
  const notifications: Notification[] = [
    {
      id: 1,
      type: 'warning',
      title: 'Complete Your Application',
      message: 'Please complete all sections of your application form to proceed with submission.',
      date: '2 hours ago',
      read: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'Upload Required Documents',
      message: 'You have 4 pending documents to upload. Please upload them before the deadline.',
      date: '1 day ago',
      read: false
    },
    {
      id: 3,
      type: 'info',
      title: 'Application Deadline Reminder',
      message: 'Last date to apply for B.Tech admissions is June 30, 2026.',
      date: '2 days ago',
      read: true
    },
    {
      id: 4,
      type: 'success',
      title: 'OTP Login Successful',
      message: 'You have successfully logged in to the MTU Admission Portal.',
      date: '3 days ago',
      read: true
    },
    {
      id: 5,
      type: 'info',
      title: 'Welcome to MTU Admission Portal',
      message: 'Thank you for registering. Start your B.Tech application journey today!',
      date: '5 days ago',
      read: true
    }
  ];

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getBgColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-l-green-500';
      case 'warning':
        return 'bg-amber-50 border-l-amber-500';
      case 'alert':
        return 'bg-red-50 border-l-red-500';
      default:
        return 'bg-blue-50 border-l-blue-500';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
        <p className="text-gray-600">Stay updated with important messages and alerts</p>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Bell className="w-4 h-4" />
        <span>{notifications.filter(n => !n.read).length} unread notifications</span>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            className={`border-l-4 ${getBgColor(notification.type)} ${
              !notification.read ? 'shadow-md' : ''
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {getIcon(notification.type)}
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">{notification.title}</CardTitle>
                      {!notification.read && (
                        <Badge className="bg-blue-600 text-white text-xs">New</Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{notification.date}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">{notification.message}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
