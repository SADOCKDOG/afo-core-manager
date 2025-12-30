import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function ArchitectureDiagrams() {
  return (
    <Tabs defaultValue="component" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="component">Componentes</TabsTrigger>
        <TabsTrigger value="data">Flujo de Datos</TabsTrigger>
        <TabsTrigger value="workflow">Workflows</TabsTrigger>
      </TabsList>

      <TabsContent value="component">
        <ScrollArea className="h-[500px]">
          <Card>
            <CardHeader>
              <CardTitle>Arquitectura de Componentes</CardTitle>
            </CardHeader>
            <CardContent>
              <svg viewBox="0 0 800 600" className="w-full">
                <rect x="20" y="20" width="760" height="80" fill="oklch(0.52 0.18 250)" rx="8"/>
                <text x="400" y="65" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">App.tsx (Root)</text>

                <rect x="20" y="130" width="180" height="60" fill="oklch(0.68 0.19 40)" rx="6"/>
                <text x="110" y="165" textAnchor="middle" fill="black" fontSize="14" fontWeight="600">Dashboard</text>

                <rect x="220" y="130" width="180" height="60" fill="oklch(0.68 0.19 40)" rx="6"/>
                <text x="310" y="165" textAnchor="middle" fill="black" fontSize="14" fontWeight="600">ProjectDetail</text>

                <rect x="420" y="130" width="180" height="60" fill="oklch(0.68 0.19 40)" rx="6"/>
                <text x="510" y="165" textAnchor="middle" fill="black" fontSize="14" fontWeight="600">ClientManager</text>

                <rect x="620" y="130" width="160" height="60" fill="oklch(0.68 0.19 40)" rx="6"/>
                <text x="700" y="165" textAnchor="middle" fill="black" fontSize="14" fontWeight="600">InvoiceManager</text>

                <line x1="110" y1="100" x2="110" y2="130" stroke="white" strokeWidth="2"/>
                <line x1="310" y1="100" x2="310" y2="130" stroke="white" strokeWidth="2"/>
                <line x1="510" y1="100" x2="510" y2="130" stroke="white" strokeWidth="2"/>
                <line x1="700" y1="100" x2="700" y2="130" stroke="white" strokeWidth="2"/>

                <rect x="20" y="220" width="150" height="50" fill="oklch(0.60 0.18 180)" rx="6"/>
                <text x="95" y="250" textAnchor="middle" fill="white" fontSize="12">DocumentManager</text>

                <rect x="190" y="220" width="150" height="50" fill="oklch(0.60 0.18 180)" rx="6"/>
                <text x="265" y="250" textAnchor="middle" fill="white" fontSize="12">BudgetManager</text>

                <rect x="360" y="220" width="150" height="50" fill="oklch(0.60 0.18 180)" rx="6"/>
                <text x="435" y="250" textAnchor="middle" fill="white" fontSize="12">ApprovalFlowManager</text>

                <rect x="530" y="220" width="150" height="50" fill="oklch(0.60 0.18 180)" rx="6"/>
                <text x="605" y="250" textAnchor="middle" fill="white" fontSize="12">ComplianceChecker</text>

                <line x1="310" y1="190" x2="95" y2="220" stroke="oklch(0.60 0.18 180)" strokeWidth="2"/>
                <line x1="310" y1="190" x2="265" y2="220" stroke="oklch(0.60 0.18 180)" strokeWidth="2"/>
                <line x1="310" y1="190" x2="435" y2="220" stroke="oklch(0.60 0.18 180)" strokeWidth="2"/>
                <line x1="310" y1="190" x2="605" y2="220" stroke="oklch(0.60 0.18 180)" strokeWidth="2"/>

                <rect x="20" y="300" width="180" height="50" fill="oklch(0.24 0.025 250)" rx="6"/>
                <text x="110" y="330" textAnchor="middle" fill="white" fontSize="12">useKV (Persistencia)</text>

                <rect x="220" y="300" width="180" height="50" fill="oklch(0.24 0.025 250)" rx="6"/>
                <text x="310" y="330" textAnchor="middle" fill="white" fontSize="12">spark.llm (IA)</text>

                <rect x="420" y="300" width="180" height="50" fill="oklch(0.24 0.025 250)" rx="6"/>
                <text x="510" y="330" textAnchor="middle" fill="white" fontSize="12">Email Service</text>

                <rect x="620" y="300" width="160" height="50" fill="oklch(0.24 0.025 250)" rx="6"/>
                <text x="700" y="330" textAnchor="middle" fill="white" fontSize="12">PDF Export</text>

                <line x1="110" y1="270" x2="110" y2="300" stroke="oklch(0.24 0.025 250)" strokeWidth="2" strokeDasharray="4"/>
                <line x1="310" y1="270" x2="310" y2="300" stroke="oklch(0.24 0.025 250)" strokeWidth="2" strokeDasharray="4"/>
                <line x1="510" y1="270" x2="510" y2="300" stroke="oklch(0.24 0.025 250)" strokeWidth="2" strokeDasharray="4"/>
                <line x1="700" y1="270" x2="700" y2="300" stroke="oklch(0.24 0.025 250)" strokeWidth="2" strokeDasharray="4"/>

                <rect x="250" y="380" width="300" height="60" fill="oklch(0.17 0.018 250)" stroke="oklch(0.52 0.18 250)" strokeWidth="2" rx="6"/>
                <text x="400" y="415" textAnchor="middle" fill="oklch(0.96 0.008 70)" fontSize="14" fontWeight="600">shadcn/ui Components</text>

                <rect x="20" y="460" width="760" height="60" fill="oklch(0.21 0.018 250)" rx="6"/>
                <text x="400" y="495" textAnchor="middle" fill="oklch(0.96 0.008 70)" fontSize="16" fontWeight="bold">React 19 + TypeScript + Vite + Tailwind CSS</text>
              </svg>
            </CardContent>
          </Card>
        </ScrollArea>
      </TabsContent>

      <TabsContent value="data">
        <ScrollArea className="h-[500px]">
          <Card>
            <CardHeader>
              <CardTitle>Flujo de Datos</CardTitle>
            </CardHeader>
            <CardContent>
              <svg viewBox="0 0 800 600" className="w-full">
                <rect x="300" y="20" width="200" height="60" fill="oklch(0.52 0.18 250)" rx="8"/>
                <text x="400" y="55" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">Usuario Interactúa</text>

                <path d="M 400 80 L 400 120" stroke="oklch(0.68 0.19 40)" strokeWidth="3" markerEnd="url(#arrowhead)"/>

                <rect x="300" y="120" width="200" height="60" fill="oklch(0.68 0.19 40)" rx="8"/>
                <text x="400" y="155" textAnchor="middle" fill="black" fontSize="14" fontWeight="600">Componente UI</text>

                <path d="M 400 180 L 400 220" stroke="oklch(0.60 0.18 180)" strokeWidth="3" markerEnd="url(#arrowhead)"/>

                <rect x="300" y="220" width="200" height="60" fill="oklch(0.60 0.18 180)" rx="8"/>
                <text x="400" y="240" textAnchor="middle" fill="white" fontSize="13">Event Handler</text>
                <text x="400" y="260" textAnchor="middle" fill="white" fontSize="11">(onClick, onSubmit)</text>

                <path d="M 400 280 L 400 320" stroke="oklch(0.55 0.20 250)" strokeWidth="3" markerEnd="url(#arrowhead)"/>

                <rect x="300" y="320" width="200" height="60" fill="oklch(0.55 0.20 250)" rx="8"/>
                <text x="400" y="340" textAnchor="middle" fill="white" fontSize="13">State Update</text>
                <text x="400" y="360" textAnchor="middle" fill="white" fontSize="11">(useState/useKV)</text>

                <path d="M 300 350 L 150 410" stroke="oklch(0.24 0.025 250)" strokeWidth="3" markerEnd="url(#arrowhead)"/>
                <path d="M 500 350 L 650 410" stroke="oklch(0.65 0.16 300)" strokeWidth="3" markerEnd="url(#arrowhead)"/>

                <rect x="50" y="410" width="200" height="60" fill="oklch(0.24 0.025 250)" rx="8"/>
                <text x="150" y="430" textAnchor="middle" fill="white" fontSize="13">Persistencia</text>
                <text x="150" y="450" textAnchor="middle" fill="white" fontSize="11">(spark.kv)</text>

                <rect x="550" y="410" width="200" height="60" fill="oklch(0.65 0.16 300)" rx="8"/>
                <text x="650" y="430" textAnchor="middle" fill="white" fontSize="13">Servicios Externos</text>
                <text x="650" y="450" textAnchor="middle" fill="white" fontSize="11">(LLM, Email, PDF)</text>

                <path d="M 150 470 L 300 520" stroke="oklch(0.24 0.025 250)" strokeWidth="3" markerEnd="url(#arrowhead)"/>
                <path d="M 650 470 L 500 520" stroke="oklch(0.65 0.16 300)" strokeWidth="3" markerEnd="url(#arrowhead)"/>

                <rect x="300" y="520" width="200" height="60" fill="oklch(0.52 0.18 250)" rx="8"/>
                <text x="400" y="540" textAnchor="middle" fill="white" fontSize="13">Re-render</text>
                <text x="400" y="560" textAnchor="middle" fill="white" fontSize="11">(UI Actualizada)</text>

                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                    <polygon points="0 0, 10 3, 0 6" fill="oklch(0.68 0.19 40)" />
                  </marker>
                </defs>
              </svg>
            </CardContent>
          </Card>
        </ScrollArea>
      </TabsContent>

      <TabsContent value="workflow">
        <ScrollArea className="h-[500px]">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Workflow: Creación de Proyecto</CardTitle>
              </CardHeader>
              <CardContent>
                <svg viewBox="0 0 800 400" className="w-full">
                  <rect x="50" y="20" width="150" height="50" fill="oklch(0.52 0.18 250)" rx="6"/>
                  <text x="125" y="50" textAnchor="middle" fill="white" fontSize="13">Click "Nuevo Proyecto"</text>

                  <path d="M 200 45 L 250 45" stroke="oklch(0.68 0.19 40)" strokeWidth="2" markerEnd="url(#arrow2)"/>

                  <rect x="250" y="20" width="150" height="50" fill="oklch(0.68 0.19 40)" rx="6"/>
                  <text x="325" y="50" textAnchor="middle" fill="black" fontSize="13">Abrir Dialog</text>

                  <path d="M 400 45 L 450 45" stroke="oklch(0.60 0.18 180)" strokeWidth="2" markerEnd="url(#arrow2)"/>

                  <rect x="450" y="20" width="150" height="50" fill="oklch(0.60 0.18 180)" rx="6"/>
                  <text x="525" y="50" textAnchor="middle" fill="white" fontSize="13">Ingresar Datos</text>

                  <path d="M 600 45 L 650 45" stroke="oklch(0.55 0.20 250)" strokeWidth="2" markerEnd="url(#arrow2)"/>

                  <rect x="650" y="20" width="130" height="50" fill="oklch(0.55 0.20 250)" rx="6"/>
                  <text x="715" y="50" textAnchor="middle" fill="white" fontSize="13">Guardar</text>

                  <path d="M 715 70 L 715 120" stroke="oklch(0.24 0.025 250)" strokeWidth="2" markerEnd="url(#arrow2)"/>

                  <rect x="640" y="120" width="150" height="50" fill="oklch(0.24 0.025 250)" rx="6"/>
                  <text x="715" y="150" textAnchor="middle" fill="white" fontSize="13">useKV Persistencia</text>

                  <path d="M 640 145 L 450 145" stroke="oklch(0.65 0.16 300)" strokeWidth="2" markerEnd="url(#arrow2)"/>

                  <rect x="300" y="120" width="150" height="50" fill="oklch(0.65 0.16 300)" rx="6"/>
                  <text x="375" y="150" textAnchor="middle" fill="white" fontSize="13">Actualizar Lista</text>

                  <path d="M 300 145 L 150 145" stroke="oklch(0.68 0.19 40)" strokeWidth="2" markerEnd="url(#arrow2)"/>

                  <rect x="50" y="120" width="100" height="50" fill="oklch(0.68 0.19 40)" rx="6"/>
                  <text x="100" y="150" textAnchor="middle" fill="black" fontSize="13">Re-render</text>

                  <defs>
                    <marker id="arrow2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                      <polygon points="0 0, 10 3, 0 6" fill="oklch(0.68 0.19 40)" />
                    </marker>
                  </defs>
                </svg>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Workflow: Facturación Automática</CardTitle>
              </CardHeader>
              <CardContent>
                <svg viewBox="0 0 800 350" className="w-full">
                  <rect x="50" y="20" width="150" height="50" fill="oklch(0.52 0.18 250)" rx="6"/>
                  <text x="125" y="50" textAnchor="middle" fill="white" fontSize="12">Fase Completada</text>

                  <path d="M 200 45 L 250 45" stroke="oklch(0.68 0.19 40)" strokeWidth="2" markerEnd="url(#arrow3)"/>

                  <rect x="250" y="20" width="150" height="50" fill="oklch(0.68 0.19 40)" rx="6"/>
                  <text x="325" y="50" textAnchor="middle" fill="black" fontSize="12">Generar Factura</text>

                  <path d="M 400 45 L 450 45" stroke="oklch(0.60 0.18 180)" strokeWidth="2" markerEnd="url(#arrow3)"/>

                  <rect x="450" y="20" width="150" height="50" fill="oklch(0.60 0.18 180)" rx="6"/>
                  <text x="525" y="50" textAnchor="middle" fill="white" fontSize="12">Diálogo Confirmación</text>

                  <path d="M 600 45 L 650 45" stroke="oklch(0.55 0.20 250)" strokeWidth="2" markerEnd="url(#arrow3)"/>

                  <rect x="650" y="20" width="130" height="50" fill="oklch(0.55 0.20 250)" rx="6"/>
                  <text x="715" y="50" textAnchor="middle" fill="white" fontSize="12">Confirmar</text>

                  <path d="M 715 70 L 715 120" stroke="oklch(0.24 0.025 250)" strokeWidth="2" markerEnd="url(#arrow3)"/>

                  <rect x="640" y="120" width="150" height="50" fill="oklch(0.24 0.025 250)" rx="6"/>
                  <text x="715" y="150" textAnchor="middle" fill="white" fontSize="12">Guardar Factura</text>

                  <path d="M 640 145 L 450 145" stroke="oklch(0.65 0.16 300)" strokeWidth="2" markerEnd="url(#arrow3)"/>

                  <rect x="300" y="120" width="150" height="50" fill="oklch(0.65 0.16 300)" rx="6"/>
                  <text x="375" y="150" textAnchor="middle" fill="white" fontSize="12">Exportar PDF</text>

                  <path d="M 300 145 L 150 145" stroke="oklch(0.68 0.19 40)" strokeWidth="2" markerEnd="url(#arrow3)"/>

                  <rect x="50" y="120" width="100" height="50" fill="oklch(0.68 0.19 40)" rx="6"/>
                  <text x="100" y="150" textAnchor="middle" fill="black" fontSize="12">Toast Éxito</text>

                  <defs>
                    <marker id="arrow3" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                      <polygon points="0 0, 10 3, 0 6" fill="oklch(0.68 0.19 40)" />
                    </marker>
                  </defs>
                </svg>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Workflow: Flujo de Aprobación de Documentos</CardTitle>
              </CardHeader>
              <CardContent>
                <svg viewBox="0 0 800 450" className="w-full">
                  <rect x="50" y="20" width="140" height="50" fill="oklch(0.52 0.18 250)" rx="6"/>
                  <text x="120" y="50" textAnchor="middle" fill="white" fontSize="12">Crear Documento</text>

                  <path d="M 190 45 L 240 45" stroke="oklch(0.68 0.19 40)" strokeWidth="2" markerEnd="url(#arrow4)"/>

                  <rect x="240" y="20" width="140" height="50" fill="oklch(0.68 0.19 40)" rx="6"/>
                  <text x="310" y="50" textAnchor="middle" fill="black" fontSize="12">Iniciar Aprobación</text>

                  <path d="M 380 45 L 430 45" stroke="oklch(0.60 0.18 180)" strokeWidth="2" markerEnd="url(#arrow4)"/>

                  <rect x="430" y="20" width="140" height="50" fill="oklch(0.60 0.18 180)" rx="6"/>
                  <text x="500" y="50" textAnchor="middle" fill="white" fontSize="12">Enviar a Revisor</text>

                  <path d="M 570 45 L 620 45" stroke="oklch(0.55 0.20 250)" strokeWidth="2" markerEnd="url(#arrow4)"/>

                  <rect x="620" y="20" width="140" height="50" fill="oklch(0.55 0.20 250)" rx="6"/>
                  <text x="690" y="50" textAnchor="middle" fill="white" fontSize="12">Revisar</text>

                  <path d="M 690 70 L 690 140" stroke="oklch(0.24 0.025 250)" strokeWidth="2" markerEnd="url(#arrow4)"/>

                  <rect x="620" y="140" width="70" height="50" fill="oklch(0.72 0.20 120)" rx="6"/>
                  <text x="655" y="170" textAnchor="middle" fill="black" fontSize="12">Aprobar</text>

                  <rect x="700" y="140" width="80" height="50" fill="oklch(0.58 0.24 25)" rx="6"/>
                  <text x="740" y="170" textAnchor="middle" fill="white" fontSize="12">Rechazar</text>

                  <path d="M 655 190 L 500 250" stroke="oklch(0.72 0.20 120)" strokeWidth="2" markerEnd="url(#arrow4)"/>
                  <path d="M 740 190 L 310 250" stroke="oklch(0.58 0.24 25)" strokeWidth="2" markerEnd="url(#arrow4)"/>

                  <rect x="430" y="250" width="140" height="50" fill="oklch(0.65 0.16 300)" rx="6"/>
                  <text x="500" y="280" textAnchor="middle" fill="white" fontSize="12">Firma Digital</text>

                  <rect x="240" y="250" width="140" height="50" fill="oklch(0.68 0.19 40)" rx="6"/>
                  <text x="310" y="280" textAnchor="middle" fill="black" fontSize="12">Corregir</text>

                  <path d="M 500 300 L 500 350" stroke="oklch(0.52 0.18 250)" strokeWidth="2" markerEnd="url(#arrow4)"/>

                  <rect x="430" y="350" width="140" height="50" fill="oklch(0.52 0.18 250)" rx="6"/>
                  <text x="500" y="380" textAnchor="middle" fill="white" fontSize="12">Documento Final</text>

                  <defs>
                    <marker id="arrow4" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                      <polygon points="0 0, 10 3, 0 6" fill="oklch(0.68 0.19 40)" />
                    </marker>
                  </defs>
                </svg>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  )
}
