import { Button } from "@/components/ui/button/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui"
import { Input } from "@/components/ui/input/input"
import { Label } from "@/components/ui/label/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select/select"
import { useState } from "react"
 
interface Props {
  address: string;
  nombre: string;
  indice: number;
}

export const CardStudent = (
  {  address,nombre,indice } : Props
) => {
  const [indic, setIndice] = useState(indice);

  const handleIndiceChange = (event) => {
    setIndice(event.target.value);
  };

  return (
    <Card className="w-[350px]">
    <CardHeader>
      <CardTitle>Perfil</CardTitle>
      <CardDescription>Elige tu futuro</CardDescription>
    </CardHeader>
    <CardContent>
      <form>
        <div className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-1.5">
            <Label htmlFor="address">Address</Label>
            <Input id="address" placeholder={address} disabled />
        </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" placeholder={nombre} disabled />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="indice">Indice</Label>
            <Input id="indice" placeholder="Indice Estudiante" value={indic} onChange={handleIndiceChange} disabled />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="university">Universidades</Label>
            <Select disabled={indic < 90}>
              <SelectTrigger id="university">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="usap">USAP</SelectItem>
                <SelectItem value="unitec">UNITEC</SelectItem>
                <SelectItem value="uth">UTH</SelectItem>
                <SelectItem value="ceutec">CEUTEC</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </form>
    </CardContent>
    <CardFooter className="flex justify-between">
      <Button variant="outline">Cancelar</Button>
      <Button>Aplicar</Button>
    </CardFooter>
  </Card>
  )
}

