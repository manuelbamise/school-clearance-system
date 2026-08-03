import Reveal from './reveal'

const steps = [
  {
    title: 'Create Your Account',
    body: 'Sign in with your student credentials and open a clearance session in seconds.',
  },
  {
    title: 'Upload Your Documents',
    body: 'Drag and drop transcripts, IDs, and forms. ClearPath verifies them automatically.',
  },
  {
    title: 'Track Real-Time Progress',
    body: 'Follow each document through every department on your live dashboard.',
  },
  {
    title: 'Get Fully Cleared',
    body: 'Receive instant approval notifications and download your clearance certificate.',
  },
]

export default function LandingHowItWorks() {
  return (
    <section className="lp-section lp-how" id="how-it-works">
      <div className="lp-container">
        <Reveal>
          <div className="lp-section-header">
            <h2>How It Works</h2>
            <p className="lp-section-subtitle">
              From upload to approval in four simple steps.
            </p>
          </div>
        </Reveal>

        <div className="lp-steps">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 120}>
              <div className="lp-step-card">
                <span className="lp-step-number">{i + 1}</span>
                <h4 className="lp-h4">{s.title}</h4>
                <p className="lp-caption" style={{ marginTop: 12 }}>
                  {s.body}
                </p>
                <span className="lp-step-line" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}