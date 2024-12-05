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
      <h1 className="text-2xl font-bold mb-4">Welcome to LiteFlow!</h1>

      {/* Alert Component */}
      {showAlert && (
        <Alert variant="default" onClose={() => setShowAlert(false)}>
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            Your LiteFlow app is running successfully.
          </AlertDescription>
        </Alert>
      )}

      {/* Avatar Component */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Avatar Component</h2>
        <Avatar>
          <AvatarImage src="https://github.com/liteflow.png" alt="@liteflow" />
          <AvatarFallback>LF</AvatarFallback>
        </Avatar>
      </div>

      {/* Aspect Ratio Component */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Aspect Ratio Component</h2>
        <div className="w-[450px]">
          <AspectRatio ratio={16 / 9}>
            <img
              src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
              alt="Landscape"
              className="rounded-md object-cover w-full h-full"
            />
          </AspectRatio>
        </div>
      </div>

      {/* Alert Dialog Component */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Alert Dialog Component</h2>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="default">Open Dialog</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Welcome to LiteFlow</AlertDialogTitle>
              <AlertDialogDescription>
                LiteFlow is a modern web framework designed for building fast,
                scalable, and beautiful web applications. Start building your
                next great idea with LiteFlow!
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
              <AlertDialogAction>Get Started</AlertDialogAction>
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

      {/* Documentation Link */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Edit <code className="font-mono bg-gray-100 p-1">src/App.tsx</code>{" "}
          and save to test HMR updates.
        </p>
        <a
          href="https://docs.liteflow.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-600 mt-2 inline-block"
        >
          Learn LiteFlow
        </a>
      </div>
    </div>
  );
}

export default App;
