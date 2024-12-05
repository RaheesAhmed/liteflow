import React, { useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AspectRatio,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
} from "@liteflow/ui";

function App() {
  const [showAlert, setShowAlert] = useState(false);

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">LiteFlow UI Components</h1>

      {/* Alert Component */}
      {showAlert && (
        <Alert variant="default" onClose={() => setShowAlert(false)}>
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            Your action was completed successfully.
          </AlertDescription>
        </Alert>
      )}

      {/* Avatar Component */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Avatar</h2>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>

      {/* Aspect Ratio Component */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Aspect Ratio</h2>
        <div className="w-[450px]">
          <AspectRatio ratio={16 / 9}>
            <img
              src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
              alt="Photo"
              className="rounded-md object-cover w-full h-full"
            />
          </AspectRatio>
        </div>
      </div>

      {/* Alert Dialog Component */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Alert Dialog</h2>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="default">Open Dialog</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader className="space-y-2">
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
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
        Show Alert
      </Button>
    </div>
  );
}

export default App;
