import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";


type SelectColmadoProps = {
  selected: string;
  setSelected: (value: string) => void;
}

export default function SelectColmado({selected, setSelected}: SelectColmadoProps) {
  return (
    <Select value={selected} onValueChange={setSelected}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Colmados</SelectLabel>
          <SelectItem value="colmado_o7">Colmado O7</SelectItem>
          <SelectItem value="colmado_o9">Colmado O9</SelectItem>
          <SelectItem value="colmado_parqueo">ParqueO 10</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}