import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ColmadoKey } from "@/types";


type SelectColmadoProps = {
  selected: ColmadoKey;
  setSelected: (value: ColmadoKey) => void;
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
          <SelectItem value="o7">Colmado O7</SelectItem>
          <SelectItem value="o9">Colmado O9</SelectItem>
          <SelectItem value="parqueo">ParqueO 10</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}