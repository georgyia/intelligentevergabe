"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Lock, Mail, Eye, EyeOff, Building, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Form validation states
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  const validateForm = () => {
    let isValid = true

    // Email validation
    if (!email) {
      setEmailError("E-Mail ist erforderlich")
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Bitte geben Sie eine gültige E-Mail-Adresse ein")
      isValid = false
    } else {
      setEmailError("")
    }

    // Password validation
    if (!password) {
      setPasswordError("Passwort ist erforderlich")
      isValid = false
    } else if (password.length < 6) {
      setPasswordError("Passwort muss mindestens 6 Zeichen lang sein")
      isValid = false
    } else {
      setPasswordError("")
    }

    return isValid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      router.push("/")
    }, 1500)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  const backgroundVariants = {
    hidden: { scale: 1.05, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 1.2, ease: "easeOut" },
    },
  }

  if (!mounted) return null

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Background pattern */}
      <motion.div
        className="absolute inset-0 z-0 opacity-10 dark:opacity-5"
        initial="hidden"
        animate="visible"
        variants={backgroundVariants}
      >
        <div className="absolute inset-0 bg-grid-pattern" />
      </motion.div>

      <div className="flex flex-col md:flex-row w-full">
        {/* Left side - Illustration with the provided image */}
        <motion.div
          className="hidden md:block md:w-1/2 lg:w-3/5 relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Background image */}
          <div className="absolute inset-0">
            <Image
              src="/images/collaboration-background.png"
              alt="Collaboration"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40 mix-blend-multiply" />
          </div>

          {/* Content overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-12 z-10">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 shadow-2xl max-w-md text-white"
            >
              <h2 className="text-3xl font-bold mb-4">Intelligente Vergabe</h2>
              <p className="text-lg mb-6">
                Effiziente Zusammenarbeit und Dokumentation für Vergabeverfahren im öffentlichen Sektor
              </p>
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center">
                  <CheckIcon className="w-3 h-3 text-white" />
                </div>
                <p>Transparente Vergabeprozesse</p>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center">
                  <CheckIcon className="w-3 h-3 text-white" />
                </div>
                <p>Rechtssichere Dokumentation</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center">
                  <CheckIcon className="w-3 h-3 text-white" />
                </div>
                <p>Effiziente Teamarbeit</p>
              </div>
            </motion.div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-blue-500/20 blur-xl" />
          <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-indigo-500/30 blur-xl" />
        </motion.div>

        {/* Right side - Login form */}
        <div className="flex flex-col justify-center items-center w-full md:w-1/2 lg:w-2/5 px-4 py-12 sm:px-6 lg:px-8 relative">
          {/* Mobile background - only visible on small screens */}
          <div className="absolute inset-0 -z-10 md:hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/70 to-primary/20 mix-blend-multiply" />
            <Image
              src="/images/collaboration-background.png"
              alt="Collaboration"
              fill
              className="object-cover opacity-25"
            />
          </div>

          <motion.div
            className="w-full max-w-md space-y-8 relative z-10"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Logo and title */}
            <motion.div variants={itemVariants} className="text-center">
              <div className="flex justify-center">
                <div className="relative w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                  <Building className="h-8 w-8 text-white" />
                </div>
              </div>
              <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-gray-900">
                Willkommen zurück
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 md:text-gray-600">
                Melden Sie sich an, um auf Ihr Vergabevermerk-Konto zuzugreifen
              </p>
            </motion.div>

            {/* Login form */}
            <motion.div variants={itemVariants}>
              <Card className="border-none shadow-xl backdrop-blur-sm bg-white/95 dark:bg-gray-900/90">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-xl">Anmelden</CardTitle>
                  <CardDescription>Geben Sie Ihre Anmeldedaten ein</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">E-Mail</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="name@behörde.de"
                          className={`pl-10 ${emailError ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      {emailError && <p className="text-sm text-red-500">{emailError}</p>}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Passwort</Label>
                        <Link href="#" className="text-xs text-primary hover:underline">
                          Passwort vergessen?
                        </Link>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className={`pl-10 ${passwordError ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember" />
                      <Label htmlFor="remember" className="text-sm font-normal">
                        Angemeldet bleiben
                      </Label>
                    </div>
                    <Button type="submit" className="w-full group relative overflow-hidden" disabled={isLoading}>
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {isLoading ? (
                          <>
                            Anmelden<span className="loading loading-spinner loading-xs"></span>
                          </>
                        ) : (
                          <>
                            Anmelden
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </>
                        )}
                      </span>
                      <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                  </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <div className="relative w-full">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-card px-2 text-muted-foreground">Oder fortfahren mit</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="w-full">
                      <Image
                        src="/placeholder.svg?height=24&width=24"
                        alt="BundID"
                        width={24}
                        height={24}
                        className="mr-2"
                      />
                      BundID
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Image
                        src="/placeholder.svg?height=24&width=24"
                        alt="Behörden-ID"
                        width={24}
                        height={24}
                        className="mr-2"
                      />
                      Behörden-ID
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Footer */}
            <motion.div
              variants={itemVariants}
              className="text-center text-sm text-gray-500 dark:text-gray-400 md:text-gray-600"
            >
              <p>
                Neu hier?{" "}
                <Link href="#" className="font-medium text-primary hover:underline">
                  Konto erstellen
                </Link>
              </p>
              <p className="mt-4">© 2023 Vergabevermerk Portal. Alle Rechte vorbehalten.</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// Simple check icon component
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

