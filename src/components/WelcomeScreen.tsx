import { useState } from 'react'
import { ArchitectProfile } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Buildings, Upload, Check, User, Briefcase, MapPin, Phone, Envelope, Bank, Globe, IdentificationCard } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

interface WelcomeScreenProps {
  onComplete: (profile: Omit<ArchitectProfile, 'id' | 'createdAt' | 'updatedAt'>) => void
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    nif: '',
    razonSocial: '',
    direccion: '',
    codigoPostal: '',
    localidad: '',
    provincia: '',
    telefono: '',
    email: '',
    numeroColegial: '',
    colegioOficial: '',
    titulacion: '',
    logo: '',
    web: '',
    iban: ''
  })

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('El archivo es demasiado grande', {
          description: 'El logo debe ser menor a 2MB'
        })
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logo: reader.result as string }))
        toast.success('Logo cargado correctamente')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = () => {
    if (!formData.nombreCompleto.trim() || !formData.nif.trim()) {
      toast.error('Campos requeridos', {
        description: 'Debes completar el nombre completo y el NIF/CIF'
      })
      return
    }

    onComplete(formData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-4xl"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/20 text-primary ring-4 ring-primary/30 mb-6"
          >
            <Buildings size={44} weight="duotone" />
          </motion.div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">¡Bienvenido a AFO CORE MANAGER!</h1>
          <p className="text-lg text-muted-foreground">
            Configuremos tu perfil profesional para comenzar
          </p>
        </div>

        <Card className="border-2 shadow-2xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`h-2 rounded-full transition-all ${
                      s === step ? 'w-12 bg-primary' : s < step ? 'w-8 bg-primary/60' : 'w-8 bg-muted'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">Paso {step} de 3</span>
            </div>
            <CardTitle>
              {step === 1 && 'Datos Básicos'}
              {step === 2 && 'Información Profesional'}
              {step === 3 && 'Logo y Configuración'}
            </CardTitle>
            <CardDescription>
              {step === 1 && 'Información personal y de contacto (campos marcados con * son obligatorios)'}
              {step === 2 && 'Datos profesionales y colegiación (opcional)'}
              {step === 3 && 'Logo empresarial y datos bancarios (opcional)'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="nombreCompleto" className="flex items-center gap-2">
                    <User size={16} weight="duotone" />
                    Nombre Completo *
                  </Label>
                  <Input
                    id="nombreCompleto"
                    placeholder="Ej: Juan García López"
                    value={formData.nombreCompleto}
                    onChange={(e) => setFormData(prev => ({ ...prev, nombreCompleto: e.target.value }))}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nif" className="flex items-center gap-2">
                    <IdentificationCard size={16} weight="duotone" />
                    NIF/CIF *
                  </Label>
                  <Input
                    id="nif"
                    placeholder="Ej: 12345678A"
                    value={formData.nif}
                    onChange={(e) => setFormData(prev => ({ ...prev, nif: e.target.value.toUpperCase() }))}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="razonSocial" className="flex items-center gap-2">
                    <Briefcase size={16} weight="duotone" />
                    Razón Social
                  </Label>
                  <Input
                    id="razonSocial"
                    placeholder="Ej: AFO Arquitectura S.L."
                    value={formData.razonSocial}
                    onChange={(e) => setFormData(prev => ({ ...prev, razonSocial: e.target.value }))}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="direccion" className="flex items-center gap-2">
                    <MapPin size={16} weight="duotone" />
                    Dirección
                  </Label>
                  <Textarea
                    id="direccion"
                    placeholder="Ej: Calle Mayor, 123, 1º A"
                    value={formData.direccion}
                    onChange={(e) => setFormData(prev => ({ ...prev, direccion: e.target.value }))}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="codigoPostal">Código Postal</Label>
                  <Input
                    id="codigoPostal"
                    placeholder="Ej: 28001"
                    value={formData.codigoPostal}
                    onChange={(e) => setFormData(prev => ({ ...prev, codigoPostal: e.target.value }))}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="localidad">Localidad</Label>
                  <Input
                    id="localidad"
                    placeholder="Ej: Madrid"
                    value={formData.localidad}
                    onChange={(e) => setFormData(prev => ({ ...prev, localidad: e.target.value }))}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="provincia">Provincia</Label>
                  <Input
                    id="provincia"
                    placeholder="Ej: Madrid"
                    value={formData.provincia}
                    onChange={(e) => setFormData(prev => ({ ...prev, provincia: e.target.value }))}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefono" className="flex items-center gap-2">
                    <Phone size={16} weight="duotone" />
                    Teléfono
                  </Label>
                  <Input
                    id="telefono"
                    type="tel"
                    placeholder="Ej: +34 600 123 456"
                    value={formData.telefono}
                    onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Envelope size={16} weight="duotone" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Ej: contacto@afoarquitectura.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="h-11"
                  />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="space-y-2">
                  <Label htmlFor="numeroColegial">Número de Colegiado</Label>
                  <Input
                    id="numeroColegial"
                    placeholder="Ej: COA-12345"
                    value={formData.numeroColegial}
                    onChange={(e) => setFormData(prev => ({ ...prev, numeroColegial: e.target.value }))}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="colegioOficial">Colegio Oficial</Label>
                  <Input
                    id="colegioOficial"
                    placeholder="Ej: COAM"
                    value={formData.colegioOficial}
                    onChange={(e) => setFormData(prev => ({ ...prev, colegioOficial: e.target.value }))}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="titulacion">Titulación</Label>
                  <Input
                    id="titulacion"
                    placeholder="Ej: Arquitecto Superior"
                    value={formData.titulacion}
                    onChange={(e) => setFormData(prev => ({ ...prev, titulacion: e.target.value }))}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="web" className="flex items-center gap-2">
                    <Globe size={16} weight="duotone" />
                    Sitio Web
                  </Label>
                  <Input
                    id="web"
                    type="url"
                    placeholder="Ej: https://www.afoarquitectura.com"
                    value={formData.web}
                    onChange={(e) => setFormData(prev => ({ ...prev, web: e.target.value }))}
                    className="h-11"
                  />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <Label className="flex items-center gap-2">
                    <Buildings size={16} weight="duotone" />
                    Logo Empresarial
                  </Label>
                  <div className="flex flex-col items-center gap-4 p-8 border-2 border-dashed rounded-lg hover:border-primary/50 transition-colors bg-muted/20">
                    {formData.logo ? (
                      <div className="relative">
                        <img
                          src={formData.logo}
                          alt="Logo preview"
                          className="max-h-32 max-w-xs rounded-lg shadow-md"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2"
                          onClick={() => setFormData(prev => ({ ...prev, logo: '' }))}
                        >
                          Eliminar
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="p-4 rounded-full bg-primary/10 text-primary">
                          <Upload size={32} weight="duotone" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium mb-1">Sube tu logo</p>
                          <p className="text-xs text-muted-foreground">PNG, JPG o SVG (máx. 2MB)</p>
                        </div>
                      </>
                    )}
                    <Input
                      id="logo"
                      type="file"
                      accept="image/png,image/jpeg,image/svg+xml"
                      onChange={handleLogoUpload}
                      className="max-w-xs"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Este logo se utilizará en documentos, facturas y como logo de la aplicación
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="iban" className="flex items-center gap-2">
                    <Bank size={16} weight="duotone" />
                    IBAN
                  </Label>
                  <Input
                    id="iban"
                    placeholder="Ej: ES91 2100 0418 4502 0005 1332"
                    value={formData.iban}
                    onChange={(e) => setFormData(prev => ({ ...prev, iban: e.target.value.toUpperCase() }))}
                    className="h-11"
                  />
                  <p className="text-xs text-muted-foreground">
                    Para incluir en las facturas generadas
                  </p>
                </div>
              </motion.div>
            )}

            <div className="flex justify-between pt-6 border-t">
              {step > 1 ? (
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  className="gap-2"
                >
                  Anterior
                </Button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  className="gap-2"
                >
                  Siguiente
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
                  disabled={!formData.nombreCompleto.trim() || !formData.nif.trim()}
                >
                  <Check size={18} weight="bold" />
                  Completar Configuración
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Podrás modificar estos datos en cualquier momento desde la configuración
        </p>
      </motion.div>
    </div>
  )
}
