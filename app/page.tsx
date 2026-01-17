import ContactForm from './components/ContactForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-semibold text-foreground mb-3">
            Get in Touch
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Fill out the form below and we&apos;ll get back to you shortly.
          </p>
        </div>

        <ContactForm />
      </main>
    </div>
  );
}
