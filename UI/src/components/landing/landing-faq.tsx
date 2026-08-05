import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Reveal from './reveal'
import { SectionHeader } from './landing-ui'

interface FaqItem {
  question: string
  answer: string
}

const faqs: FaqItem[] = [
  {
    question: 'What documents do I need for clearance?',
    answer:
      'Typically you\u2019ll need your academic transcript, clearance form, ID verification, and any department-specific forms. ClearPath shows you exactly what\u2019s required based on your program.',
  },
  {
    question: 'How long does the clearance process take?',
    answer:
      'With ClearPath, most clearances are processed within 24-48 hours. Automated verification handles standard documents instantly, while complex cases are flagged for admin review.',
  },
  {
    question: 'Is my data secure?',
    answer:
      'Absolutely. We use AES-256 encryption, SOC 2 Type II compliance, and role-based access controls. Your documents are only visible to authorized administrators.',
  },
  {
    question: 'Can I track my clearance status in real-time?',
    answer:
      'Yes! Our live dashboard updates instantly as documents are reviewed. You\u2019ll also receive email and in-app notifications at every stage.',
  },
  {
    question: 'What if my document gets rejected?',
    answer:
      'You\u2019ll receive detailed feedback on why it was rejected and what needs to be corrected. Re-upload the corrected document and it goes back into the queue immediately.',
  },
  {
    question: 'Does ClearPath work on mobile?',
    answer:
      'ClearPath is fully responsive and works on any device. We also have native iOS and Android apps for document scanning and quick status checks.',
  },
]

export default function LandingFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (idx: number) =>
    setOpenIndex((current) => (current === idx ? null : idx))

  return (
    <section className="relative overflow-hidden bg-lp-deep py-20 max-[809px]:py-16" id="faq">
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
        <div className="absolute rounded-full border border-lp-blue/15 shadow-[0_0_60px_rgba(37,99,235,0.06)]" style={{ width: 520, height: 520 }} />
        <div className="absolute rounded-full border border-lp-blue/15 shadow-[0_0_60px_rgba(37,99,235,0.06)]" style={{ width: 380, height: 380 }} />
        <div className="absolute rounded-full border border-lp-blue/15 shadow-[0_0_60px_rgba(37,99,235,0.06)]" style={{ width: 240, height: 240 }} />
        <div className="absolute h-[120px] w-[120px] rounded-full [background:radial-gradient(circle,rgba(37,99,235,0.14),rgba(230,184,102,0.06)_55%,transparent_72%)] shadow-[0_0_80px_rgba(37,99,235,0.12)]" />
      </div>
      <div className="relative z-10 mx-auto max-w-[1200px] px-10 max-[809px]:px-5">
        <SectionHeader
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about ClearPath."
        />

        <div className="mx-auto max-w-[768px]">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <Reveal key={faq.question} delay={i < 4 ? i * 60 : 0}>
                <div
                  className={`mb-3.5 rounded-[18px] border bg-white/[0.015] px-[22px] transition-[border-color,box-shadow,background] duration-300 ${
                    i === faqs.length - 1 ? 'mb-0' : ''
                  } ${
                    isOpen
                      ? 'border-lp-blue/40 bg-gradient-to-b from-lp-blue/[0.05] to-lp-gold/[0.03] shadow-[0_0_0_1px_rgba(37,99,235,0.14),0_0_40px_rgba(37,99,235,0.14),0_0_90px_rgba(230,184,102,0.06)]'
                      : 'border-lp-line'
                  }`}
                >
                  <button
                    type="button"
                    className="flex w-full cursor-pointer items-center justify-between gap-4 border-none bg-transparent py-5 text-left text-white"
                    aria-expanded={isOpen}
                    onClick={() => toggle(i)}
                  >
                    <h4 className="text-lg font-normal leading-[1.5] text-white">{faq.question}</h4>
                    <ChevronDown
                      size={20}
                      className={`flex-shrink-0 text-lp-muted transition-[transform,color] duration-300 ${
                        isOpen ? 'rotate-180 text-lp-gold' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ${
                      isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="m-0 p-0 pb-5 text-[clamp(14px,1.2vw,16px)] font-normal leading-[1.5] tracking-[-0.03em] text-lp-muted">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
