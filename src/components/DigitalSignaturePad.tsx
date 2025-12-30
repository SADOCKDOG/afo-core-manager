import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Signature, 
  Eraser, 
  PencilSimple,
  Check,
  Warning
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface DigitalSignaturePadProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  signerName: string
  documentName: string
  onSign: (signatureData: string, signatureType: 'drawn' | 'typed') => void
}

export function DigitalSignaturePad({
  open,
  onOpenChange,
  signerName,
  documentName,
  onSign
}: DigitalSignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasDrawn, setHasDrawn] = useState(false)
  const [typedSignature, setTypedSignature] = useState(signerName)
  const [selectedFont, setSelectedFont] = useState('Brush Script MT')
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  useEffect(() => {
    if (open && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
      }
    }
  }, [open])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.beginPath()
    ctx.moveTo(x, y)
    setIsDrawing(true)
    setHasDrawn(true)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasDrawn(false)
  }

  const handleDrawnSignature = () => {
    if (!hasDrawn) {
      toast.error('Debes dibujar tu firma')
      return
    }

    if (!agreeToTerms) {
      toast.error('Debes aceptar los términos')
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    const signatureData = canvas.toDataURL('image/png')
    onSign(signatureData, 'drawn')
    handleClose()
  }

  const handleTypedSignature = () => {
    if (!typedSignature.trim()) {
      toast.error('Escribe tu firma')
      return
    }

    if (!agreeToTerms) {
      toast.error('Debes aceptar los términos')
      return
    }

    const canvas = document.createElement('canvas')
    canvas.width = 400
    canvas.height = 150
    const ctx = canvas.getContext('2d')
    
    if (!ctx) return

    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#000000'
    ctx.font = `48px ${selectedFont}, cursive`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(typedSignature, canvas.width / 2, canvas.height / 2)

    const signatureData = canvas.toDataURL('image/png')
    onSign(signatureData, 'typed')
    handleClose()
  }

  const handleClose = () => {
    clearCanvas()
    setTypedSignature(signerName)
    setAgreeToTerms(false)
    onOpenChange(false)
  }

  const fonts = [
    'Brush Script MT',
    'Lucida Handwriting',
    'Segoe Script',
    'Freestyle Script',
    'French Script MT'
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Signature size={24} weight="duotone" className="text-primary" />
            Firma Digital
          </DialogTitle>
          <DialogDescription>
            Firma digitalmente el documento: <strong>{documentName}</strong>
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="draw" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="draw" className="gap-2">
              <PencilSimple size={16} />
              Dibujar Firma
            </TabsTrigger>
            <TabsTrigger value="type" className="gap-2">
              <Signature size={16} />
              Escribir Firma
            </TabsTrigger>
          </TabsList>

          <TabsContent value="draw" className="space-y-4">
            <div className="border-2 border-dashed rounded-lg bg-white">
              <canvas
                ref={canvasRef}
                width={700}
                height={200}
                className="w-full cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearCanvas}
                className="gap-2"
              >
                <Eraser size={16} />
                Limpiar
              </Button>
              <p className="text-xs text-muted-foreground">
                Dibuja tu firma en el recuadro blanco usando el ratón
              </p>
            </div>

            <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg">
              <input
                type="checkbox"
                id="terms-draw"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="h-4 w-4"
              />
              <Label htmlFor="terms-draw" className="text-sm cursor-pointer">
                Acepto que esta firma digital tiene validez legal y certifico la autenticidad del documento
              </Label>
            </div>

            <div className="flex items-start gap-2 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <Warning size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-600">
                <p className="font-medium mb-1">Información Legal</p>
                <p className="text-xs">
                  Tu firma digital será encriptada y almacenada de forma segura junto con un registro de auditoría que incluye fecha, hora y hash del documento.
                </p>
              </div>
            </div>

            <Button onClick={handleDrawnSignature} className="w-full gap-2" disabled={!hasDrawn || !agreeToTerms}>
              <Check size={18} weight="bold" />
              Confirmar Firma Dibujada
            </Button>
          </TabsContent>

          <TabsContent value="type" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signature-text">Texto de Firma</Label>
              <Input
                id="signature-text"
                value={typedSignature}
                onChange={(e) => setTypedSignature(e.target.value)}
                placeholder="Escribe tu nombre completo"
              />
            </div>

            <div className="space-y-2">
              <Label>Estilo de Fuente</Label>
              <div className="grid grid-cols-2 gap-2">
                {fonts.map((font) => (
                  <div
                    key={font}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedFont === font 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedFont(font)}
                  >
                    <p 
                      className="text-2xl text-center"
                      style={{ fontFamily: `${font}, cursive` }}
                    >
                      {typedSignature || 'Firma'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-2 rounded-lg bg-white">
              <p 
                className="text-4xl text-center"
                style={{ fontFamily: `${selectedFont}, cursive` }}
              >
                {typedSignature || 'Tu firma aparecerá aquí'}
              </p>
            </div>

            <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg">
              <input
                type="checkbox"
                id="terms-type"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="h-4 w-4"
              />
              <Label htmlFor="terms-type" className="text-sm cursor-pointer">
                Acepto que esta firma digital tiene validez legal y certifico la autenticidad del documento
              </Label>
            </div>

            <div className="flex items-start gap-2 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <Warning size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-600">
                <p className="font-medium mb-1">Información Legal</p>
                <p className="text-xs">
                  Tu firma digital será encriptada y almacenada de forma segura junto con un registro de auditoría que incluye fecha, hora y hash del documento.
                </p>
              </div>
            </div>

            <Button 
              onClick={handleTypedSignature} 
              className="w-full gap-2"
              disabled={!typedSignature.trim() || !agreeToTerms}
            >
              <Check size={18} weight="bold" />
              Confirmar Firma Escrita
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
