"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Mail, User, MessageSquare, ArrowRight, Building, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { submitToWaitlist } from "./actions/waitlist"

// Separate the CheckIcon component
const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-3 h-3"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export default function WaitlistPage() {
  const [mounted, setMounted] = useState(false)
  const [formState, setFormState] = useState({
    email: "",
    name: "",
    message: "",
    emailError: "",
    isLoading: false,
    isSubmitted: false,
    submitError: null as string | null,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const validateForm = () => {
    let isValid = true
    let emailError = ""

    if (!formState.email) {
      emailError = "E-Mail ist erforderlich"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      emailError = "Bitte geben Sie eine gültige E-Mail-Adresse ein"
      isValid = false
    }

    setFormState(prev => ({ ...prev, emailError }))
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setFormState(prev => ({ ...prev, submitError: null }))

    if (!validateForm()) return

    setFormState(prev => ({ ...prev, isLoading: true }))

    try {
      const result = await submitToWaitlist({
        email: formState.email,
        name: formState.name || undefined,
        message: formState.message || undefined,
      })

      if (result.success) {
        setFormState(prev => ({ ...prev, isSubmitted: true }))
      } else {
        setFormState(prev => ({
          ...prev,
          submitError: 'Es gab ein Problem bei der Anmeldung. Bitte versuchen Sie es später erneut.'
        }))
        console.error('Failed to submit to waitlist:', result.error)
      }
    } catch (error) {
      setFormState(prev => ({
        ...prev,
        submitError: 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.'
      }))
      console.error('Error submitting form:', error)
    } finally {
      setFormState(prev => ({ ...prev, isLoading: false }))
    }
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

  const successVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, delay: 0.2 },
    },
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="flex min-h-screen w-full bg-white overflow-hidden">
      {/* Background pattern - only for left side */}
      <motion.div
        className="absolute inset-0 z-0 opacity-10 md:hidden"
        initial="hidden"
        animate="visible"
        variants={backgroundVariants}
      >
        <div className="absolute inset-0 bg-grid-pattern" />
      </motion.div>

      <div className="flex flex-col md:flex-row w-full">
        {/* Left side - Collaboration Image */}
        <motion.div
          className="hidden md:block md:w-1/2 lg:w-3/5 relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Background image */}
          <div className="absolute inset-0">
            <Image
              src="/images/collaboration-meeting.png"
              alt="Collaboration Meeting"
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
              <h2 className="text-3xl font-bold mb-4">Vergabevermerk Portal</h2>
              <p className="text-lg mb-6">
                Seien Sie unter den Ersten, die Zugang zu unserem innovativen System für Vergabeverfahren erhalten
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center">
                    <CheckIcon />
                  </div>
                  <p>Frühzeitiger Zugang zu allen Funktionen</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center">
                    <CheckIcon />
                  </div>
                  <p>Exklusive Einblicke in die Entwicklung</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center">
                    <CheckIcon />
                  </div>
                  <p>Bevorzugte Onboarding-Unterstützung</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-blue-500/20 blur-xl" />
          <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-indigo-500/30 blur-xl" />
        </motion.div>

        {/* Right side - Waitlist form */}
        <div className="flex flex-col justify-center items-center w-full md:w-1/2 lg:w-2/5 px-4 py-12 sm:px-6 lg:px-8 relative">
          {/* Mobile background - only visible on small screens */}
          <div className="absolute inset-0 -z-10 md:hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/70 to-primary/20 mix-blend-multiply" />
            <Image
              src="/images/collaboration-meeting.png"
              alt="Collaboration"
              fill
              className="object-cover opacity-25"
            />
          </div>

          {/* Clean white background for right side */}
          <div className="absolute inset-0 -z-10 bg-white hidden md:block"></div>

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
              <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Warteliste beitreten</h1>
              <p className="mt-2 text-sm text-gray-600">
                Sichern Sie sich frühzeitigen Zugang zum Vergabevermerk Portal
              </p>
            </motion.div>

            {/* Waitlist form or success message */}
            {formState.isSubmitted ? (
              <motion.div variants={successVariants} initial="hidden" animate="visible">
                <Card className="border-none shadow-xl backdrop-blur-sm bg-white/95">
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-xl flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-green-500 mr-2" />
                      Erfolgreich angemeldet!
                    </CardTitle>
                    <CardDescription className="text-center">
                      Vielen Dank für Ihr Interesse am Vergabevermerk Portal
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="mb-4">
                      Wir haben Ihre Anmeldung für die Warteliste erhalten und werden Sie benachrichtigen, sobald Sie
                      Zugang erhalten.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Überprüfen Sie Ihren Posteingang und Spam-Ordner für eine Bestätigungs-E-Mail.
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <Button
                      onClick={() => {
                        setFormState(prev => ({
                          ...prev,
                          isSubmitted: false,
                          email: "",
                          name: "",
                          message: "",
                        }))
                      }}
                      variant="outline"
                    >
                      Zurück zum Formular
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ) : (
              <motion.div variants={itemVariants}>
                <Card className="border-none shadow-xl backdrop-blur-sm bg-white/95">
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-xl">Anmeldung zur Warteliste</CardTitle>
                    <CardDescription>Geben Sie Ihre Kontaktdaten ein</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {formState.submitError && (
                        <div className="p-3 rounded-md bg-red-50 border border-red-200">
                          <p className="text-sm text-red-600">{formState.submitError}</p>
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="email">
                          E-Mail <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="name@behörde.de"
                            className={`pl-10 ${formState.emailError ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                            value={formState.email}
                            onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
                            required
                          />
                        </div>
                        {formState.emailError && <p className="text-sm text-red-500">{formState.emailError}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="name">Name (optional)</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="name"
                            type="text"
                            placeholder="Max Mustermann"
                            className="pl-10"
                            value={formState.name}
                            onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Nachricht (optional)</Label>
                        <div className="relative">
                          <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Textarea
                            id="message"
                            placeholder="Teilen Sie uns mit, wofür Sie das Portal nutzen möchten..."
                            className="pl-10 min-h-[100px]"
                            value={formState.message}
                            onChange={(e) => setFormState(prev => ({ ...prev, message: e.target.value }))}
                          />
                        </div>
                      </div>
                      <Button type="submit" className="w-full group relative overflow-hidden" disabled={formState.isLoading}>
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {formState.isLoading ? (
                            <>
                              Anmelden<span className="loading loading-spinner loading-xs"></span>
                            </>
                          ) : (
                            <>
                              Warteliste beitreten
                              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </>
                          )}
                        </span>
                        <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Button>
                    </form>
                  </CardContent>
                  <CardFooter className="text-center text-sm text-muted-foreground">
                    <p className="w-full">
                      Durch die Anmeldung stimmen Sie unseren{" "}
                      <Link href="/nutzungsbedingungen" className="text-primary hover:underline">
                        Nutzungsbedingungen
                      </Link>{" "}
                      und{" "}
                      <Link href="/datenschutz" className="text-primary hover:underline">
                        Datenschutzrichtlinien
                      </Link>{" "}
                      zu.
                    </p>
                  </CardFooter>
                </Card>
              </motion.div>
            )}

            {/* Footer with logos */}
            <motion.div variants={itemVariants} className="flex justify-center items-center space-x-8 mt-6">
              <Link href="https://www.aiphase.de/" target="_blank" rel="noopener noreferrer" className="h-12">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%2013-ST8s1DrdckxFjciXs0AV91NxThedzt.png"
                  alt="AI Phase Logo"
                  width={150}
                  height={60}
                  className="h-12 w-auto"
                />
              </Link>
              <Link href="https://www.infora.de/" target="_blank" rel="noopener noreferrer" className="h-8">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Infora%201%281%29-nfPSVE2PUvzBsPYwpaTuz4tO9alBi7.svg"
                  alt="Infora Logo"
                  width={100}
                  height={36}
                  className="h-8 w-auto"
                />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

