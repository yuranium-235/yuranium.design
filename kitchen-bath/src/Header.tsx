import { useLanguage, type Language } from "@/contexts/LanguageContext";
import { Hammer, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const languageLabels: Record<Language, string> = {
  en: "EN",
  zh: "中文",
  vi: "VI",
  es: "ES",
};

const languageNames: Record<Language, string> = {
  en: "English",
  zh: "中文",
  vi: "Tiếng Việt",
  es: "Español",
};

export default function Header() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10">
            <Hammer className="w-5 h-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold leading-tight tracking-tight">
              {t("overview.title")}
            </span>
            <span className="text-xs text-muted-foreground leading-tight">
              {t("overview.subtitle")}
            </span>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5 h-9 px-3 text-sm">
              <Globe className="w-4 h-4" />
              {languageLabels[language]}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[120px]">
            {(Object.keys(languageNames) as Language[]).map((lang) => (
              <DropdownMenuItem
                key={lang}
                onClick={() => setLanguage(lang)}
                className={language === lang ? "bg-accent font-medium" : ""}
              >
                {languageNames[lang]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
