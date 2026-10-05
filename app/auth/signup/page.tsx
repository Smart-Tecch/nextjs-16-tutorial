"use client";

import { signUpSchema } from "@/app/schemas/auth";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";

export default function SignUp() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(data: z.infer<typeof signUpSchema>) {
    startTransition(async () => {
      await authClient.signUp.email({
        email: data.email,
        name: data.name,
        password: data.password,
        fetchOptions: {
          onSuccess: () => {
            toast.add({
              type: "success",
              description: "Account Created Successfully",
            });
            router.push("/");
          },
          onError: (error: { error: { message: string } }) => {
            toast.add({
              type: "error",
              description: error.error.message,
            });
          },
        },
      });
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Create an account to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-y-4">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Full Name</FieldLabel>
                  <Input
                    aria-invalid={fieldState.invalid}
                    placeholder="John Doe"
                    {...field}
                  />
                  {fieldState && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Enter Email</FieldLabel>
                  <Input
                    aria-invalid={fieldState.invalid}
                    placeholder="example@gmail.com"
                    {...field}
                  />
                  {fieldState && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Enter Password</FieldLabel>
                  <Input
                    aria-invalid={fieldState.invalid}
                    placeholder="*******"
                    type="password"
                    {...field}
                  />
                  {fieldState && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Button className="" disabled={isPending} type="submit">
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Loading..</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
              Sign In
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
