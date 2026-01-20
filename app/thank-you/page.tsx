import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Calendar } from 'lucide-react';

// Calendly URL with UTM tracking
const CALENDLY_URL = 'https://calendly.com/maor1213-mk?utm_source=landing&utm_medium=thank_you&utm_campaign=lead';

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-lg text-center shadow-xl border-0">
        <CardHeader className="pb-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
          </div>
          <CardTitle className="text-xl sm:text-2xl">We Got Your Message!</CardTitle>
          <CardDescription className="text-base">
            Thank you for reaching out. To speed things up - schedule a meeting now.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button
            asChild
            size="lg"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 sm:py-6"
          >
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Schedule a Meeting
            </a>
          </Button>

          <p className="text-sm text-muted-foreground">
            Prefer not to schedule now? No problem - we&apos;ll get back to you within 24 hours.
          </p>

          <Button variant="ghost" asChild className="w-full">
            <a href="/">Back to Home</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
