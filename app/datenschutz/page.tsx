"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PrivacyPage() {
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
          <h1 className="text-3xl font-bold mb-2">Datenschutzerklärung</h1>
          <p className="text-gray-600">Letzte Aktualisierung: 01.04.2025</p>
        </div>

        <div className="prose max-w-none">
          <h2>1. Verantwortlicher</h2>
          <p>
            Verantwortlich für die Datenverarbeitung auf dieser Website im Sinne der Datenschutz-Grundverordnung (DSGVO)
            ist der Betreiber des Vergabevermerk Portals. Die Kontaktdaten des Verantwortlichen finden Sie im Impressum.
          </p>

          <h2>2. Erhebung und Verarbeitung personenbezogener Daten</h2>
          <p>Bei der Anmeldung zur Warteliste erheben wir folgende personenbezogene Daten:</p>
          <ul>
            <li>E-Mail-Adresse (erforderlich)</li>
            <li>Name (optional)</li>
            <li>Nachricht/Anmerkungen (optional)</li>
          </ul>
          <p>
            Diese Daten werden ausschließlich zum Zweck der Verwaltung der Warteliste, zur Kommunikation mit Ihnen
            bezüglich des Zugangs zum Portal und zur Bereitstellung relevanter Informationen über unsere
            Dienstleistungen verarbeitet.
          </p>

          <h2>3. Rechtsgrundlage der Verarbeitung</h2>
          <p>
            Die Verarbeitung Ihrer personenbezogenen Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO
            (Einwilligung) und Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung bzw. vorvertragliche Maßnahmen).
          </p>
          <p>
            Die Einwilligung zur Verarbeitung Ihrer Daten können Sie jederzeit mit Wirkung für die Zukunft widerrufen.
            Bitte beachten Sie, dass ein Widerruf die Rechtmäßigkeit der bis dahin erfolgten Verarbeitung nicht berührt.
          </p>

          <h2>4. E-Mail-Kommunikation</h2>
          <p>
            Mit Ihrer Anmeldung zur Warteliste willigen Sie ein, dass wir Ihre E-Mail-Adresse für folgende Zwecke
            verwenden dürfen:
          </p>
          <ul>
            <li>Bestätigung Ihrer Anmeldung zur Warteliste</li>
            <li>Information über Ihren Status auf der Warteliste</li>
            <li>Benachrichtigung, sobald Zugang zum Portal verfügbar ist</li>
            <li>Mitteilung wichtiger Änderungen oder Updates</li>
            <li>Bereitstellung relevanter Informationen über unsere Dienstleistungen</li>
          </ul>
          <p>
            Gemäß § 7 Abs. 3 UWG können Sie der Verwendung Ihrer E-Mail-Adresse zu Werbezwecken jederzeit widersprechen,
            ohne dass hierfür andere als die Übermittlungskosten nach den Basistarifen entstehen.
          </p>

          <h2>5. Speicherdauer</h2>
          <p>
            Wir speichern Ihre personenbezogenen Daten nur so lange, wie es für die Zwecke, für die sie erhoben wurden,
            erforderlich ist oder gesetzliche Aufbewahrungsfristen dies vorschreiben. Die Daten der Warteliste werden
            gelöscht, sobald sie für den Zweck ihrer Erhebung nicht mehr erforderlich sind, spätestens jedoch 6 Monate
            nach Beendigung der Wartelistenphase.
          </p>

          <h2>6. Ihre Rechte</h2>
          <p>Sie haben folgende Rechte in Bezug auf Ihre personenbezogenen Daten:</p>
          <ul>
            <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
            <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
            <li>Recht auf Löschung (Art. 17 DSGVO)</li>
            <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
            <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
            <li>Widerspruchsrecht (Art. 21 DSGVO)</li>
            <li>Recht auf Widerruf einer erteilten Einwilligung (Art. 7 Abs. 3 DSGVO)</li>
            <li>Beschwerderecht bei einer Aufsichtsbehörde (Art. 77 DSGVO)</li>
          </ul>
          <p>Zur Ausübung Ihrer Rechte können Sie sich jederzeit an uns wenden.</p>

          <h2>7. Datensicherheit</h2>
          <p>
            Wir setzen technische und organisatorische Sicherheitsmaßnahmen ein, um Ihre personenbezogenen Daten gegen
            zufällige oder vorsätzliche Manipulationen, Verlust, Zerstörung oder gegen den Zugriff unberechtigter
            Personen zu schützen. Unsere Sicherheitsmaßnahmen werden entsprechend der technologischen Entwicklung
            fortlaufend verbessert.
          </p>

          <h2>8. Weitergabe von Daten</h2>
          <p>
            Eine Übermittlung Ihrer persönlichen Daten an Dritte zu anderen als den im Folgenden aufgeführten Zwecken
            findet nicht statt:
          </p>
          <ul>
            <li>Zur Erfüllung gesetzlicher Verpflichtungen</li>
            <li>Wenn Sie Ihre ausdrückliche Einwilligung dazu erteilt haben</li>
            <li>Wenn dies zur Durchführung unserer Dienstleistungen erforderlich ist</li>
          </ul>
          <p>
            Die übermittelten Daten dürfen von den Dritten ausschließlich zu den genannten Zwecken verwendet werden.
          </p>

          <h2>9. Änderungen der Datenschutzerklärung</h2>
          <p>
            Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen rechtlichen
            Anforderungen entspricht oder um Änderungen unserer Leistungen in der Datenschutzerklärung umzusetzen. Für
            Ihren erneuten Besuch gilt dann die neue Datenschutzerklärung.
          </p>

          <h2>10. Fragen zum Datenschutz</h2>
          <p>
            Wenn Sie Fragen zum Datenschutz haben, wenden Sie sich bitte an uns über die im Impressum angegebenen
            Kontaktdaten. Wir stehen Ihnen gerne für Auskünfte zur Verfügung und helfen Ihnen bei der Ausübung Ihrer
            Rechte.
          </p>

          <h2>11. Zuständige Aufsichtsbehörde</h2>
          <p>
            Sollten Sie der Ansicht sein, dass die Verarbeitung Ihrer personenbezogenen Daten gegen geltendes
            Datenschutzrecht verstößt, haben Sie das Recht, sich bei einer Datenschutzaufsichtsbehörde zu beschweren.
            Sie können sich hierfür an die Aufsichtsbehörde Ihres üblichen Aufenthaltsortes, Ihres Arbeitsplatzes oder
            unseres Unternehmenssitzes wenden.
          </p>
        </div>
      </div>
    </div>
  )
}

