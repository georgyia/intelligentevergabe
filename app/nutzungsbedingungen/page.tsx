"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Zurück zur Startseite
            </Link>
          </Button>
          <h1 className="text-3xl font-bold mb-2">Nutzungsbedingungen</h1>
          <p className="text-gray-600">Letzte Aktualisierung: 01.04.2025</p>
        </div>

        <div className="prose max-w-none">
          <h2>1. Allgemeines</h2>
          <p>
            Die nachfolgenden Nutzungsbedingungen regeln das Vertragsverhältnis zwischen den Nutzern des Vergabevermerk
            Portals (nachfolgend "Portal" genannt) und der Betreibergesellschaft (nachfolgend "Betreiber" genannt). Mit
            der Registrierung für die Warteliste oder der Nutzung des Portals erkennen Sie diese Nutzungsbedingungen an.
          </p>

          <h2>2. Leistungsbeschreibung</h2>
          <p>
            Das Portal bietet eine digitale Plattform zur effizienten Verwaltung und Dokumentation von Vergabeverfahren
            im öffentlichen Sektor. Die genauen Funktionen und Leistungen werden bei Verfügbarkeit des Portals
            detailliert beschrieben.
          </p>

          <h2>3. Registrierung und Warteliste</h2>
          <p>
            Die Anmeldung zur Warteliste erfolgt durch Angabe einer gültigen E-Mail-Adresse. Die Aufnahme in die
            Warteliste begründet keinen Anspruch auf Zugang zum Portal. Der Betreiber behält sich vor, Anmeldungen ohne
            Angabe von Gründen abzulehnen.
          </p>
          <p>
            Mit der Anmeldung zur Warteliste erklären Sie sich damit einverstanden, dass wir Ihre E-Mail-Adresse
            speichern und Sie über die Verfügbarkeit des Portals sowie relevante Informationen zu unserem Angebot
            kontaktieren dürfen. Diese Einwilligung können Sie jederzeit mit Wirkung für die Zukunft widerrufen.
          </p>

          <h2>4. Kommunikation</h2>
          <p>Mit Ihrer Anmeldung zur Warteliste stimmen Sie zu, dass wir Sie per E-Mail kontaktieren dürfen, um:</p>
          <ul>
            <li>Sie über Ihren Status auf der Warteliste zu informieren</li>
            <li>Ihnen Zugang zum Portal zu gewähren, sobald dieser verfügbar ist</li>
            <li>Sie über wichtige Änderungen oder Updates zu informieren</li>
            <li>Ihnen relevante Informationen über unsere Dienstleistungen zukommen zu lassen</li>
          </ul>
          <p>
            Die Häufigkeit der Kommunikation wird auf ein angemessenes Maß beschränkt. Sie können den Erhalt von E-Mails
            jederzeit abbestellen.
          </p>

          <h2>5. Datenschutz</h2>
          <p>
            Der Schutz Ihrer persönlichen Daten ist uns wichtig. Detaillierte Informationen zur Verarbeitung Ihrer Daten
            finden Sie in unserer{" "}
            <Link href="/datenschutz" className="text-primary hover:underline">
              Datenschutzerklärung
            </Link>
            .
          </p>

          <h2>6. Haftungsbeschränkung</h2>
          <p>
            Der Betreiber haftet nur für Schäden, die auf einer vorsätzlichen oder grob fahrlässigen Pflichtverletzung
            des Betreibers, seiner gesetzlichen Vertreter oder Erfüllungsgehilfen beruhen. Die Haftungsbeschränkung gilt
            nicht für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit.
          </p>

          <h2>7. Änderungen der Nutzungsbedingungen</h2>
          <p>
            Der Betreiber behält sich vor, diese Nutzungsbedingungen jederzeit zu ändern. Die Nutzer werden über
            wesentliche Änderungen per E-Mail informiert. Die geänderten Nutzungsbedingungen gelten als akzeptiert, wenn
            der Nutzer nicht innerhalb von vier Wochen nach Erhalt der Änderungsmitteilung widerspricht.
          </p>

          <h2>8. Anwendbares Recht und Gerichtsstand</h2>
          <p>
            Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts. Gerichtsstand für alle
            Streitigkeiten aus oder im Zusammenhang mit diesen Nutzungsbedingungen ist, soweit gesetzlich zulässig, der
            Sitz des Betreibers.
          </p>

          <h2>9. Salvatorische Klausel</h2>
          <p>
            Sollten einzelne Bestimmungen dieser Nutzungsbedingungen unwirksam sein oder werden, bleibt die Wirksamkeit
            der übrigen Bestimmungen davon unberührt. An die Stelle der unwirksamen Bestimmung tritt eine wirksame
            Bestimmung, die dem wirtschaftlichen Zweck der unwirksamen Bestimmung am nächsten kommt.
          </p>
        </div>
      </div>
    </div>
  )
}

