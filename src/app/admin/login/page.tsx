"use client"

import { useActionState } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { loginAction, type LoginState } from "../_actions"

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState<LoginState | undefined, FormData>(
    loginAction,
    undefined,
  )

  return (
    <div className="flex flex-1 items-center justify-center bg-linear-to-b from-zinc-50 to-zinc-100 px-4 py-10 dark:from-zinc-950 dark:to-black">
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl tracking-tight">Admin sign in</CardTitle>
          <CardDescription>Enter your admin credentials</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                aria-invalid={
                  state && !state.ok && "fieldErrors" in state && !!state.fieldErrors.email
                }
              />
              {state && !state.ok && "fieldErrors" in state && state.fieldErrors.email && (
                <p className="text-xs font-medium text-destructive">
                  {state.fieldErrors.email[0]}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                aria-invalid={
                  state &&
                  !state.ok &&
                  "fieldErrors" in state &&
                  !!state.fieldErrors.password
                }
              />
              {state && !state.ok && "fieldErrors" in state && state.fieldErrors.password && (
                <p className="text-xs font-medium text-destructive">
                  {state.fieldErrors.password[0]}
                </p>
              )}
            </div>

            {state && !state.ok && "error" in state && (
              <p className="text-xs font-medium text-destructive">{state.error}</p>
            )}

            <Button type="submit" size="lg" className="h-11" disabled={pending}>
              {pending ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
