import { useState, useEffect } from 'react'
import { ArchitectProfile } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Briefcase, MapPin, Phone, Envelope, Bank, Globe, IdentificationCard, Upload, Buildings, FloppyDisk, UserCircle } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface ArchitectProfileEditorProps {
  profile: ArchitectProfile
  onSave: (profile: ArchitectProfile) => void
  trigger?: React.ReactNode
}

export function ArchitectProfileEditor({ profile, onSave, trigger }: ArchitectProfileEditorProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState(profile)

  useEffect(() => {
    if (open) {
      setFormData(profile)
    }
  }, [open, profile])

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

    onSave({
      ...formData,
      updatedAt: Date.now()
    })

    toast.success('Perfil actualizado correctamente')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <UserCircle size={18} weight="duotone" />
            Editar Perfil
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <UserCircle size={28} weight="duotone" className="text-primary" />
            Perfil Profesional
          </DialogTitle>
          <DialogDescription>
            Actualiza tu información profesional. Los campos marcados con * son obligatorios.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal" className="gap-2">
              <User size={16} weight="duotone" />
              Personal
            </TabsTrigger>
            <TabsTrigger value="professional" className="gap-2">
              <Briefcase size={16} weight="duotone" />
              Profesional
            </TabsTrigger>
            <TabsTrigger value="branding" className="gap-2">
              <Buildings size={16} weight="duotone" />
              Logo y Datos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información Personal y de Contacto</CardTitle>
                <CardDescription>Datos básicos de identificación</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="edit-nombreCompleto" className="flex items-center gap-2">
                    <User size={16} weight="duotone" />
                    Nombre Completo *
                  </Label>
                  <Input
                    id="edit-nombreCompleto"
                    value={formData.nombreCompleto}
                    onChange={(e) => setFormData(prev => ({ ...prev, nombreCompleto: e.target.value }))}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-nif" className="flex items-center gap-2">
                    <IdentificationCard size={16} weight="duotone" />
                    NIF/CIF *
                  </Label>
                  <Input
                    id="edit-nif"
                    value={formData.nif}
                    onChange={(e) => setFormData(prev => ({ ...prev, nif: e.target.value.toUpperCase() }))}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-razonSocial" className="flex items-center gap-2">
                    <Briefcase size={16} weight="duotone" />
                    Razón Social
                  </Label>
                  <Input
                    id="edit-razonSocial"
                    value={formData.razonSocial || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, razonSocial: e.target.value }))}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="edit-direccion" className="flex items-center gap-2">
                    <MapPin size={16} weight="duotone" />
                    Dirección
                  </Label>
                  <Textarea
                    id="edit-direccion"
                    value={formData.direccion || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, direccion: e.target.value }))}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-codigoPostal">Código Postal</Label>
                  <Input
                    id="edit-codigoPostal"
                    value={formData.codigoPostal || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, codigoPostal: e.target.value }))}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-localidad">Localidad</Label>
                  <Input
                    id="edit-localidad"
                    value={formData.localidad || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, localidad: e.target.value }))}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-provincia">Provincia</Label>
                  <Input
                    id="edit-provincia"
                    value={formData.provincia || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, provincia: e.target.value }))}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-telefono" className="flex items-center gap-2">
                    <Phone size={16} weight="duotone" />
                    Teléfono
                  </Label>
                  <Input
                    id="edit-telefono"
                    type="tel"
                    value={formData.telefono || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="edit-email" className="flex items-center gap-2">
                    <Envelope size={16} weight="duotone" />
                    Email
                  </Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="h-11"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="professional" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información Profesional</CardTitle>
                <CardDescription>Datos de colegiación y titulación</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-numeroColegial">Número de Colegiado</Label>
                  <Input
                    id="edit-numeroColegial"
                    value={formData.numeroColegial || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, numeroColegial: e.target.value }))}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-colegioOficial">Colegio Oficial</Label>
                  <Input
                    id="edit-colegioOficial"
                    value={formData.colegioOficial || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, colegioOficial: e.target.value }))}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="edit-titulacion">Titulación</Label>
                  <Input
                    id="edit-titulacion"
                    value={formData.titulacion || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, titulacion: e.target.value }))}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="edit-web" className="flex items-center gap-2">
                    <Globe size={16} weight="duotone" />
                    Sitio Web
                  </Label>
                  <Input
                    id="edit-web"
                    type="url"
                    value={formData.web || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, web: e.target.value }))}
                    className="h-11"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="branding" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Logo y Datos Bancarios</CardTitle>
                <CardDescription>Configuración visual y bancaria</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
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
                      id="edit-logo"
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
                  <Label htmlFor="edit-iban" className="flex items-center gap-2">
                    <Bank size={16} weight="duotone" />
                    IBAN
                  </Label>
                  <Input
                    id="edit-iban"
                    value={formData.iban || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, iban: e.target.value.toUpperCase() }))}
                    className="h-11"
                  />
                  <p className="text-xs text-muted-foreground">
                    Para incluir en las facturas generadas
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            className="gap-2"
            disabled={!formData.nombreCompleto.trim() || !formData.nif.trim()}
          >
            <FloppyDisk size={18} weight="duotone" />
            Guardar Cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
