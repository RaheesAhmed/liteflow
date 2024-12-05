import { useState } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import * as AspectRatio from "@radix-ui/react-aspect-ratio";
import * as Avatar from "@radix-ui/react-avatar";
import { Button } from "./components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";

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
        <Avatar.Root>
          <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
          <Avatar.Fallback>CN</Avatar.Fallback>
        </Avatar.Root>
      </div>

      {/* Aspect Ratio Component */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Aspect Ratio</h2>
        <div className="w-[450px]">
          <AspectRatio.Root ratio={16 / 9}>
            <img
              src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
              alt="Photo"
              className="rounded-md object-cover w-full h-full"
            />
          </AspectRatio.Root>
        </div>
      </div>

      {/* Alert Dialog Component */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Alert Dialog</h2>
        <AlertDialog.Root>
          <AlertDialog.Trigger asChild>
            <Button variant="default">Open Dialog</Button>
          </AlertDialog.Trigger>
          <AlertDialog.Portal>
            <AlertDialog.Content>
              <AlertDialog.Header className="space-y-2">
                <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
                <AlertDialog.Description>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialog.Description>
              </AlertDialog.Header>
              <AlertDialog.Footer>
                <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
                <AlertDialog.Action>Continue</AlertDialog.Action>
              </AlertDialog.Footer>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
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
