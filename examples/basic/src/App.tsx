import { useState } from "react";
import {
  Alert,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Calendar,
  Button,
} from "@liteflow/ui";

export default function DemoPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showAlert, setShowAlert] = useState(false);

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold mb-8">LiteFlow UI Demo</h1>

      {/* Alert Demo */}
      {showAlert && (
        <Alert variant="info" onClose={() => setShowAlert(false)}>
          <p>Welcome to the LiteFlow UI demo! Explore our components below.</p>
        </Alert>
      )}

      {/* User Profile Section */}
      <div className="flex items-center gap-4 p-4 border rounded-lg">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="User" />
          <AvatarFallback>UN</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold">John Doe</h2>
          <p className="text-gray-600">Product Designer</p>
        </div>
      </div>

      {/* Calendar Section */}
      <div className="border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Calendar</h2>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          classNames={{
            day_selected: "bg-primary text-primary-foreground",
            day_today: "bg-accent text-accent-foreground",
            day: "p-3 text-center text-sm leading-none",
          }}
        />
      </div>

      {/* Dialog Demo */}
      <div className="border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Dialog Demo</h2>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="default">Open Dialog</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader className="space-y-2">
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="space-x-2">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Show Alert Button */}
      <Button
        variant="outline"
        onClick={() => setShowAlert(true)}
        className="mt-4"
      >
        Show Welcome Alert
      </Button>
    </div>
  );
}
