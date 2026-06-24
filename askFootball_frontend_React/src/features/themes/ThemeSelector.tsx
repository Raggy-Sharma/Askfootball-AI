// import { useTheme } from "../../Contexts/ThemeContext";

// const THEMES = ["light", "dark"] as const;

// export function ThemeSelector() {
//   const { theme, setTheme } = useTheme();
//   return (
//     <select value={theme} onChange={(e) => {
//         console.log('theme changed to', e.target.value);
//         setTheme(e.target.value as typeof THEMES[number])
//     }}>
//       {THEMES.map((t) => <option key={t} value={t}>{t}</option>)}
//     </select>
//   );
// }

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "../../Contexts/ThemeContext";
export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex items-center space-x-2 cursor-pointer">
      <Switch id="airplane-mode" checked={theme === "dark"} onCheckedChange={(checked) => {
        setTheme(checked ? "dark" : "light")
      }} />
      <Label htmlFor="airplane-mode">{theme === "dark" ? "Dark" : "Light"}</Label>
    </div>
  )
}
