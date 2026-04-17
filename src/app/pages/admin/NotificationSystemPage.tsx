import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Checkbox } from '../../components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from '../../components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../../components/ui/table';
import {
  Plus,
  Send,
  Trash2,
  Eye,
  Bell,
  Mail,
  MessageSquare,
  CheckCircle,
  Clock,
  ArrowLeft,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';

interface Notification {
  id: string;
  title: string;
  message: string;
  triggerEvent: string;
  recipientCount: number;
  sentCount: number;
  status: 'draft' | 'scheduled' | 'sent';
  createdAt: string;
  sentAt?: string;
}

interface TriggerEvent {
  event: string;
  description: string;
  icon: any;
  color: string;
}

export function NotificationSystemPage() {
  const navigate = useNavigate();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'NOT001',
      title: 'Application Submitted Successfully',
      message: 'Your application for B.Tech program has been submitted successfully. You can track its status anytime.',
      triggerEvent: 'submission',
      recipientCount: 245,
      sentCount: 245,
      status: 'sent',
      createdAt: '2026-04-10',
      sentAt: '2026-04-10 14:30'
    },
    {
      id: 'NOT002',
      title: 'Payment Confirmation',
      message: 'Payment of ₹2600 received successfully. Your application is now active.',
      triggerEvent: 'payment_success',
      recipientCount: 180,
      sentCount: 180,
      status: 'sent',
      createdAt: '2026-04-12',
      sentAt: '2026-04-12 16:45'
    },
    {
      id: 'NOT003',
      title: 'Application Status Update',
      message: 'Your application is now under review by our admissions team.',
      triggerEvent: 'under_review',
      recipientCount: 200,
      sentCount: 150,
      status: 'scheduled',
      createdAt: '2026-04-15'
    }
  ]);

  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    triggerEvent: 'submission',
    sendImmediately: true
  });

  const triggerEvents: TriggerEvent[] = [
    {
      event: 'submission',
      description: 'When application is submitted',
      icon: CheckCircle,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      event: 'payment_success',
      description: 'When payment is successful',
      icon: Mail,
      color: 'bg-green-100 text-green-800'
    },
    {
      event: 'payment_failure',
      description: 'When payment fails',
      icon: MessageSquare,
      color: 'bg-red-100 text-red-800'
    },
    {
      event: 'under_review',
      description: 'When application is under review',
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-800'
    },
    {
      event: 'approved',
      description: 'When application is approved',
      icon: CheckCircle,
      color: 'bg-green-100 text-green-800'
    },
    {
      event: 'rejected',
      description: 'When application is rejected',
      icon: MessageSquare,
      color: 'bg-red-100 text-red-800'
    },
    {
      event: 'admit_card_release',
      description: 'When admit card is released',
      icon: Bell,
      color: 'bg-purple-100 text-purple-800'
    },
    {
      event: 'result_published',
      description: 'When results are published',
      icon: TrendingUp,
      color: 'bg-indigo-100 text-indigo-800'
    }
  ];

  const handleCreateNotification = () => {
    if (!newNotification.title || !newNotification.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    const notification: Notification = {
      id: `NOT${String(notifications.length + 1).padStart(3, '0')}`,
      title: newNotification.title,
      message: newNotification.message,
      triggerEvent: newNotification.triggerEvent,
      recipientCount: 0,
      sentCount: 0,
      status: newNotification.sendImmediately ? 'sent' : 'draft',
      createdAt: new Date().toISOString().split('T')[0],
      sentAt: newNotification.sendImmediately
        ? new Date().toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit' })
        : undefined
    };

    setNotifications([...notifications, notification]);
    setNewNotification({
      title: '',
      message: '',
      triggerEvent: 'submission',
      sendImmediately: true
    });
    setShowCreateDialog(false);
    toast.success('Notification created and scheduled');
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast.success('Notification deleted');
  };

  const handleSendNow = (id: string) => {
    toast.info('Sending notification to all eligible candidates...');
    setTimeout(() => {
      setNotifications(
        notifications.map(n => 
          n.id === id 
            ? { ...n, status: 'sent', sentAt: new Date().toLocaleString('en-IN') }
            : n
        )
      );
      toast.success('Notification sent to all candidates');
    }, 1500);
  };

  const getEventConfig = (event: string) => {
    return triggerEvents.find(e => e.event === event);
  };

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notification System</h1>
          <p className="text-gray-600 mt-1">Manage and trigger notifications for candidates</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Notification
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Notification</DialogTitle>
              <DialogDescription>
                Set up an automated notification for specific trigger events
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Notification Title</Label>
                <Input
                  id="title"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                  placeholder="e.g., Application Submitted"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                  placeholder="Enter notification message"
                  className="mt-1 min-h-[100px]"
                />
              </div>
              <div>
                <Label>Trigger Event</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-[200px] overflow-y-auto">
                  {triggerEvents.map((te) => (
                    <button
                      key={te.event}
                      onClick={() => setNewNotification({ ...newNotification, triggerEvent: te.event })}
                      className={`p-3 rounded-lg text-left border-2 transition ${
                        newNotification.triggerEvent === te.event
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-medium text-sm">{te.description}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
                <Checkbox
                  id="immediate"
                  checked={newNotification.sendImmediately}
                  onCheckedChange={(checked) =>
                    setNewNotification({ ...newNotification, sendImmediately: !!checked })
                  }
                />
                <Label htmlFor="immediate" className="cursor-pointer">
                  Send immediately to test (will not send to actual candidates)
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateNotification}>Create Notification</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Notifications</p>
                <p className="text-2xl font-bold mt-1">{notifications.length}</p>
              </div>
              <Bell className="w-8 h-8 text-blue-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sent</p>
                <p className="text-2xl font-bold mt-1 text-green-600">
                  {notifications.filter(n => n.status === 'sent').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Scheduled/Draft</p>
                <p className="text-2xl font-bold mt-1 text-yellow-600">
                  {notifications.filter(n => n.status !== 'sent').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>All created notifications and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Trigger Event</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Sent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notifications.map((notif) => {
                  const eventConfig = getEventConfig(notif.triggerEvent);
                  return (
                    <TableRow key={notif.id}>
                      <TableCell className="font-medium max-w-xs">{notif.title}</TableCell>
                      <TableCell>
                        <Badge className={eventConfig?.color || 'bg-gray-100'}>
                          {eventConfig?.description || notif.triggerEvent}
                        </Badge>
                      </TableCell>
                      <TableCell>{notif.recipientCount}</TableCell>
                      <TableCell>{notif.sentCount}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            notif.status === 'sent'
                              ? 'bg-green-100 text-green-800'
                              : notif.status === 'scheduled'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }
                        >
                          {notif.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {notif.createdAt}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toast.info(`Message: "${notif.message}"`)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {notif.status !== 'sent' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSendNow(notif.id)}
                              className="text-blue-600 hover:bg-blue-50"
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteNotification(notif.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Trigger Events Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Available Trigger Events</CardTitle>
          <CardDescription>Events that can automatically trigger notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {triggerEvents.map((event) => (
              <div key={event.event} className={`p-4 rounded-lg border ${event.color}`}>
                <p className="font-medium text-sm">{event.description}</p>
                <p className="text-xs opacity-75 mt-2">Triggered automatically when this event occurs</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notification Channels */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Channels</CardTitle>
          <CardDescription>Methods used to send notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Mail className="w-5 h-5 text-blue-600" />
                <h4 className="font-medium">Email</h4>
              </div>
              <p className="text-sm text-gray-600">Notifications sent to registered email addresses</p>
              <Badge className="mt-3 bg-green-100 text-green-800">Active</Badge>
            </div>
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare className="w-5 h-5 text-green-600" />
                <h4 className="font-medium">SMS</h4>
              </div>
              <p className="text-sm text-gray-600">Text message notifications to phone numbers</p>
              <Badge className="mt-3 bg-green-100 text-green-800">Active</Badge>
            </div>
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Bell className="w-5 h-5 text-purple-600" />
                <h4 className="font-medium">In-App</h4>
              </div>
              <p className="text-sm text-gray-600">Notifications shown in the application dashboard</p>
              <Badge className="mt-3 bg-green-100 text-green-800">Active</Badge>
            </div>
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare className="w-5 h-5 text-orange-600" />
                <h4 className="font-medium">Portal</h4>
              </div>
              <p className="text-sm text-gray-600">Push notifications for web and mobile</p>
              <Badge className="mt-3 bg-gray-100 text-gray-800">Coming Soon</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
