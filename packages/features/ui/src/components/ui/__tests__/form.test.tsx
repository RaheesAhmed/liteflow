import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "../form";
import { Input } from "../input";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

const TestForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => {})}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter username" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter email" {...field} />
              </FormControl>
              <FormDescription>Enter your email address.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit">Submit</button>
      </form>
    </Form>
  );
};

describe("Form", () => {
  it("renders form with all components", () => {
    render(<TestForm />);

    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(
      screen.getByText("This is your public display name.")
    ).toBeInTheDocument();
    expect(screen.getByText("Enter your email address.")).toBeInTheDocument();
  });

  it("shows validation errors for invalid input", async () => {
    render(<TestForm />);

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    expect(
      await screen.findByText("Username must be at least 2 characters.")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Please enter a valid email address.")
    ).toBeInTheDocument();
  });

  it("handles valid form submission", async () => {
    render(<TestForm />);

    const usernameInput = screen.getByLabelText("Username");
    const emailInput = screen.getByLabelText("Email");

    fireEvent.change(usernameInput, { target: { value: "johndoe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    // No validation errors should be shown
    expect(
      screen.queryByText("Username must be at least 2 characters.")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Please enter a valid email address.")
    ).not.toBeInTheDocument();
  });

  it("applies error styles to form components", async () => {
    render(<TestForm />);

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    const usernameLabel = await screen.findByText("Username");
    expect(usernameLabel).toHaveClass("text-destructive");

    const emailLabel = await screen.findByText("Email");
    expect(emailLabel).toHaveClass("text-destructive");
  });

  it("shows form description text", () => {
    render(<TestForm />);

    expect(screen.getByText("This is your public display name.")).toHaveClass(
      "text-sm",
      "text-muted-foreground"
    );
    expect(screen.getByText("Enter your email address.")).toHaveClass(
      "text-sm",
      "text-muted-foreground"
    );
  });
});
