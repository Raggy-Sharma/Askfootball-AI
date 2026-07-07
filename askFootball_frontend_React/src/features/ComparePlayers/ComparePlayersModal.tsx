import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { ComparePlayersAILayout } from "@/features/ComparePlayers/ComparePlayersAILayout"
import { useEffect } from "react"
export function ComparePlayersDrawer({children, referencedPlayers}) {
  useEffect(() => {
    console.log('referencedPlayers from ComparePlayersDrawer', referencedPlayers);
    
  }, [referencedPlayers.length])

  return (
    <Drawer>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent className="h-4/5">
        <ComparePlayersAILayout referencedPlayers={referencedPlayers}/>
      </DrawerContent>
    </Drawer>
  )
}
