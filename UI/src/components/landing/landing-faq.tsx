import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Reveal from './reveal'

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
    <section className="lp-section lp-faq" id="faq">
      <div className="lp-faq-diagram">
        <div className="lp-faq-diagram-ring" style={{ width: 520, height: 520 }} />
        <div className="lp-faq-diagram-ring" style={{ width: 380, height: 380 }} />
        <div className="lp-faq-diagram-ring" style={{ width: 240, height: 240 }} />
        <div className="lp-faq-diagram-core" />
      </div>
      <div className="lp-container">
        <Reveal>
          <div className="lp-section-header">
            <h2>Frequently Asked Questions</h2>
            <p className="lp-section-subtitle">
              Everything you need to know about ClearPath.
            </p>
          </div>
        </Reveal>

        <div className="lp-faq-list">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <Reveal key={faq.question} delay={i < 4 ? i * 60 : 0}>
                <div className={`lp-faq-item ${isOpen ? 'open' : ''}`}>
                  <button
                    type="button"
                    className="lp-faq-question"
                    aria-expanded={isOpen}
                    onClick={() => toggle(i)}
                  >
                    <h4 className="lp-h4" style={{ fontSize: 18 }}>
                      {faq.question}
                    </h4>
                    <ChevronDown className="lp-faq-chevron" size={20} />
                  </button>
                  <div className="lp-faq-answer-wrap">
                    <div className="lp-faq-answer">
                      <p className="lp-body">{faq.answer}</p>
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