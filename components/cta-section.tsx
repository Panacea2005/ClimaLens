export default function CTASection() {
  return (
    <section className="py-24 px-6 bg-muted/30">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground text-balance">
          Ready to Transform Climate Data?
        </h2>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
          Start exploring comprehensive climate insights today. No credit card required.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium text-lg"
          >
            Get Started Free
          </a>
          <button className="w-full sm:w-auto px-8 py-4 rounded-full border-2 border-border hover:bg-accent hover:text-accent-foreground transition-all duration-200 font-medium text-lg">
            Schedule Demo
          </button>
        </div>
      </div>
    </section>
  )
}
