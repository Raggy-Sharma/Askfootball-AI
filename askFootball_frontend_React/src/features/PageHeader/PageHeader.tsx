import { Separator } from "@/components/ui/separator";
import { ThemeSelector } from "../themes/ThemeSelector";

const PageHeader = () => {
    return (
        <>
            <div className="flex w-full flex-row justify-between px-4 py-3">
                <h1 className="text-2xl font-bold">AskFootball AI</h1>
                <ThemeSelector />
            </div>
            <Separator />
        </>
        
    )
}

export default PageHeader;