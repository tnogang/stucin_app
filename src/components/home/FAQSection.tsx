import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'Kako hitro lahko pridete na pomoč?',
    answer: 'V Vipavi in bližnji okolici smo običajno na lokaciji v 15-30 minutah. Za širše območje Vipavske doline in Goriške je odzivni čas do 45 minut, odvisno od prometnih razmer.',
  },
  {
    question: 'Kakšno je vaše območje delovanja?',
    answer: 'Primarno delujemo v Vipavi, Ajdovščini in celotni Vipavski dolini. Po dogovoru nudimo storitve po celotni Sloveniji in tudi v tujini.',
  },
  {
    question: 'Ali ponujate nadomestno vozilo?',
    answer: 'Da, kot pogodbeni partner AMZS ponujamo nadomestna vozila. Prav tako imamo lastno ponudbo najema vozil za čas popravila vašega avtomobila.',
  },
  {
    question: 'Kakšne tipe vozil lahko vlečete?',
    answer: 'Naš vozni park omogoča vleko osebnih vozil, motorjev, lahkih tovornjakov do 7 ton ter zahtevnejša reševanja s hidravličnim dvigalom.',
  },
  {
    question: 'Kako naročim menjavo pnevmatik?',
    answer: 'Pokličite nas ali pošljite povpraševanje preko kontaktnega obrazca. Ponujamo premontažo zimskih/letnih pnevmatik ter možnost naročila novih pnevmatik različnih znamk.',
  },
  {
    question: 'Ali odvažate odslužena vozila brezplačno?',
    answer: 'V okolici Vipavske doline je odvoz odsluženih vozil brezplačen. Prejmete tudi potrdilo o razgradnji, ki je potrebno za odjavo vozila.',
  },
  {
    question: 'Kakšen je delovni čas servisa?',
    answer: 'Servis in avtopralnica delujeta od ponedeljka do petka od 7:30 do 16:30, z malico od 11:00 do 11:30. Ob sobotah po dogovoru.',
  },
  {
    question: 'Ali sprejemate kartična plačila?',
    answer: 'Da, sprejemamo vsa večja plačilna sredstva: gotovino, bančne kartice in po dogovoru tudi plačilo na obroke.',
  },
];

export default function FAQSection() {
  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Pogosta vprašanja
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Odgovori na najpogostejša vprašanja naših strank
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-xl px-6 data-[state=open]:shadow-lg transition-shadow"
              >
                <AccordionTrigger className="text-left font-display font-semibold text-foreground hover:text-primary py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
