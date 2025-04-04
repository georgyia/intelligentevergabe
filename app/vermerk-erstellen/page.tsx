"use client"

import type React from "react"

import {
  Search,
  Home,
  Database,
  Workflow,
  User,
  Settings,
  CheckCircle,
  XCircle,
  ChevronRight,
  Menu,
  Inbox,
  PlusCircle,
  Archive,
  Plus,
  Trash2,
  RefreshCw,
  AlertCircle,
  Bell,
  Clock,
  Check,
  FileText,
  ChevronDown,
  Download,
  ArrowLeft,
  ArrowRight,
  Maximize,
  FileSearch,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Document {
  id: string
  name: string
  description: string
  complete: boolean
  selected: boolean
  modifiedDate: string
  fileSize: string
}

interface LegalBasis {
  id: string
  name: string
  selected: boolean
  note?: string
  title?: string
}

export default function VermerkErstellen() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [workflowOpen, setWorkflowOpen] = useState(false)
  const [activitiesOpen, setActivitiesOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [legalSearchTerm, setLegalSearchTerm] = useState("")
  const [filterValue, setFilterValue] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [activeStep, setActiveStep] = useState(1)
  const [newDocument, setNewDocument] = useState({
    id: "",
    name: "",
    description: "",
    complete: false,
    modifiedDate: new Date().toLocaleDateString("de-DE"),
    fileSize: "0 KB",
  })
  const [formErrors, setFormErrors] = useState<{
    id?: string
    name?: string
    description?: string
  }>({})

  // Legal bases state
  const [legalBases, setLegalBases] = useState([
    { id: "uvgo", name: "UVgO - Unterschwellenvergabeordnung", selected: true },
    { id: "gwb", name: "GWB - Gesetz gegen Wettbewerbsbeschränkung", selected: true },
    { id: "bgb", name: "BGB - Bürgerliches Gesetzbuch", selected: true },
    { id: "vgv", name: "VgV - Vergabeverordnung", selected: true },
    { id: "sektvo", name: "SektVO - Sektorenverordnung", selected: true },
    { id: "vob", name: "VOB/A - Vergabe- und Vertragsordnung für Bauleistungen Abschnitt A", selected: true },
    { id: "hoa", name: "HOA I - Honorarordnung für Architekten und Ingenieure", selected: true },
  ])

  // Procedure options state with expanded state
  const [procedureOptions, setProcedureOptions] = useState({
    procedureType: { checked: true, expanded: false },
    applicableLaw: { checked: true, expanded: false },
    provisionOfDocuments: { checked: true, expanded: false },
    electronicProcurement: { checked: true, expanded: false },
    bidDeadline: { checked: true, expanded: false },
  })

  // Handle window resize for responsive process step titles
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Function to update state based on window width
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640)
    }

    // Set initial value
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Clean up
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Toggle sidebar expansion
  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded)
  }

  // Toggle workflow section
  const toggleWorkflow = (e: React.MouseEvent) => {
    e.preventDefault()
    setWorkflowOpen(!workflowOpen)
    if (activitiesOpen) setActivitiesOpen(false)
  }

  // Toggle activities panel
  const toggleActivities = (e: React.MouseEvent) => {
    e.preventDefault()
    setActivitiesOpen(!activitiesOpen)
    if (workflowOpen) setWorkflowOpen(false)
  }

  // Process steps
  const processSteps = [
    { number: 1, title: "Prüfung der Unterlagen", active: activeStep === 1 },
    { number: 2, title: "Auswahl der Rechtsgrundlagen", active: activeStep === 2 },
    { number: 3, title: "Vergabevermerksentwurf bearbeiten", active: activeStep === 3 },
    { number: 4, title: "Vergabevermerk speichern", active: activeStep === 4 },
  ]

  // Toggle procedure option checked state
  const toggleProcedureOptionChecked = (option: keyof typeof procedureOptions) => {
    setProcedureOptions((prev) => ({
      ...prev,
      [option]: { ...prev[option], checked: !prev[option].checked },
    }))
  }

  // Toggle procedure option expanded state
  const toggleProcedureOptionExpanded = (option: keyof typeof procedureOptions) => {
    setProcedureOptions((prev) => ({
      ...prev,
      [option]: { ...prev[option], expanded: !prev[option].expanded },
    }))
  }

  // Mock document content data
  const documentContents = {
    "01_A2A": {
      title: "Ausschreibung A2A",
      content: `
        <h1>Öffentliche Ausschreibung</h1>
        <p><strong>Aktenzeichen:</strong> VG-2023-0042</p>
        <p><strong>Vergabestelle:</strong> Landeshauptstadt München</p>
        <p><strong>Auftragsgegenstand:</strong> Beschaffung von Büroausstattung für die neue Verwaltungsstelle</p>
        
        <h2>1. Allgemeine Informationen</h2>
        <p>Die Landeshauptstadt München schreibt hiermit die Lieferung und Montage von Büroausstattung für die neue Verwaltungsstelle im Stadtbezirk Schwabing-West aus. Die Ausschreibung erfolgt im Rahmen eines offenen Verfahrens nach VOL/A.</p>
        
        <h2>2. Leistungsumfang</h2>
        <p>Der Leistungsumfang umfasst:</p>
        <ul>
          <li>Lieferung von 120 höhenverstellbaren Schreibtischen</li>
          <li>Lieferung von 120 ergonomischen Bürostühlen</li>
          <li>Lieferung und Montage von 40 Aktenschränken</li>
          <li>Lieferung und Montage von 15 Besprechungstischen</li>
          <li>Lieferung von 60 Besucherstühlen</li>
        </ul>
        
        <h2>3. Vergabekriterien</h2>
        <p>Die Bewertung der Angebote erfolgt nach folgenden Kriterien:</p>
        <ul>
          <li>Preis: 60%</li>
          <li>Qualität: 30%</li>
          <li>Lieferzeit: 10%</li>
        </ul>
        
        <h2>4. Fristen</h2>
        <p><strong>Angebotsfrist:</strong> 15.04.2023, 12:00 Uhr</p>
        <p><strong>Zuschlagsfrist:</strong> 30.04.2023</p>
        <p><strong>Ausführungsfrist:</strong> Die Lieferung und Montage muss bis zum 30.06.2023 abgeschlossen sein.</p>
      `,
    },
    "02_LB": {
      title: "Leistungsbeschreibung",
      content: `
        <h1>Leistungsbeschreibung</h1>
        <p><strong>Projekt:</strong> Büroausstattung Verwaltungsstelle München</p>
        
        <h2>1. Höhenverstellbare Schreibtische</h2>
        <p><strong>Anzahl:</strong> 120 Stück</p>
        <p><strong>Technische Anforderungen:</strong></p>
        <ul>
          <li>Elektrisch höhenverstellbar (65-125 cm)</li>
          <li>Tischplatte: 160 x 80 cm, Materialstärke mind. 25 mm</li>
          <li>Belastbarkeit: mind. 80 kg</li>
          <li>Farbe: Weiß oder Hellgrau</li>
          <li>Kabelmanagement integriert</li>
          <li>Memory-Funktion für mind. 3 Höheneinstellungen</li>
          <li>Geräuscharmer Motor (max. 50 dB)</li>
        </ul>
        
        <h2>2. Ergonomische Bürostühle</h2>
        <p><strong>Anzahl:</strong> 120 Stück</p>
        <p><strong>Technische Anforderungen:</strong></p>
        <ul>
          <li>Synchronmechanik mit Gewichtsanpassung</li>
          <li>Höhenverstellbare Rückenlehne</li>
          <li>Höhenverstellbare Armlehnen (3D)</li>
          <li>Sitztiefenverstellung</li>
          <li>Lordosenstütze</li>
          <li>Kopfstütze (höhenverstellbar)</li>
          <li>Belastbarkeit: mind. 120 kg</li>
          <li>Bezug: Schwer entflammbar nach DIN 4102 B1</li>
          <li>Farbe: Schwarz oder Dunkelgrau</li>
        </ul>
        
        <h2>3. Aktenschränke</h2>
        <p><strong>Anzahl:</strong> 40 Stück</p>
        <p><strong>Technische Anforderungen:</strong></p>
        <ul>
          <li>Maße: H 200 cm x B 100 cm x T 45 cm</li>
          <li>5 Einlegeböden, höhenverstellbar</li>
          <li>Abschließbar mit Zylinderschloss</li>
          <li>Material: Stahlblech, pulverbeschichtet</li>
          <li>Farbe: Weiß oder Hellgrau</li>
        </ul>
      `,
    },
    "03_VK": {
      title: "Vergabekriterien",
      content: `
        <h1>Vergabekriterien</h1>
        <p><strong>Projekt:</strong> Büroausstattung Verwaltungsstelle München</p>
        <p><strong>Aktenzeichen:</strong> VG-2023-0042</p>
        
        <h2>1. Bewertungsmatrix</h2>
        <p>Die Bewertung der Angebote erfolgt nach dem Bestbieterprinzip anhand der folgenden Kriterien:</p>
        
        <table border="1" cellpadding="5" style="border-collapse: collapse; width: 100%;">
          <tr>
            <th>Kriterium</th>
            <th>Gewichtung</th>
            <th>Maximale Punktzahl</th>
          </tr>
          <tr>
            <td>Preis</td>
            <td>60%</td>
            <td>60</td>
          </tr>
          <tr>
            <td>Qualität</td>
            <td>30%</td>
            <td>30</td>
          </tr>
          <tr>
            <td>Lieferzeit</td>
            <td>10%</td>
            <td>10</td>
          </tr>
          <tr>
            <td><strong>Gesamt</strong></td>
            <td><strong>100%</strong></td>
            <td><strong>100</strong></td>
          </tr>
        </table>
        
        <h2>2. Preisbewertung (60 Punkte)</h2>
        <p>Die Preisbewertung erfolgt nach folgender Formel:</p>
        <p>Punktzahl = 60 × (niedrigster Angebotspreis / Angebotspreis des Bieters)</p>
        
        <h2>3. Qualitätsbewertung (30 Punkte)</h2>
        <p>Die Qualitätsbewertung erfolgt anhand folgender Unterkriterien:</p>
        
        <table border="1" cellpadding="5" style="border-collapse: collapse; width: 100%;">
          <tr>
            <th>Unterkriterium</th>
            <th>Gewichtung</th>
            <th>Maximale Punktzahl</th>
          </tr>
          <tr>
            <td>Materialqualität</td>
            <td>40%</td>
            <td>12</td>
          </tr>
          <tr>
            <td>Ergonomie</td>
            <td>30%</td>
            <td>9</td>
          </tr>
          <tr>
            <td>Design</td>
            <td>10%</td>
            <td>3</td>
          </tr>
          <tr>
            <td>Garantieleistungen</td>
            <td>20%</td>
            <td>6</td>
          </tr>
          <tr>
            <td><strong>Gesamt</strong></td>
            <td><strong>100%</strong></td>
            <td><strong>30</strong></td>
          </tr>
        </table>
      `,
    },
    "04_AB": {
      title: "Angebotsbewertung",
      content: `
        <h1>Angebotsbewertung</h1>
        <p><strong>Projekt:</strong> Büroausstattung Verwaltungsstelle München</p>
        <p><strong>Aktenzeichen:</strong> VG-2023-0042</p>
        <p><strong>Datum der Bewertung:</strong> 02.05.2023</p>
        
        <h2>1. Eingegangene Angebote</h2>
        <p>Es sind insgesamt 5 Angebote fristgerecht eingegangen:</p>
        
        <table border="1" cellpadding="5" style="border-collapse: collapse; width: 100%;">
          <tr>
            <th>Bieter</th>
            <th>Angebotssumme (netto)</th>
            <th>Lieferzeit (Wochen)</th>
          </tr>
          <tr>
            <td>Büro Komplett GmbH</td>
            <td>€ 48.200,00</td>
            <td>6</td>
          </tr>
          <tr>
            <td>Office Solutions AG</td>
            <td>€ 52.450,00</td>
            <td>4</td>
          </tr>
          <tr>
            <td>Ergonomie Plus KG</td>
            <td>€ 56.900,00</td>
            <td>3</td>
          </tr>
          <tr>
            <td>Büroeinrichtung Müller</td>
            <td>€ 49.800,00</td>
            <td>5</td>
          </tr>
          <tr>
            <td>Workspace Design GmbH</td>
            <td>€ 53.600,00</td>
            <td>4</td>
          </tr>
        </table>
        
        <h2>2. Formale Prüfung</h2>
        <p>Alle Angebote wurden auf Vollständigkeit und Einhaltung der formalen Anforderungen geprüft.</p>
        <p>Das Angebot der Firma Ergonomie Plus KG musste ausgeschlossen werden, da wesentliche Nachweise zur technischen Leistungsfähigkeit fehlen.</p>
        
        <h2>3. Bewertung nach Vergabekriterien</h2>
        
        <table border="1" cellpadding="5" style="border-collapse: collapse; width: 100%;">
          <tr>
            <th>Bieter</th>
            <th>Preis (60 P.)</th>
            <th>Qualität (30 P.)</th>
            <th>Lieferzeit (10 P.)</th>
            <th>Gesamtpunktzahl</th>
            <th>Rang</th>
          </tr>
          <tr>
            <td>Büro Komplett GmbH</td>
            <td>60,00</td>
            <td>22,50</td>
            <td>5,00</td>
            <td>87,50</td>
            <td>1</td>
          </tr>
          <tr>
            <td>Office Solutions AG</td>
            <td>55,10</td>
            <td>27,00</td>
            <td>7,50</td>
            <td>89,60</td>
            <td>2</td>
          </tr>
          <tr>
            <td>Büroeinrichtung Müller</td>
            <td>58,00</td>
            <td>24,00</td>
            <td>6,00</td>
            <td>88,00</td>
            <td>3</td>
          </tr>
          <tr>
            <td>Workspace Design GmbH</td>
            <td>53,90</td>
            <td>25,50</td>
            <td>7,50</td>
            <td>86,90</td>
            <td>4</td>
          </tr>
        </table>
      `,
    },
    "05_BV": {
      title: "Bieterverzeichnis",
      content: `
        <h1>Bieterverzeichnis</h1>
        <p><strong>Projekt:</strong> Büroausstattung Verwaltungsstelle München</p>
        <p><strong>Aktenzeichen:</strong> VG-2023-0042</p>
        
        <h2>1. Übersicht der Bieter</h2>
        
        <table border="1" cellpadding="5" style="border-collapse: collapse; width: 100%;">
          <tr>
            <th>Nr.</th>
            <th>Unternehmen</th>
            <th>Anschrift</th>
            <th>Ansprechpartner</th>
            <th>Kontaktdaten</th>
          </tr>
          <tr>
            <td>1</td>
            <td>Büro Komplett GmbH</td>
            <td>Industriestraße 45, 80339 München</td>
            <td>Herr Thomas Müller</td>
            <td>t.mueller@buero-komplett.de<br>Tel: 089-12345678</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Office Solutions AG</td>
            <td>Büroweg 12, 60313 Frankfurt am Main</td>
            <td>Frau Sarah Schmidt</td>
            <td>s.schmidt@office-solutions.de<br>Tel: 069-87654321</td>
          </tr>
          <tr>
            <td>3</td>
            <td>Ergonomie Plus KG</td>
            <td>Möbelstraße 78, 70173 Stuttgart</td>
            <td>Herr Michael Weber</td>
            <td>m.weber@ergonomie-plus.de<br>Tel: 0711-23456789</td>
          </tr>
          <tr>
            <td>4</td>
            <td>Büroeinrichtung Müller</td>
            <td>Schreibtischweg 34, 80686 München</td>
            <td>Frau Julia Müller</td>
            <td>j.mueller@bueroeinrichtung-mueller.de<br>Tel: 089-34567890</td>
          </tr>
          <tr>
            <td>5</td>
            <td>Workspace Design GmbH</td>
            <td>Designallee 56, 40212 Düsseldorf</td>
            <td>Herr Lukas Fischer</td>
            <td>l.fischer@workspace-design.de<br>Tel: 0211-45678901</td>
          </tr>
        </table>
        
        <h2>2. Teilnahmevoraussetzungen</h2>
        <p>Alle Bieter haben die erforderlichen Nachweise zur Eignung gemäß § 122 GWB vorgelegt:</p>
        <ul>
          <li>Handelsregisterauszug</li>
          <li>Unbedenklichkeitsbescheinigung des Finanzamtes</li>
          <li>Unbedenklichkeitsbescheinigung der Berufsgenossenschaft</li>
          <li>Referenzen über vergleichbare Projekte</li>
          <li>Erklärung zur Zuverlässigkeit</li>
        </ul>
        
        <h2>3. Besondere Hinweise</h2>
        <p>Der Bieter Ergonomie Plus KG hat die geforderten Referenzen über vergleichbare Projekte nicht vollständig vorgelegt. Eine Nachforderung wurde am 20.04.2023 versendet, jedoch nicht fristgerecht beantwortet.</p>
      `,
    },
    "06_KS": {
      title: "Kostenschätzung",
      content: `
        <h1>Kostenschätzung</h1>
        <p><strong>Projekt:</strong> Büroausstattung Verwaltungsstelle München</p>
        <p><strong>Aktenzeichen:</strong> VG-2023-0042</p>
        <p><strong>Datum:</strong> 15.02.2023</p>
        
        <h2>1. Zusammenfassung</h2>
        <p>Für die Beschaffung der Büroausstattung für die neue Verwaltungsstelle im Stadtbezirk Schwabing-West wird ein Gesamtbudget von <strong>€ 52.500,00 (netto)</strong> veranschlagt.</p>
        
        <h2>2. Detaillierte Kostenschätzung</h2>
        
        <table border="1" cellpadding="5" style="border-collapse: collapse; width: 100%;">
          <tr>
            <th>Position</th>
            <th>Anzahl</th>
            <th>Einzelpreis (netto)</th>
            <th>Gesamtpreis (netto)</th>
          </tr>
          <tr>
            <td>Höhenverstellbare Schreibtische</td>
            <td>120</td>
            <td>€ 250,00</td>
            <td>€ 30.000,00</td>
          </tr>
          <tr>
            <td>Ergonomische Bürostühle</td>
            <td>120</td>
            <td>€ 120,00</td>
            <td>€ 14.400,00</td>
          </tr>
          <tr>
            <td>Aktenschränke</td>
            <td>40</td>
            <td>€ 150,00</td>
            <td>€ 6.000,00</td>
          </tr>
          <tr>
            <td>Besprechungstische</td>
            <td>15</td>
            <td>€ 80,00</td>
            <td>€ 1.200,00</td>
          </tr>
          <tr>
            <td>Besucherstühle</td>
            <td>60</td>
            <td>€ 15,00</td>
            <td>€ 900,00</td>
          </tr>
          <tr>
            <td><strong>Summe</strong></td>
            <td></td>
            <td></td>
            <td><strong>€ 52.500,00</strong></td>
          </tr>
        </table>
        
        <h2>3. Marktrecherche</h2>
        <p>Die Kostenschätzung basiert auf einer Marktrecherche, die im Januar 2023 durchgeführt wurde. Dabei wurden die Preise von fünf führenden Anbietern für Büroausstattung verglichen.</p>
        
        <h2>4. Budgetplanung</h2>
        <p>Das Budget für die Beschaffung ist im Haushaltsplan 2023 unter der Kostenstelle 45678 - Verwaltungsstelle Schwabing-West eingeplant und wurde vom Stadtrat am 12.12.2022 genehmigt.</p>
        
        <h2>5. Hinweise</h2>
        <p>Die Kostenschätzung enthält keine Kosten für:</p>
        <ul>
          <li>IT-Ausstattung (separate Ausschreibung)</li>
          <li>Beleuchtung (bereits vorhanden)</li>
          <li>Bodenbeläge (bereits vorhanden)</li>
          <li>Trennwände und Raumteiler (bereits vorhanden)</li>
        </ul>
      `,
    },
    uvgo: {
      title: "UVgO - Unterschwellenvergabeordnung",
      content: `
        <h1>Unterschwellenvergabeordnung (UVgO)</h1>
        
        <h2>Relevante Bestimmungen</h2>
        <p>Die Vergabe erfolgt nach der Unterschwellenvergabeordnung (UVgO).</p>
        <p>Die UVgO regelt die Vergabe öffentlicher Liefer- und Dienstleistungsaufträge unterhalb der EU-Schwellenwerte. Im nationalen Bereich, stellt sicher, dass Aufträge im Verfahren, die Eignung, Auftragsvergabe, Angebotsbearbeitung, sowie Zuschlagserteilung.</p>
        
        <h2>§ 8 Verfahrensarten</h2>
        <p>Öffentliche Aufträge werden im offenen Verfahren, im nicht offenen Verfahren mit Teilnahmewettbewerb, im Verhandlungsverfahren mit oder ohne Teilnahmewettbewerb oder im wettbewerblichen Dialog vergeben.</p>
        
        <h2>§ 9 Öffentliche Ausschreibung</h2>
        <p>Bei der öffentlichen Ausschreibung fordert der öffentliche Auftraggeber eine unbeschränkte Anzahl von Unternehmen öffentlich zur Abgabe von Angeboten auf. Jedes interessierte Unternehmen kann ein Angebot abgeben.</p>
        
        <h2>§ 12 Verhandlungsvergabe</h2>
        <p>Bei einer Verhandlungsvergabe mit oder ohne Teilnahmewettbewerb vergibt der öffentliche Auftraggeber Aufträge nach Verhandlungen mit einem oder mehreren Unternehmen.</p>
        
        <h2>§ 21 Fristen für öffentliche Ausschreibungen und Teilnahmewettbewerbe</h2>
        <p>Der öffentliche Auftraggeber legt angemessene Fristen für den Eingang der Angebote und der Anträge auf Teilnahme fest.</p>
      `,
    },
  }

  // Mock data for documents with state
  const [documents, setDocuments] = useState([
    {
      id: "01_A2A",
      name: "Ausschreibung A2A",
      description: "Ausschreibungsunterlagen für Projekt A2A",
      complete: false,
      selected: true,
      modifiedDate: "15.03.2023",
      fileSize: "2.4 MB",
    },
    {
      id: "02_LB",
      name: "Leistungsbeschreibung",
      description: "Detaillierte Beschreibung der geforderten Leistungen",
      complete: false,
      selected: true,
      modifiedDate: "12.03.2023",
      fileSize: "1.8 MB",
    },
    {
      id: "03_VK",
      name: "Vergabekriterien",
      description: "Kriterien für die Bewertung der Angebote",
      complete: false,
      selected: true,
      modifiedDate: "10.03.2023",
      fileSize: "756 KB",
    },
    {
      id: "04_AB",
      name: "Angebotsbewertung",
      description: "Bewertung der eingegangenen Angebote",
      complete: false,
      selected: true,
      modifiedDate: "08.03.2023",
      fileSize: "3.2 MB",
    },
    {
      id: "05_BV",
      name: "Bieterverzeichnis",
      description: "Liste aller Bieter mit Kontaktdaten",
      complete: false,
      selected: false,
      modifiedDate: "05.03.2023",
      fileSize: "1.1 MB",
    },
    {
      id: "06_KS",
      name: "Kostenschätzung",
      description: "Detaillierte Kostenschätzung für das Projekt",
      complete: false,
      selected: false,
      modifiedDate: "01.03.2023",
      fileSize: "890 KB",
    },
  ])

  // Toggle document completion status
  const toggleDocumentComplete = (e: React.MouseEvent, docId: string) => {
    e.stopPropagation() // Prevent row click from triggering
    setDocuments((docs) => docs.map((doc) => (doc.id === docId ? { ...doc, complete: !doc.complete } : doc)))
  }

  // Toggle document selection
  const toggleDocumentSelection = (checked: boolean | "indeterminate", docId: string) => {
    setDocuments((docs) => docs.map((doc) => (doc.id === docId ? { ...doc, selected: checked === true } : doc)))
  }

  // Toggle all documents selection
  const toggleAllDocuments = (checked: boolean | "indeterminate") => {
    setDocuments((docs) => docs.map((doc) => ({ ...doc, selected: checked === true })))
  }

  // Delete selected documents
  const deleteSelectedDocuments = () => {
    setDocuments((docs) => docs.filter((doc) => !doc.selected))
    setDeleteDialogOpen(false)
  }

  // Toggle legal basis selection
  const toggleLegalBasisSelection = (id: string) => {
    setLegalBases((bases) => bases.map((basis) => (basis.id === id ? { ...basis, selected: !basis.selected } : basis)))
  }

  // Navigation items
  const topNavItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Workflow, label: "Workflow", href: "#", onClick: toggleWorkflow },
    { icon: Bell, label: "Aktivitäten", href: "#", onClick: toggleActivities },
    { icon: Database, label: "Daten", href: "/daten" },
  ]

  const bottomNavItems = [
    { icon: User, label: "Profil", href: "/profil" },
    { icon: Settings, label: "Einstellungen", href: "/einstellungen" },
  ]

  // Workflow items
  const workflowItems = [
    { icon: Inbox, label: "Eingang", href: "/eingang" },
    { icon: PlusCircle, label: "Neuer Vergabevermerk", href: "/neu" },
    { icon: Archive, label: "Archiv", href: "/archiv" },
  ]

  // Mock data for recent activities
  const recentActivities = [
    { icon: CheckCircle, text: "Vergabevermerk A2023-45B wurde freigegeben", time: "Heute, 09:45" },
    { icon: AlertCircle, text: "Frist für Nachforderung abgelaufen", time: "Gestern, 16:30" },
    { icon: Clock, text: "Erinnerung: Vergabetermin in 5 Tagen", time: "Gestern, 10:15" },
    { icon: CheckCircle, text: "Leistungsbeschreibung aktualisiert", time: "15.03.2023, 14:20" },
    { icon: AlertCircle, text: "Neue Bieteranfrage eingegangen", time: "14.03.2023, 11:05" },
    { icon: Clock, text: "Vergabetermin für Projekt D-2023/22 festgelegt", time: "10.03.2023, 09:30" },
  ]

  // Filter documents based on search term and filter value
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.id.toLowerCase().includes(searchTerm.toLowerCase())

    if (filterValue === "all") return matchesSearch
    if (filterValue === "complete") return matchesSearch && doc.complete
    if (filterValue === "incomplete") return matchesSearch && !doc.complete
    if (filterValue === "selected") return matchesSearch && doc.selected

    return matchesSearch
  })

  // Filter legal bases based on search term
  const filteredLegalBases = legalBases.filter((basis) =>
    basis.name.toLowerCase().includes(legalSearchTerm.toLowerCase()),
  )

  // Selected document for preview (first one by default)
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null)
  const selectedDocument = selectedDocumentId
    ? documents.find((doc) => doc.id === selectedDocumentId) ||
      legalBases.find((basis) => basis.id === selectedDocumentId)
    : null

  // Count selected documents
  const selectedCount = documents.filter((doc) => doc.selected).length

  // Handle adding a new document
  const handleAddDocument = () => {
    // Validate form
    const errors: {
      id?: string
      name?: string
      description?: string
    } = {}

    if (!newDocument.id) {
      errors.id = "ID ist erforderlich"
    } else if (documents.some((doc) => doc.id === newDocument.id)) {
      errors.id = "ID existiert bereits"
    }

    if (!newDocument.name) {
      errors.name = "Name ist erforderlich"
    }

    if (!newDocument.description) {
      errors.description = "Beschreibung ist erforderlich"
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    // Add new document
    setDocuments([
      ...documents,
      {
        ...newDocument,
        selected: false,
      },
    ])

    // Reset form and close dialog
    setNewDocument({
      id: "",
      name: "",
      description: "",
      complete: false,
      modifiedDate: new Date().toLocaleDateString("de-DE"),
      fileSize: "0 KB",
    })
    setFormErrors({})
    setAddDialogOpen(false)
  }

  // Calculate completion percentage
  const getCompletionPercentage = () => {
    if (documents.length === 0) return 0
    return 99
  }

  // Get document completion percentage
  const getDocumentCompletionPercentage = (doc: Document | LegalBasis | null) => {
    if (!doc) return 0
    return "complete" in doc && doc.complete ? 99 : 70
  }

  // Handle continue button click
  const handleContinue = () => {
    if (activeStep === 1 && documents.every((doc) => doc.complete)) {
      setActiveStep(2)
    } else if (activeStep === 2) {
      setActiveStep(3)
    }
  }

  // Handle back button click
  const handleBack = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1)
    }
  }

  // Render content based on active step
  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Prüfung der Unterlagen</h2>
            <p className="text-gray-600 mb-6">
              Bitte prüfen Sie die Vollständigkeit und Korrektheit der Vergabeunterlagen.
            </p>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  className="pl-10 py-2 w-full rounded-md border border-gray-300"
                  placeholder="Suche in den Unterlagen"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterValue} onValueChange={setFilterValue}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle</SelectItem>
                  <SelectItem value="complete">Vollständig</SelectItem>
                  <SelectItem value="incomplete">Unvollständig</SelectItem>
                  <SelectItem value="selected">Ausgewählt</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Document count */}
            <div className="mb-2 text-sm text-gray-500">
              {filteredDocuments.length} {filteredDocuments.length === 1 ? "Unterlage" : "Unterlagen"} gefunden
              {selectedCount > 0 && `, ${selectedCount} ausgewählt`}
            </div>

            {/* Document Table - Responsive version */}
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
              {/* Table for medium screens and up */}
              <div className="hidden md:block">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8"
                      >
                        <div className="flex items-center justify-center h-5 w-5">
                          <Checkbox
                            id="select-all"
                            checked={documents.length > 0 && documents.every((doc) => doc.selected)}
                            onCheckedChange={toggleAllDocuments}
                            className="h-4 w-4"
                          />
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Änderungsdatum
                      </th>
                      <th
                        scope="col"
                        className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Dateigröße
                      </th>
                      <th
                        scope="col"
                        className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40"
                      >
                        Vollständigkeit
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDocuments.length > 0 ? (
                      filteredDocuments.map((doc, index) => (
                        <tr
                          key={index}
                          className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                            selectedDocumentId === doc.id ? "bg-gray-50" : ""
                          }`}
                          onClick={() => setSelectedDocumentId(doc.id)}
                        >
                          <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                            <div
                              className="flex items-center justify-center h-5 w-5"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Checkbox
                                id={`select-${doc.id}`}
                                checked={doc.selected}
                                onCheckedChange={(checked) => toggleDocumentSelection(checked, doc.id)}
                                className="h-4 w-4"
                              />
                            </div>
                          </td>
                          <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <FileText className="h-5 w-5 text-gray-500 mr-2" />
                              <div className="font-medium">{doc.name}</div>
                            </div>
                          </td>
                          <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{doc.modifiedDate}</div>
                          </td>
                          <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{doc.fileSize}</div>
                          </td>
                          <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                            <div className="flex items-center justify-center">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      className={`flex items-center justify-center rounded-full w-6 h-6 ${
                                        doc.complete ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"
                                      }`}
                                      onClick={(e) => toggleDocumentComplete(e, doc.id)}
                                    >
                                      {doc.complete ? (
                                        <CheckCircle className="h-4 w-4" />
                                      ) : (
                                        <XCircle className="h-4 w-4" />
                                      )}
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Klicken zum {doc.complete ? "Unvollständig" : "Vollständig"} markieren</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                          Keine Unterlagen gefunden
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Card layout for small screens */}
              <div className="md:hidden">
                {filteredDocuments.length > 0 ? (
                  filteredDocuments.map((doc, index) => (
                    <div
                      key={index}
                      className={`p-4 border-b border-gray-200 cursor-pointer transition-colors ${
                        selectedDocumentId === doc.id ? "bg-gray-50" : ""
                      }`}
                      onClick={() => setSelectedDocumentId(doc.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="mr-3" onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              id={`select-mobile-${doc.id}`}
                              checked={doc.selected}
                              onCheckedChange={(checked) => toggleDocumentSelection(checked, doc.id)}
                              className="h-4 w-4"
                            />
                          </div>
                          <FileText className="h-5 w-5 text-gray-500 mr-2" />
                          <div className="font-medium">{doc.name}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            className={`flex items-center justify-center rounded-full w-6 h-6 ${
                              doc.complete ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"
                            }`}
                            onClick={(e) => toggleDocumentComplete(e, doc.id)}
                          >
                            {doc.complete ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 pl-9">
                        <div>Geändert: {doc.modifiedDate}</div>
                        <div>Größe: {doc.fileSize}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">Keine Unterlagen gefunden</div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Button
                variant="outline"
                className="flex items-center gap-2 text-xs sm:text-sm"
                onClick={() => setAddDialogOpen(true)}
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Unterlage</span> hinzufügen
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2 text-xs sm:text-sm"
                onClick={() => selectedCount > 0 && setDeleteDialogOpen(true)}
                disabled={selectedCount === 0}
              >
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Unterlage</span> löschen
                {selectedCount > 0 && <span className="ml-1">({selectedCount})</span>}
              </Button>
              <Button variant="outline" className="flex items-center gap-2 ml-auto text-xs sm:text-sm">
                <RefreshCw className="h-4 w-4" />
                Synchronisieren
              </Button>
            </div>

            {/* AI Analysis */}
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="flex items-center mb-3">
                <div className="bg-primary/10 text-primary rounded-full p-1 px-3 text-sm font-medium flex items-center mr-2">
                  KI
                </div>
                <span className="font-medium text-base">Analyse</span>
              </div>
              <p className="text-sm">
                {documents.every((doc) => doc.complete)
                  ? "Alle Unterlagen sind formal vollständig."
                  : `${documents.filter((doc) => doc.complete).length} von ${documents.length} Unterlagen sind vollständig.`}
              </p>
              {!documents.every((doc) => doc.complete) && (
                <div className="mt-2 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                  <p className="text-sm text-amber-700">
                    Bitte vervollständigen Sie die fehlenden Unterlagen, bevor Sie fortfahren.
                  </p>
                </div>
              )}

              <div className="mt-4 flex items-center justify-center">
                <div className="rating-circle">
                  <div
                    className="rating-circle-inner"
                    style={{
                      background: selectedDocument
                        ? `conic-gradient(#10b981 ${getDocumentCompletionPercentage(selectedDocument)}%, #e5e7eb 0%)`
                        : "conic-gradient(#e5e7eb 100%, #e5e7eb 0%)",
                    }}
                  >
                    <div className="rating-circle-value">
                      {selectedDocument ? getDocumentCompletionPercentage(selectedDocument) : 0}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handleBack} disabled={activeStep === 1}>
                Zurück
              </Button>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={!documents.every((doc) => doc.complete)}
                onClick={handleContinue}
              >
                Zustimmen und weiter
              </Button>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Auswahl der Rechtsgrundlagen</h2>
            <p className="text-gray-600 mb-6">
              Bitte wählen Sie die relevanten Rechtsgrundlagen aus. Basierend auf den Unterlagen wurde eine Vorauswahl
              getroffen.
            </p>

            {/* Search for legal bases */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10 py-2 w-full rounded-md border border-gray-300"
                placeholder="Suche in Rechtsgrundlagen"
                value={legalSearchTerm}
                onChange={(e) => setLegalSearchTerm(e.target.value)}
              />
            </div>

            {/* Legal bases list */}
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
              <div className="divide-y divide-gray-200">
                {filteredLegalBases.map((basis, index) => (
                  <div
                    key={index}
                    className={`p-3 flex items-center hover:bg-gray-50 cursor-pointer ${
                      selectedDocumentId === basis.id ? "bg-gray-50" : ""
                    }`}
                    onClick={() => setSelectedDocumentId(basis.id)}
                  >
                    <Checkbox
                      id={`legal-${basis.id}`}
                      checked={basis.selected}
                      onCheckedChange={() => toggleLegalBasisSelection(basis.id)}
                      className="h-4 w-4 mr-3"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{basis.name}</div>
                      {basis.note && <div className="text-xs text-gray-500 mt-1">{basis.note}</div>}
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      <div
                        className={`flex items-center justify-center rounded-full w-6 h-6 ${basis.selected ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}
                      >
                        {basis.selected ? <Check className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add legal basis button */}
            <div className="mb-6">
              <Button variant="outline" className="flex items-center gap-2 text-xs sm:text-sm">
                <Plus className="h-4 w-4" />
                Rechtsgrundlage hinzufügen
              </Button>
            </div>

            {/* Procedure options */}

            {/* AI Analysis */}
            <div className="border border-gray-200 rounded-lg p-4 bg-white mb-6">
              <div className="flex items-center mb-3">
                <div className="bg-primary/10 text-primary rounded-full p-1 px-3 text-sm font-medium flex items-center mr-2">
                  KI
                </div>
                <span className="font-medium text-base">Analyse</span>
              </div>
              <div className="flex items-start gap-2">
                <div>
                  <p className="text-sm font-medium">Rechtsgrundlage ist relevant</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Die Vergabe erfolgt nach der Unterschwellenvergabeordnung (UVgO). Die UVgO regelt die Vergabe
                    öffentlicher Liefer- und Dienstleistungsaufträge unterhalb der EU-Schwellenwerte. Im nationalen
                    Bereich, stellt sicher, dass Aufträge im Verfahren, die Eignung, Auftragsvergabe,
                    Angebotsbearbeitung, sowie Zuschlagserteilung.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center">
                <div className="rating-circle">
                  <div
                    className="rating-circle-inner"
                    style={{ background: "conic-gradient(#10b981 99%, #e5e7eb 0%)" }}
                  >
                    <div className="rating-circle-value">99%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handleBack}>
                Zurück
              </Button>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleContinue}>
                Zustimmen und weiter
              </Button>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="mb-6">
            {/* Simple text editor with just the title and content */}
            <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium">Vergabevermerksentwurf</h3>
              </div>
              <div className="p-4">
                {/* Replace the textarea with a rich text editor */}
                <div className="border border-gray-200 rounded mb-4">
                  <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50">
                    {/* Font size dropdown */}
                    <select
                      className="h-8 px-2 border border-gray-300 rounded text-sm bg-white editor-font-size"
                      onChange={(e) => executeCommand("fontSize", e.target.value)}
                    >
                      <option value="3">Normal (16px)</option>
                      <option value="1">Klein (12px)</option>
                      <option value="4">Mittel (18px)</option>
                      <option value="5">Groß (24px)</option>
                      <option value="7">Überschrift (36px)</option>
                    </select>

                    {/* Text formatting buttons */}
                    <div className="flex border border-gray-300 rounded overflow-hidden">
                      <button
                        className="h-8 w-8 flex items-center justify-center hover:bg-gray-100"
                        title="Bold"
                        onMouseDown={(e) => {
                          e.preventDefault()
                          executeCommand("bold")
                        }}
                      >
                        <span className="font-bold">B</span>
                      </button>
                      <button
                        className="h-8 w-8 flex items-center justify-center hover:bg-gray-100 border-l border-gray-300"
                        title="Italic"
                        onMouseDown={(e) => {
                          e.preventDefault()
                          executeCommand("italic")
                        }}
                      >
                        <span className="italic">I</span>
                      </button>
                      <button
                        className="h-8 w-8 flex items-center justify-center hover:bg-gray-100 border-l border-gray-300"
                        title="Underline"
                        onMouseDown={(e) => {
                          e.preventDefault()
                          executeCommand("underline")
                        }}
                      >
                        <span className="underline">U</span>
                      </button>
                    </div>

                    {/* Text alignment buttons */}
                    <div className="flex border border-gray-300 rounded overflow-hidden">
                      <button
                        className="h-8 w-8 flex items-center justify-center hover:bg-gray-100"
                        title="Align Left"
                        onMouseDown={(e) => {
                          e.preventDefault()
                          executeCommand("justifyLeft")
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="21" y1="6" x2="3" y2="6"></line>
                          <line x1="15" y1="12" x2="3" y2="12"></line>
                          <line x1="17" y1="18" x2="3" y2="18"></line>
                        </svg>
                      </button>
                      <button
                        className="h-8 w-8 flex items-center justify-center hover:bg-gray-100 border-l border-gray-300"
                        title="Align Center"
                        onMouseDown={(e) => {
                          e.preventDefault()
                          executeCommand("justifyCenter")
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="21" y1="6" x2="3" y2="6"></line>
                          <line x1="18" y1="12" x2="6" y2="12"></line>
                          <line x1="21" y1="18" x2="3" y2="18"></line>
                        </svg>
                      </button>
                      <button
                        className="h-8 w-8 flex items-center justify-center hover:bg-gray-100 border-l border-gray-300"
                        title="Align Right"
                        onMouseDown={(e) => {
                          e.preventDefault()
                          executeCommand("justifyRight")
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="21" y1="6" x2="3" y2="6"></line>
                          <line x1="21" y1="12" x2="9" y2="12"></line>
                          <line x1="21" y1="18" x2="3" y2="18"></line>
                        </svg>
                      </button>
                    </div>

                    {/* List buttons */}
                    <div className="flex border border-gray-300 rounded overflow-hidden">
                      <button
                        className="h-8 w-8 flex items-center justify-center hover:bg-gray-100"
                        title="Bullet List"
                        onMouseDown={(e) => {
                          e.preventDefault()
                          executeCommand("insertUnorderedList")
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="9" y1="6" x2="20" y2="6"></line>
                          <line x1="9" y1="12" x2="20" y2="12"></line>
                          <line x1="9" y1="18" x2="20" y2="18"></line>
                          <circle cx="4" cy="6" r="2"></circle>
                          <circle cx="4" cy="12" r="2"></circle>
                          <circle cx="4" cy="18" r="2"></circle>
                        </svg>
                      </button>
                      <button
                        className="h-8 w-8 flex items-center justify-center hover:bg-gray-100 border-l border-gray-300"
                        title="Numbered List"
                        onMouseDown={(e) => {
                          e.preventDefault()
                          executeCommand("insertOrderedList")
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="10" y1="6" x2="21" y2="6"></line>
                          <line x1="10" y1="12" x2="21" y2="12"></line>
                          <line x1="10" y1="18" x2="21" y2="18"></line>
                          <path d="M4 6h1v4"></path>
                          <path d="M4 10h2"></path>
                          <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
                        </svg>
                      </button>
                    </div>

                    {/* Indent buttons */}
                    <div className="flex border border-gray-300 rounded overflow-hidden">
                      <button
                        className="h-8 w-8 flex items-center justify-center hover:bg-gray-100"
                        title="Decrease Indent"
                        onMouseDown={(e) => {
                          e.preventDefault()
                          executeCommand("outdent")
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="21" y1="6" x2="11" y2="6"></line>
                          <line x1="21" y1="12" x2="11" y2="12"></line>
                          <line x1="21" y1="18" x2="11" y2="18"></line>
                          <path d="M7 8l-4 4 4 4"></path>
                        </svg>
                      </button>
                      <button
                        className="h-8 w-8 flex items-center justify-center hover:bg-gray-100 border-l border-gray-300"
                        title="Increase Indent"
                        onMouseDown={(e) => {
                          e.preventDefault()
                          executeCommand("indent")
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="21" y1="6" x2="11" y2="6"></line>
                          <line x1="21" y1="12" x2="11" y2="12"></line>
                          <line x1="21" y1="18" x2="11" y2="18"></line>
                          <path d="M3 8l4 4-4 4"></path>
                        </svg>
                      </button>
                    </div>

                    {/* Color picker */}
                    <div className="flex border border-gray-300 rounded overflow-hidden">
                      <div className="relative">
                        <button
                          className="h-8 px-2 flex items-center justify-center hover:bg-gray-100"
                          title="Text Color"
                          onMouseDown={(e) => {
                            e.preventDefault()
                            const colorPicker = document.getElementById("text-color-picker")
                            if (colorPicker) {
                              colorPicker.click()
                            }
                          }}
                        >
                          <span className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M9 3h6l3 7-6 11H9L3 10z"></path>
                              <path d="M9 3l-6 7 6 11"></path>
                            </svg>
                            <span className="ml-1">Farbe</span>
                          </span>
                        </button>
                        <input
                          type="color"
                          id="text-color-picker"
                          className="absolute opacity-0 w-0 h-0"
                          onChange={(e) => {
                            executeCommand("foreColor", e.target.value)
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Rich text editor content area */}
                  <div
                    className="p-4 min-h-[500px]"
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    dangerouslySetInnerHTML={{
                      __html: `<div style="font-size: 16px; line-height: 1.5;">
                        <p><strong>Vergabevermerk für das Projekt VG-2023-0042</strong></p>
                        <br>
                        <p><strong>Auftraggeber:</strong> Landeshauptstadt München</p>
                        <p><strong>Aktenzeichen:</strong> VG-2023-0042</p>
                        <p><strong>Auftragsgegenstand:</strong> Beschaffung von Büroausstattung</p>
                        <p><strong>Vergabeverfahren:</strong> Öffentliche Ausschreibung</p>
                        <br>
                        <p>Die Landeshauptstadt München hat die Beschaffung von Büroausstattung für die neue Verwaltungsstelle im Stadtbezirk Schwabing-West ausgeschrieben. Die Ausschreibung erfolgte im Rahmen eines offenen Verfahrens nach UVgO.</p>
                        <br>
                        <p>Die Vergabe erfolgte nach der Unterschwellenvergabeordnung (UVgO) im Wege einer öffentlichen Ausschreibung. Die Bekanntmachung wurde am 15.02.2023 veröffentlicht. Die Angebotsfrist endete am 15.04.2023 um 12:00 Uhr.</p>
                        <br>
                        <p><strong>Der Leistungsumfang umfasst:</strong></p>
                        <ul>
                          <li>Lieferung von 120 höhenverstellbaren Schreibtischen</li>
                          <li>Lieferung von 120 ergonomischen Bürostühlen</li>
                          <li>Lieferung und Montage von 40 Aktenschränken</li>
                          <li>Lieferung und Montage von 15 Besprechungstischen</li>
                          <li>Lieferung von 60 Besucherstühlen</li>
                        </ul>
                        <br>
                        <p><strong>Die Bewertung der Angebote erfolgte nach folgenden Kriterien:</strong></p>
                        <ul>
                          <li>Preis: 60%</li>
                          <li>Qualität: 30%</li>
                          <li>Lieferzeit: 10%</li>
                        </ul>
                      </div>`,
                    }}
                  />
                </div>

                {/* Add a note about the editor functionality */}
                <div className="text-xs text-gray-500 mt-2">
                  Hinweis: Verwenden Sie die Formatierungsoptionen in der Symbolleiste, um den Text zu formatieren.
                  Markieren Sie Text, um Formatierungen anzuwenden.
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handleBack}>
                Zurück
              </Button>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => setActiveStep(4)}
              >
                Zustimmen und weiter
              </Button>
            </div>
          </div>
        )
      case 4:
        return (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Vergabevermerk speichern</h2>
            <p className="text-gray-600 mb-6">Der Vergabevermerk wurde erfolgreich gespeichert.</p>

            {/* Success message and buttons */}
            <div className="border border-gray-200 rounded-lg p-6 bg-white mb-6">
              <div className="text-center mb-8">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">Vergabevermerk</h3>
                <p className="text-gray-600">Der Vermerk wurde gespeichert.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="flex items-center gap-2" onClick={handleDownloadPDF}>
                  <Download className="h-4 w-4" />
                  Vergabevermerk herunterladen
                </Button>

                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => (window.location.href = "/")}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Zurück zum Eingang
                </Button>
              </div>
            </div>

            {/* Additional information */}
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="flex items-center mb-3">
                <div className="bg-primary/10 text-primary rounded-full p-1 px-3 text-sm font-medium flex items-center mr-2">
                  KI
                </div>
                <span className="font-medium text-base">Analyse</span>
              </div>
              <p className="text-sm">
                Der Vergabevermerk wurde erfolgreich erstellt und gespeichert. Sie können den Vermerk jetzt
                herunterladen oder zum Eingang zurückkehren.
              </p>
              <div className="mt-4 flex items-center justify-center">
                <div className="rating-circle">
                  <div
                    className="rating-circle-inner"
                    style={{ background: "conic-gradient(#10b981 100%, #e5e7eb 0%)" }}
                  >
                    <div className="rating-circle-value">100%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  // Mock PDF source content
  const mockPdfSource = (
    <div className="bg-white border border-gray-200 rounded-md p-2 h-full flex flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-2">
        <div className="text-sm font-medium">UVgO Dokument</div>
        <div className="flex items-center space-x-1">
          <button className="p-1 hover:bg-gray-100 rounded-md">
            <FileSearch className="h-4 w-4 text-gray-500" />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded-md">
            <ArrowLeft className="h-4 w-4 text-gray-500" />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded-md">
            <ArrowRight className="h-4 w-4 text-gray-500" />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded-md">
            <Maximize className="h-4 w-4 text-gray-500" />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded-md">
            <Download className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-gray-50 p-2 text-sm">
        <div className="bg-white p-4 min-h-full shadow-sm">
          <h3 className="font-bold mb-2">Unterschwellenvergabeordnung (UVgO)</h3>
          <p className="mb-2">§ 9 Öffentliche Ausschreibung</p>
          <p className="text-gray-700 mb-4">
            Bei der öffentlichen Ausschreibung fordert der öffentliche Auftraggeber eine unbeschränkte Anzahl von
            Unternehmen öffentlich zur Abgabe von Angeboten auf. Jedes interessierte Unternehmen kann ein Angebot
            abgeben.
          </p>
          <p className="text-xs text-gray-500 mb-2">Seite 5 von 28</p>
        </div>
      </div>
    </div>
  )

  // Add a new state for the source dialog
  const [sourceDialogOpen, setSourceDialogOpen] = useState(false)
  const [currentSource, setCurrentSource] = useState<string | null>(null)

  // Add a function to open the source dialog
  const openSourceDialog = (source: string) => {
    setCurrentSource(source)
    setSourceDialogOpen(true)
  }

  // Add the following function to the component to handle text formatting commands
  // Add this after the openSourceDialog function and before the return statement

  // Function to handle rich text editor commands
  const executeCommand = (command: string, value: string | undefined = undefined) => {
    if (typeof document !== "undefined") {
      if (command === "fontSize") {
        // For font size, we need to ensure it's applied correctly
        document.execCommand(command, false, value)

        // Focus back on the editor to ensure changes are applied
        const editor = document.querySelector('[contenteditable="true"]')
        if (editor) {
          editor.focus()
        }
      } else {
        document.execCommand(command, false, value)
      }
    }
  }

  // Add a useEffect to initialize the editor with event handlers
  // Add this after the existing useEffect hooks
  useEffect(() => {
    if (isClient && activeStep === 3) {
      // Add event listeners to formatting buttons
      const formatButtons = document.querySelectorAll(".editor-toolbar button")
      formatButtons.forEach((button) => {
        button.addEventListener("mousedown", (e) => {
          e.preventDefault() // Prevent losing focus from the editor
        })
      })

      // Add event listener to font size dropdown
      const fontSizeSelect = document.querySelector(".editor-font-size")
      if (fontSizeSelect) {
        fontSizeSelect.addEventListener("change", (e) => {
          const target = e.target as HTMLSelectElement
          executeCommand("fontSize", target.value)
        })
      }
    }
  }, [isClient, activeStep])

  // Add event listeners for the color picker
  useEffect(() => {
    if (isClient && activeStep === 3) {
      const colorPicker = document.getElementById("text-color-picker")
      if (colorPicker) {
        colorPicker.addEventListener("change", (e) => {
          const target = e.target as HTMLInputElement
          executeCommand("foreColor", target.value)
        })
      }
    }
  }, [isClient, activeStep])

  // Add this useEffect to ensure font size changes are applied correctly
  useEffect(() => {
    if (isClient && activeStep === 3) {
      const editor = document.querySelector('[contenteditable="true"]')
      const fontSizeSelect = document.querySelector(".editor-font-size") as HTMLSelectElement

      if (editor && fontSizeSelect) {
        // Set initial font size
        fontSizeSelect.value = "3" // Default to normal size

        // Add click handler to ensure focus returns to editor after selecting font size
        fontSizeSelect.addEventListener("change", () => {
          setTimeout(() => {
            if (editor) {
              editor.focus()
            }
          }, 10)
        })
      }
    }
  }, [isClient, activeStep])

  // Function to handle downloading the Vergabevermerk as PDF
  const handleDownloadPDF = () => {
    // Get the content from the editor
    const editorContent = document.querySelector('[contenteditable="true"]')?.innerHTML || ""

    // Create a new window/document for printing
    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      alert("Bitte erlauben Sie Pop-ups für diese Seite, um den Download zu ermöglichen.")
      return
    }

    // Add content to the new window
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Vergabevermerk, Teil I</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.5;
              margin: 30px;
            }
            h1 {
              font-size: 18px;
              margin-bottom: 20px;
            }
            h2 {
              font-size: 16px;
              margin-top: 20px;
              margin-bottom: 10px;
            }
            p {
              margin-bottom: 10px;
            }
            ul, ol {
              margin-bottom: 10px;
              padding-left: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .footer {
              text-align: center;
              margin-top: 50px;
              font-size: 12px;
              color: #666;
            }
            @media print {
              body {
                margin: 0;
                padding: 20px;
              }
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Vergabevermerk, Teil I</h1>
            <p>Aktenzeichen: VG-2023-0042</p>
          </div>
          <div class="content">
            ${editorContent}
          </div>
          <div class="footer">
            <p>Erstellt am: ${new Date().toLocaleDateString("de-DE")}</p>
          </div>
          <div class="no-print">
            <p style="text-align: center; margin-top: 30px;">
              <button onclick="window.print(); setTimeout(() => window.close(), 500);" style="padding: 10px 20px; background-color: #0070f3; color: white; border: none; border-radius: 4px; cursor: pointer;">
                Als PDF speichern
              </button>
            </p>
          </div>
          <script>
            // Auto-trigger print dialog after a short delay
            setTimeout(() => {
              window.print();
              // Close the window after printing (or canceling)
              setTimeout(() => window.close(), 500);
            }, 1000);
          </script>
        </body>
      </html>
    `)

    printWindow.document.close()
  }

  return (
    <div suppressHydrationWarning className="flex flex-col md:flex-row h-screen overflow-hidden bg-background">
      {isClient && (
        <>
          {/* 1. Navigation - Left Sidebar */}
          <div
            className={`border-r border-sidebar-border flex-shrink-0 flex flex-col bg-sidebar text-sidebar-foreground overflow-y-auto transition-all duration-300 ease-in-out ${
              sidebarExpanded ? "w-64" : "w-16"
            }`}
          >
            <div className={`p-2 flex ${sidebarExpanded ? "justify-end" : "justify-center"}`}>
              <button
                onClick={toggleSidebar}
                className="p-1 rounded-md hover:bg-gray-100 text-gray-500"
                aria-label={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
              >
                {sidebarExpanded ? <ChevronRight className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-between py-4">
              {/* Top navigation items */}
              <div className="space-y-2 px-2">
                {topNavItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    onClick={item.onClick}
                    className={`flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 ${
                      sidebarExpanded ? "" : "justify-center"
                    } ${
                      (item.label === "Workflow" && workflowOpen) || (item.label === "Aktivitäten" && activitiesOpen)
                        ? "bg-gray-100"
                        : ""
                    }`}
                  >
                    <item.icon className="h-6 w-6 text-primary" />
                    {sidebarExpanded && <span>{item.label}</span>}
                  </Link>
                ))}
              </div>

              {/* Bottom navigation items */}
              <div className="space-y-2 px-2">
                {bottomNavItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className={`flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 ${
                      sidebarExpanded ? "" : "justify-center"
                    }`}
                  >
                    <item.icon className="h-6 w-6 text-primary" />
                    {sidebarExpanded && <span>{item.label}</span>}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Workflow Section - Appears when Workflow is clicked */}
          {workflowOpen && (
            <div className="w-64 border-r border-sidebar-border flex-shrink-0 flex flex-col bg-white overflow-y-auto">
              <div className="p-4 border-b border-sidebar-border">
                <h2 className="font-bold text-lg">Aufbereitung & Vergabevermerk</h2>
              </div>
              <div className="p-2 flex-1">
                <div className="space-y-1">
                  {workflowItems.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-50"
                    >
                      <item.icon className="h-5 w-5 text-primary" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Activities Section - Appears when Activities is clicked */}
          {activitiesOpen && (
            <div className="w-64 border-r border-sidebar-border flex-shrink-0 flex flex-col bg-white overflow-y-auto">
              <div className="p-4 border-b border-sidebar-border">
                <h2 className="font-bold text-lg">Aktuelle Aktivitäten</h2>
              </div>
              <div className="p-2 flex-1">
                <div className="space-y-3">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 hover:bg-gray-50 rounded-md">
                      <activity.icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm">{activity.text}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Main content wrapper - allows for stacking on mobile, side-by-side on larger screens */}
          <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
            {/* 2. Main Content - Configuration Section */}
            <div className="flex-1 flex flex-col overflow-hidden border-r border-sidebar-border">
              <div className="p-3 sm:p-4 border-b border-sidebar-border">
                <div className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2 overflow-x-auto whitespace-nowrap">
                  <span>VG-2023-0042 &gt; </span>
                  <span>Aufbereitung & Vergabevermerk &gt; </span>
                  <span className="font-medium text-gray-700">neuer Vergabevermerk</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold">Aufbereitung & Vergabevermerk</h1>
              </div>

              <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
                {/* Process Flow */}
                <div className="mb-8 border border-gray-200 rounded-lg p-4 md:p-6 bg-white">
                  <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Prozessablauf</h2>
                  <div className="flex flex-wrap md:flex-nowrap justify-between items-center relative">
                    {/* Process steps */}
                    {processSteps.map((step, index) => (
                      <div key={index} className="flex flex-col items-center z-10 w-full md:w-auto mb-4 md:mb-0">
                        <div
                          className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full border-2 ${
                            step.active
                              ? "border-primary bg-primary text-white"
                              : "border-gray-300 bg-white text-gray-500"
                          } font-bold text-base md:text-lg`}
                        >
                          {step.number}
                        </div>
                        <div className="text-center mt-1 md:mt-2">
                          <p className={`text-xs md:text-sm ${step.active ? "font-medium" : "text-gray-500"}`}>
                            {isMobile ? step.title.split(" ")[0] : step.title}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Connecting lines - hidden on small screens, visible on medium and up */}
                    <div className="hidden md:block absolute top-5 left-16 right-16 h-0.5 bg-gray-200 -z-0"></div>

                    {/* Alternative connecting lines for small screens */}
                    <div className="md:hidden absolute top-4 left-4 right-4 h-0.5 bg-gray-200 -z-0"></div>
                  </div>
                </div>

                {/* Step Content */}
                {renderStepContent()}
              </div>
            </div>

            {/* 3. Document Preview - Right Section */}
            <div className="lg:w-1/3 flex-shrink-0 flex flex-col overflow-hidden border-t lg:border-t-0 lg:border-l border-sidebar-border h-screen">
              <div className="flex-1 flex flex-col overflow-hidden h-full">
                {/* Document Preview */}
                <div className="flex-1 border-b border-gray-200 overflow-hidden flex flex-col">
                  <div className="p-3 sm:p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between flex-wrap">
                      {activeStep === 3 ? (
                        <>
                          <div className="font-medium text-sm sm:text-base mb-1 sm:mb-0">Vergabevermerk, Teil I</div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                            onClick={handleDownloadPDF}
                          >
                            <Download className="h-4 w-4" />
                            Herunterladen
                          </Button>
                        </>
                      ) : (
                        <>
                          <div className="font-medium text-sm sm:text-base mb-1 sm:mb-0">
                            {selectedDocument
                              ? selectedDocument.name
                              : activeStep === 2
                                ? "UVgO"
                                : "Keine Unterlage ausgewählt"}
                          </div>
                          {selectedDocument && "complete" in selectedDocument && (
                            <Badge variant={selectedDocument.complete ? "success" : "destructive"}>
                              {selectedDocument.complete ? "Vollständig" : "Unvollständig"}
                            </Badge>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <div
                    className="flex-1 p-3 sm:p-4 overflow-y-auto bg-gray-50"
                    style={{ maxHeight: "calc(100vh - 200px)" }}
                  >
                    {/* Document content */}
                    {activeStep === 2 ? (
                      <div className="prose prose-sm max-w-none">
                        <div className="mb-6">
                          <div className="flex items-center mb-3">
                            <div className="bg-primary/10 text-primary rounded-full p-1 px-3 text-sm font-medium flex items-center mr-2">
                              KI
                            </div>
                            <span className="font-medium text-base">Analyse</span>
                          </div>
                          <p className="text-sm font-medium">Rechtsgrundlage ist relevant</p>
                          <p className="text-sm text-gray-600 mt-1">
                            Die Vergabe erfolgt nach der Unterschwellenvergabeordnung (UVgO). Die UVgO regelt die
                            Vergabe öffentlicher Liefer- und Dienstleistungsaufträge unterhalb der EU-Schwellenwerte. Im
                            nationalen Bereich, stellt sicher, dass Aufträge im Verfahren, die Eignung, Auftragsvergabe,
                            Angebotsbearbeitung, sowie Zuschlagserteilung.
                          </p>

                          <div className="mt-4 flex items-center justify-center">
                            <div className="rating-circle">
                              <div
                                className="rating-circle-inner"
                                style={{ background: "conic-gradient(#10b981 99%, #e5e7eb 0%)" }}
                              >
                                <div className="rating-circle-value">99%</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <h3 className="text-lg font-medium mb-4">Anforderungen an Vergabeverfahren gemäß UVgO</h3>
                        <div className="space-y-4">
                          {/* Collapsible requirement items */}
                          <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
                            <div
                              className="flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                              onClick={() => toggleProcedureOptionExpanded("procedureType")}
                            >
                              <div className="flex-1 font-medium">Verfahrensart</div>
                              <ChevronDown
                                className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${procedureOptions.procedureType.expanded ? "rotate-180" : ""}`}
                              />
                            </div>
                            <div
                              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                procedureOptions.procedureType.expanded ? "max-h-40" : "max-h-0"
                              }`}
                            >
                              <div className="p-4 pt-0 text-sm text-gray-600 border-t border-gray-100">
                                <div className="flex justify-between items-start">
                                  <div>
                                    Dieses Vergabeverfahren wird als öffentliche Ausschreibung gemäß § 9 Abs. 1
                                    Unterschwellenvergabeordnung (UVgO) geführt.
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="ml-2 flex-shrink-0"
                                    onClick={() => openSourceDialog("procedureType")}
                                  >
                                    <FileSearch className="h-4 w-4 mr-1" /> Quelle
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
                            <div
                              className="flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                              onClick={() => toggleProcedureOptionExpanded("applicableLaw")}
                            >
                              <div className="flex-1 font-medium">Angewendetes Recht</div>
                              <ChevronDown
                                className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${procedureOptions.applicableLaw.expanded ? "rotate-180" : ""}`}
                              />
                            </div>
                            <div
                              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                procedureOptions.applicableLaw.expanded ? "max-h-40" : "max-h-0"
                              }`}
                            >
                              <div className="p-4 pt-0 text-sm text-gray-600 border-t border-gray-100">
                                <div className="flex justify-between items-start">
                                  <div>Die Vergabe erfolgt nach der Unterschwellenvergabeordnung (UVgO).</div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="ml-2 flex-shrink-0"
                                    onClick={() => openSourceDialog("applicableLaw")}
                                  >
                                    <FileSearch className="h-4 w-4 mr-1" /> Quelle
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
                            <div
                              className="flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                              onClick={() => toggleProcedureOptionExpanded("provisionOfDocuments")}
                            >
                              <div className="flex-1 font-medium">Bereitstellung der Vergabeunterlagen</div>
                              <ChevronDown
                                className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${procedureOptions.provisionOfDocuments.expanded ? "rotate-180" : ""}`}
                              />
                            </div>
                            <div
                              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                procedureOptions.provisionOfDocuments.expanded ? "max-h-40" : "max-h-0"
                              }`}
                            >
                              <div className="p-4 pt-0 text-sm text-gray-600 border-t border-gray-100">
                                <div className="flex justify-between items-start">
                                  <div>Die Vergabeunterlagen werden elektronisch zur Verfügung gestellt.</div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="ml-2 flex-shrink-0"
                                    onClick={() => openSourceDialog("provisionOfDocuments")}
                                  >
                                    <FileSearch className="h-4 w-4 mr-1" /> Quelle
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
                            <div
                              className="flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                              onClick={() => toggleProcedureOptionExpanded("electronicProcurement")}
                            >
                              <div className="flex-1 font-medium">Elektronische Vergabe</div>
                              <ChevronDown
                                className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${procedureOptions.electronicProcurement.expanded ? "rotate-180" : ""}`}
                              />
                            </div>
                            <div
                              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                procedureOptions.electronicProcurement.expanded ? "max-h-40" : "max-h-0"
                              }`}
                            >
                              <div className="p-4 pt-0 text-sm text-gray-600 border-t border-gray-100">
                                <div className="flex justify-between items-start">
                                  <div>Die Angebote sind elektronisch einzureichen.</div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="ml-2 flex-shrink-0"
                                    onClick={() => openSourceDialog("electronicProcurement")}
                                  >
                                    <FileSearch className="h-4 w-4 mr-1" /> Quelle
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
                            <div
                              className="flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                              onClick={() => toggleProcedureOptionExpanded("bidDeadline")}
                            >
                              <div className="flex-1 font-medium">Angebotsfrist</div>
                              <ChevronDown
                                className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${procedureOptions.bidDeadline.expanded ? "rotate-180" : ""}`}
                              />
                            </div>
                            <div
                              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                procedureOptions.bidDeadline.expanded ? "max-h-40" : "max-h-0"
                              }`}
                            >
                              <div className="p-4 pt-0 text-sm text-gray-600 border-t border-gray-100">
                                <div className="flex justify-between items-start">
                                  <div>Die Angebotsfrist beträgt 14 Tage.</div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="ml-2 flex-shrink-0"
                                    onClick={() => openSourceDialog("bidDeadline")}
                                  >
                                    <FileSearch className="h-4 w-4 mr-1" /> Quelle
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Add legal basis button */}
                        <div className="mt-6 border border-gray-200 rounded-lg p-4 bg-white">
                          <div className="flex items-center mb-3">
                            <div className="bg-primary/10 text-primary rounded-full p-1 px-3 text-sm font-medium flex items-center mr-2">
                              KI
                            </div>
                            <span className="font-medium text-base">UVgO - Unterschwellenvergabeordnung</span>
                          </div>
                          <div className="prose prose-sm max-w-none text-sm">
                            <div className="border-b pb-2 mb-2">
                              <p className="font-medium">§ 1 Anwendungsbereich</p>
                              <p className="text-gray-700">
                                (1) Diese Verfahrensordnung gilt für die Vergabe öffentlicher Liefer- und
                                Dienstleistungsaufträge unterhalb der EU-Schwellenwerte.
                              </p>
                              <p className="text-gray-700">
                                (2) Diese Verfahrensordnung ist von öffentlichen Auftraggebern im Sinne des § 99 des
                                Gesetzes gegen Wettbewerbsbeschränkungen (GWB) anzuwenden.
                              </p>
                            </div>

                            <div className="border-b pb-2 mb-2">
                              <p className="font-medium">§ 2 Grundsätze der Vergabe</p>
                              <p className="text-gray-700">
                                (1) Öffentliche Aufträge werden im Wettbewerb und im Wege transparenter Verfahren
                                vergeben. Dabei werden die Grundsätze der Wirtschaftlichkeit und der Verhältnismäßigkeit
                                gewahrt.
                              </p>
                              <p className="text-gray-700">
                                (2) Die Teilnehmer an einem Vergabeverfahren sind gleich zu behandeln, es sei denn, eine
                                Ungleichbehandlung ist aufgrund des GWB ausdrücklich geboten oder gestattet.
                              </p>
                            </div>

                            <div className="border-b pb-2 mb-2">
                              <p className="font-medium">§ 8 Verfahrensarten</p>
                              <p className="text-gray-700">
                                (1) Die Vergabe von öffentlichen Aufträgen erfolgt im offenen Verfahren, im nicht
                                offenen Verfahren mit Teilnahmewettbewerb, im Verhandlungsverfahren mit oder ohne
                                Teilnahmewettbewerb, im wettbewerblichen Dialog oder in der Innovationspartnerschaft.
                              </p>
                              <p className="text-gray-700">
                                (2) Dem Auftraggeber stehen die öffentliche Ausschreibung und die beschränkte
                                Ausschreibung mit Teilnahmewettbewerb nach seiner Wahl zur Verfügung. Die anderen
                                Verfahrensarten stehen nur zur Verfügung, soweit dies nach den Absätzen 3 und 4
                                gestattet ist.
                              </p>
                            </div>

                            <div className="border-b pb-2 mb-2">
                              <p className="font-medium">§ 9 Öffentliche Ausschreibung</p>
                              <p className="text-gray-700">
                                Bei einer öffentlichen Ausschreibung fordert der öffentliche Auftraggeber eine
                                unbeschränkte Anzahl von Unternehmen öffentlich zur Abgabe von Angeboten auf. Jedes
                                interessierte Unternehmen kann ein Angebot abgeben.
                              </p>
                            </div>

                            <div className="border-b pb-2 mb-2">
                              <p className="font-medium">§ 21 Fristen für öffentliche Ausschreibungen</p>
                              <p className="text-gray-700">
                                (1) Der öffentliche Auftraggeber legt angemessene Fristen für den Eingang der Angebote
                                und der Anträge auf Teilnahme fest.
                              </p>
                              <p className="text-gray-700">
                                (2) Bei öffentlichen Ausschreibungen beträgt die Angebotsfrist mindestens 20
                                Kalendertage ab dem Tag nach der Veröffentlichung der Auftragsbekanntmachung.
                              </p>
                            </div>

                            <div>
                              <p className="font-medium">§ 43 Zuschlag und Zuschlagskriterien</p>
                              <p className="text-gray-700">
                                (1) Der Zuschlag wird auf das wirtschaftlichste Angebot erteilt.
                              </p>
                              <p className="text-gray-700">
                                (2) Die Ermittlung des wirtschaftlichsten Angebots erfolgt auf der Grundlage des besten
                                Preis-Leistungs-Verhältnisses. Neben dem Preis oder den Kosten können auch qualitative,
                                umweltbezogene oder soziale Zuschlagskriterien berücksichtigt werden.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : activeStep === 3 ? (
                      <div className="prose prose-sm max-w-none">
                        <h1>Vergabevermerk, Teil I</h1>
                        <p>
                          <strong>Projekt:</strong> Büroausstattung Verwaltungsstelle München
                        </p>
                        <p>
                          <strong>Aktenzeichen:</strong> VG-2023-0042
                        </p>
                        <p>
                          <strong>Datum:</strong> 05.05.2023
                        </p>

                        <h2>1. Verfahrensart</h2>
                        <p>Die Vergabe erfolgt im Wege einer öffentlichen Ausschreibung gemäß § 9 UVgO.</p>

                        <h2>2. Auftragsgegenstand</h2>
                        <p>
                          Gegenstand der Ausschreibung ist die Lieferung und Montage von Büroausstattung für die neue
                          Verwaltungsstelle im Stadtbezirk Schwabing-West, bestehend aus:
                        </p>
                        <ul>
                          <li>120 höhenverstellbaren Schreibtischen</li>
                          <li>120 ergonomischen Bürostühlen</li>
                          <li>40 Aktenschränken</li>
                          <li>15 Besprechungstischen</li>
                          <li>60 Besucherstühlen</li>
                        </ul>

                        <h2>3. Bekanntmachung</h2>
                        <p>Die Bekanntmachung erfolgte am 15.02.2023 auf der Vergabeplattform.</p>

                        <h2>4. Angebotsfrist</h2>
                        <p>Die Angebotsfrist endete am 15.04.2023 um 12:00 Uhr.</p>

                        <h2>5. Vergabekriterien</h2>
                        <p>Die Bewertung der Angebote erfolgt nach folgenden Kriterien:</p>
                        <ul>
                          <li>Preis: 60%</li>
                          <li>Qualität: 30%</li>
                          <li>Lieferzeit: 10%</li>
                        </ul>
                      </div>
                    ) : activeStep === 4 ? (
                      <div className="prose prose-sm max-w-none">
                        <h1>Vergabevermerk, Teil I</h1>
                        <p>
                          <strong>Projekt:</strong> Büroausstattung Verwaltungsstelle München
                        </p>
                        <p>
                          <strong>Aktenzeichen:</strong> VG-2023-0042
                        </p>
                        <p>
                          <strong>Datum:</strong> {new Date().toLocaleDateString("de-DE")}
                        </p>

                        <h2>1. Verfahrensart</h2>
                        <p>Die Vergabe erfolgt im Wege einer öffentlichen Ausschreibung gemäß § 9 UVgO.</p>

                        <h2>2. Auftragsgegenstand</h2>
                        <p>
                          Gegenstand der Ausschreibung ist die Lieferung und Montage von Büroausstattung für die neue
                          Verwaltungsstelle im Stadtbezirk Schwabing-West, bestehend aus:
                        </p>
                        <ul>
                          <li>120 höhenverstellbaren Schreibtischen</li>
                          <li>120 ergonomischen Bürostühlen</li>
                          <li>40 Aktenschränken</li>
                          <li>15 Besprechungstischen</li>
                          <li>60 Besucherstühlen</li>
                        </ul>

                        <h2>3. Bekanntmachung</h2>
                        <p>Die Bekanntmachung erfolgte am 15.02.2023 auf der Vergabeplattform.</p>

                        <h2>4. Angebotsfrist</h2>
                        <p>Die Angebotsfrist endete am 15.04.2023 um 12:00 Uhr.</p>

                        <h2>5. Vergabekriterien</h2>
                        <p>Die Bewertung der Angebote erfolgt nach folgenden Kriterien:</p>
                        <ul>
                          <li>Preis: 60%</li>
                          <li>Qualität: 30%</li>
                          <li>Lieferzeit: 10%</li>
                        </ul>

                        <h2>6. Zuschlagserteilung</h2>
                        <p>
                          Nach Prüfung und Bewertung aller eingegangenen Angebote wird der Zuschlag an die Firma Office
                          Solutions AG erteilt, die mit 89,60 Punkten das wirtschaftlichste Angebot abgegeben hat.
                        </p>

                        <div className="mt-8 text-right">
                          <p>München, den {new Date().toLocaleDateString("de-DE")}</p>
                          <p className="mt-8">____________________________</p>
                          <p>Unterschrift</p>
                        </div>
                      </div>
                    ) : selectedDocument ? (
                      <div
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{
                          __html:
                            documentContents[selectedDocument.id as keyof typeof documentContents]?.content ||
                            "<p>Keine Inhalte verfügbar</p>",
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <p>Bitte wählen Sie eine Unterlage aus der Liste aus</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Analysis */}
                {activeStep === 1 && (
                  <div className="p-4 border-t border-gray-200">
                    <div className="border border-gray-200 rounded-lg p-4 bg-white">
                      <div className="flex items-center mb-3">
                        <div className="bg-primary/10 text-primary rounded-full p-1 px-3 text-sm font-medium flex items-center mr-2">
                          KI
                        </div>
                        <span className="font-medium text-base">Analyse</span>
                      </div>
                      {selectedDocument && "complete" in selectedDocument ? (
                        <>
                          <p className="text-sm">
                            {selectedDocument.complete
                              ? "Unterlage ist formal vollständig."
                              : "Unterlage ist unvollständig. Bitte überprüfen Sie die fehlenden Informationen."}
                          </p>
                          {!selectedDocument.complete && (
                            <div className="mt-2 flex items-start gap-2">
                              <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                              <p className="text-sm text-amber-700">Diese Unterlage benötigt Ihre Aufmerksamkeit.</p>
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="text-sm">Wählen Sie eine Unterlage aus, um die Analyse zu sehen.</p>
                      )}

                      <div className="mt-4 flex items-center justify-center">
                        <div className="rating-circle">
                          <div
                            className="rating-circle-inner"
                            style={{
                              background:
                                selectedDocument && "complete" in selectedDocument
                                  ? `conic-gradient(#10b981 ${getDocumentCompletionPercentage(selectedDocument)}%, #e5e7eb 0%)`
                                  : "conic-gradient(#e5e7eb 100%, #e5e7eb 0%)",
                            }}
                          >
                            <div className="rating-circle-value">
                              {selectedDocument && "complete" in selectedDocument
                                ? getDocumentCompletionPercentage(selectedDocument)
                                : 0}
                              %
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Unterlagen löschen</AlertDialogTitle>
                <AlertDialogDescription>
                  Möchten Sie wirklich {selectedCount} {selectedCount === 1 ? "Unterlage" : "Unterlagen"} löschen? Diese
                  Aktion kann nicht rückgängig gemacht werden.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                <AlertDialogAction onClick={deleteSelectedDocuments}>Löschen</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Add Document Dialog */}
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Neue Unterlage hinzufügen</DialogTitle>
                <DialogDescription>Bitte geben Sie die Informationen für die neue Unterlage ein.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="doc-id" className="text-right">
                    ID
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="doc-id"
                      placeholder="z.B. 07_VE"
                      value={newDocument.id}
                      onChange={(e) => {
                        setNewDocument({ ...newDocument, id: e.target.value })
                        if (formErrors.id) {
                          setFormErrors({ ...formErrors, id: undefined })
                        }
                      }}
                      className={formErrors.id ? "border-red-500" : ""}
                    />
                    {formErrors.id && <p className="text-red-500 text-xs mt-1">{formErrors.id}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="doc-name" className="text-right">
                    Name
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="doc-name"
                      placeholder="Name der Unterlage"
                      value={newDocument.name}
                      onChange={(e) => {
                        setNewDocument({ ...newDocument, name: e.target.value })
                        if (formErrors.name) {
                          setFormErrors({ ...formErrors, name: undefined })
                        }
                      }}
                      className={formErrors.name ? "border-red-500" : ""}
                    />
                    {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="doc-description" className="text-right">
                    Beschreibung
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="doc-description"
                      placeholder="Beschreibung der Unterlage"
                      value={newDocument.description}
                      onChange={(e) => {
                        setNewDocument({ ...newDocument, description: e.target.value })
                        if (formErrors.description) {
                          setFormErrors({ ...formErrors, description: undefined })
                        }
                      }}
                      className={formErrors.description ? "border-red-500" : ""}
                    />
                    {formErrors.description && <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="doc-filesize" className="text-right">
                    Dateigröße
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="doc-filesize"
                      placeholder="z.B. 1.2 MB"
                      value={newDocument.fileSize}
                      onChange={(e) => {
                        setNewDocument({ ...newDocument, fileSize: e.target.value })
                      }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="doc-status" className="text-right">
                    Vollständigkeit
                  </Label>
                  <div className="flex items-center gap-2 col-span-3">
                    <Checkbox
                      id="doc-status"
                      checked={newDocument.complete}
                      onCheckedChange={(checked) => {
                        if (typeof checked === "boolean") {
                          setNewDocument({ ...newDocument, complete: checked })
                        }
                      }}
                    />
                    <Label htmlFor="doc-status" className="cursor-pointer">
                      Vollständig
                    </Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                  Abbrechen
                </Button>
                <Button onClick={handleAddDocument}>Hinzufügen</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Source Document Dialog */}
          <Dialog open={sourceDialogOpen} onOpenChange={setSourceDialogOpen}>
            <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>
                  {currentSource === "procedureType" && "Verfahrensart - Quelle"}
                  {currentSource === "applicableLaw" && "Angewendetes Recht - Quelle"}
                  {currentSource === "provisionOfDocuments" && "Bereitstellung der Vergabeunterlagen - Quelle"}
                  {currentSource === "electronicProcurement" && "Elektronische Vergabe - Quelle"}
                  {currentSource === "bidDeadline" && "Angebotsfrist - Quelle"}
                </DialogTitle>
                <DialogDescription>UVgO - Unterschwellenvergabeordnung</DialogDescription>
              </DialogHeader>
              <div className="flex-1 overflow-auto bg-white p-4 border border-gray-200 rounded-md">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-4">
                  <div className="text-sm font-medium">UVgO Dokument</div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <FileSearch className="h-4 w-4 mr-1" /> Suchen
                    </Button>
                    <Button variant="outline" size="sm">
                      <ArrowLeft className="h-4 w-4 mr-1" /> Zurück
                    </Button>
                    <Button variant="outline" size="sm">
                      <ArrowRight className="h-4 w-4 mr-1" /> Weiter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" /> Herunterladen
                    </Button>
                  </div>
                </div>
                <div className="bg-white p-6 min-h-[500px] shadow-sm border border-gray-100 rounded-md">
                  <h2 className="text-xl font-bold mb-4">Unterschwellenvergabeordnung (UVgO)</h2>

                  {currentSource === "procedureType" && (
                    <>
                      <h3 className="text-lg font-semibold mb-3">§ 9 Öffentliche Ausschreibung</h3>
                      <p className="mb-4">
                        Bei der öffentlichen Ausschreibung fordert der öffentliche Auftraggeber eine unbeschränkte
                        Anzahl von Unternehmen öffentlich zur Abgabe von Angeboten auf. Jedes interessierte Unternehmen
                        kann ein Angebot abgeben.
                      </p>
                      <p className="mb-4">
                        Die öffentliche Ausschreibung ist das Standardverfahren für Vergaben unterhalb der
                        EU-Schwellenwerte und soll den größtmöglichen Wettbewerb sicherstellen.
                      </p>
                    </>
                  )}

                  {currentSource === "applicableLaw" && (
                    <>
                      <h3 className="text-lg font-semibold mb-3">§ 1 Anwendungsbereich</h3>
                      <p className="mb-4">
                        (1) Diese Verfahrensordnung gilt für die Vergabe öffentlicher Liefer- und
                        Dienstleistungsaufträge unterhalb der EU-Schwellenwerte.
                      </p>
                      <p className="mb-4">
                        (2) Diese Verfahrensordnung ist von öffentlichen Auftraggebern im Sinne des § 99 des Gesetzes
                        gegen Wettbewerbsbeschränkungen (GWB) anzuwenden.
                      </p>
                    </>
                  )}

                  {currentSource === "provisionOfDocuments" && (
                    <>
                      <h3 className="text-lg font-semibold mb-3">§ 29 Bereitstellung der Vergabeunterlagen</h3>
                      <p className="mb-4">
                        (1) Der öffentliche Auftraggeber gibt in der Auftragsbekanntmachung oder der Aufforderung zur
                        Interessensbestätigung eine elektronische Adresse an, unter der die Vergabeunterlagen
                        unentgeltlich, uneingeschränkt, vollständig und direkt abgerufen werden können.
                      </p>
                      <p className="mb-4">
                        (2) Der öffentliche Auftraggeber kann die Vergabeunterlagen auf einem anderen geeigneten Weg
                        übermitteln, wenn die erforderlichen elektronischen Mittel zum Abruf der Vergabeunterlagen nicht
                        verfügbar sind.
                      </p>
                    </>
                  )}

                  {currentSource === "electronicProcurement" && (
                    <>
                      <h3 className="text-lg font-semibold mb-3">§ 38 Elektronische Kommunikation</h3>
                      <p className="mb-4">
                        (1) Die Kommunikation zwischen dem öffentlichen Auftraggeber und den Unternehmen erfolgt
                        grundsätzlich mündlich oder elektronisch.
                      </p>
                      <p className="mb-4">
                        (2) Der öffentliche Auftraggeber kann vorgeben, dass Angebote in Textform nach § 126b des
                        Bürgerlichen Gesetzbuchs mithilfe elektronischer Mittel einzureichen sind.
                      </p>
                      <p className="mb-4">
                        (3) Der öffentliche Auftraggeber kann von jedem Unternehmen die Angabe einer eindeutigen
                        Unternehmensbezeichnung sowie einer elektronischen Adresse verlangen (Registrierung).
                      </p>
                    </>
                  )}

                  {currentSource === "bidDeadline" && (
                    <>
                      <h3 className="text-lg font-semibold mb-3">§ 21 Fristen für öffentliche Ausschreibungen</h3>
                      <p className="mb-4">
                        (1) Der öffentliche Auftraggeber legt angemessene Fristen für den Eingang der Angebote und der
                        Anträge auf Teilnahme fest.
                      </p>
                      <p className="mb-4">
                        (2) Bei öffentlichen Ausschreibungen beträgt die Angebotsfrist mindestens 20 Kalendertage ab dem
                        Tag nach der Veröffentlichung der Auftragsbekanntmachung.
                      </p>
                      <p className="mb-4">
                        (3) Die Angebotsfrist kann auf zehn Kalendertage ab dem Tag nach der Veröffentlichung der
                        Auftragsbekanntmachung verkürzt werden, wenn eine hinreichend begründete Dringlichkeit dies
                        rechtfertigt.
                      </p>
                    </>
                  )}

                  <div className="mt-8 text-sm text-gray-500">
                    <p>Quelle: Unterschwellenvergabeordnung (UVgO) vom 2. Februar 2017</p>
                    <p>
                      Seite{" "}
                      {currentSource === "procedureType"
                        ? "5"
                        : currentSource === "applicableLaw"
                          ? "1"
                          : currentSource === "provisionOfDocuments"
                            ? "12"
                            : currentSource === "electronicProcurement"
                              ? "15"
                              : "9"}{" "}
                      von 28
                    </p>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <style jsx global>{`
  .rating-circle {
    width: 60px;
    height: 60px;
    position: relative;
    margin: 0 auto;
  }

  .rating-circle-inner {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: conic-gradient(#10b981 var(--percentage, 0%), #e5e7eb 0%);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .rating-circle-inner::before {
    content: "";
    position: absolute;
    inset: 4px;
    border-radius: 50%;
    background: white;
  }

  .rating-circle-value {
    position: relative;
    z-index: 1;
    font-weight: bold;
    font-size: 1rem;
    color: #10b981;
  }
`}</style>
        </>
      )}
    </div>
  )
}

