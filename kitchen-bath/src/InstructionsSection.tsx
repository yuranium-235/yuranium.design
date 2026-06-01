import { useLanguage } from "@/contexts/LanguageContext";
import { contractorInstructions } from "@/data/remodel-data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

export default function InstructionsSection() {
  const { language } = useLanguage();

  return (
    <div className="space-y-4">
      <Accordion type="multiple" defaultValue={contractorInstructions.map((s) => s.id)} className="space-y-3">
        {contractorInstructions.map((section) => (
          <AccordionItem
            key={section.id}
            value={section.id}
            className="bg-card border border-border rounded-lg overflow-hidden px-0"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/30 transition-colors">
              <span className="text-sm font-semibold">{section.title[language]}</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4">
                {section.items.map((item) => (
                  <div key={item.id} className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium">{item.requirement[language]}</p>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          {item.details[language]}
                        </p>
                      </div>
                    </div>
                    {item.prohibited && (
                      <div className="flex items-start gap-2 ml-6 mt-1.5 bg-destructive/5 border border-destructive/15 rounded-md px-3 py-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-destructive mt-0.5 shrink-0" />
                        <p className="text-xs text-destructive/90 font-medium">
                          {item.prohibited[language]}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
