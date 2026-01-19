import Image from 'next/image';
import ContactForm from './components/ContactForm';
import { Code2, Zap, Layers, Check, Clock, Users, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const services = [
  {
    icon: Code2,
    title: 'Web Development',
    description: 'Modern, responsive websites and web applications built with cutting-edge technologies.',
    features: ['Next.js & React', 'Responsive Design', 'Performance Optimized'],
    assignee: 'Shlomi',
  },
  {
    icon: Zap,
    title: 'Automation & Integrations',
    description: 'Streamline your workflows with custom automation solutions that save time and reduce errors.',
    features: ['Make.com & Zapier', 'API Integrations', 'Custom Workflows'],
    assignee: 'Maor',
  },
  {
    icon: Layers,
    title: 'Full Stack Projects',
    description: 'End-to-end development from concept to deployment. Complete solutions for your business.',
    features: ['Frontend & Backend', 'Database Design', 'Cloud Deployment'],
    assignee: 'Shlomi',
  },
];

const stats = [
  { value: '50+', label: 'Projects Delivered' },
  { value: '24h', label: 'Response Time' },
  { value: '100%', label: 'Client Satisfaction' },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <a href="/">
              <Image
                src="/logo.png"
                alt="Logo"
                width={120}
                height={120}
                className="rounded-xl"
              />
            </a>
            <nav className="flex items-center gap-6">
              <a href="#services" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
                Services
              </a>
              <a href="#contact" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
                Contact
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[80vh] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 pt-32 pb-24 sm:pt-40 sm:pb-32 relative z-10">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm mb-8 border border-white/20">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Available for new projects
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              We Build{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Digital Solutions
              </span>{' '}
              That Drive Your Business Forward
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
              Expert web development and automation services by Shlomi & Maor.
              From custom websites to seamless integrations - we bring your ideas to life.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 font-semibold px-8" asChild>
                <a href="#contact">Start Your Project</a>
              </Button>
              <Button size="lg" className="bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white/20 px-8" asChild>
                <a href="#services">View Services</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Our Services
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Comprehensive Digital Solutions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              We offer a range of services tailored to help your business thrive in the digital world.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.title} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white">
                <CardHeader>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <service.icon className="w-7 h-7" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Handled by <span className="font-semibold text-foreground">{service.assignee}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
                <Users className="w-4 h-4" />
                Meet the Team
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Experts Dedicated to Your Success
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                We are a duo of passionate professionals combining technical expertise with creative problem-solving
                to deliver exceptional results for every project.
              </p>

              <div className="space-y-4">
                {/* Shlomi */}
                <div className="flex items-center gap-4 p-5 rounded-xl bg-gradient-to-r from-blue-50 to-slate-50 border border-blue-100">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    S
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Shlomi</p>
                    <p className="text-muted-foreground">Web Developer</p>
                  </div>
                </div>

                {/* Maor */}
                <div className="flex items-center gap-4 p-5 rounded-xl bg-gradient-to-r from-purple-50 to-slate-50 border border-purple-100">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    M
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Maor</p>
                    <p className="text-muted-foreground">Automation Expert</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 text-center border">
                  <p className="text-3xl sm:text-4xl font-bold text-gradient mb-2">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
              <Clock className="w-4 h-4" />
              Quick Response
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Let&apos;s Work Together
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Ready to start your project? Fill out the form below and we&apos;ll get back to you within 24 hours.
            </p>
          </div>

          <ContactForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Logo"
                width={120}
                height={120}
                className="rounded-xl"
              />
            </div>
            <p className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
