export default function PrivacyPage() {
  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-6 max-w-3xl">
        <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-8">
          Privacy Policy
        </h1>
        <p className="text-muted-foreground mb-8">
          Last updated: January 2026
        </p>

        <div className="prose prose-neutral max-w-none space-y-8">
          <section>
            <h2 className="font-serif text-2xl text-foreground mb-4">Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed">
              We collect information you provide directly to us, such as when you fill out a contact form, 
              subscribe to our newsletter, or communicate with us via email. This may include your name, 
              email address, phone number, and details about your event or project.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-foreground mb-4">How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use the information we collect to respond to your inquiries, provide our photography 
              and videography services, send you updates about your project, and communicate with you 
              about promotions or new services that may interest you.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-foreground mb-4">Information Sharing</h2>
            <p className="text-muted-foreground leading-relaxed">
              We do not sell, trade, or otherwise transfer your personal information to outside parties. 
              This does not include trusted third parties who assist us in operating our website or 
              servicing you, so long as those parties agree to keep this information confidential.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-foreground mb-4">Image Usage</h2>
            <p className="text-muted-foreground leading-relaxed">
              Unless otherwise agreed in writing, we reserve the right to use images from your session 
              for portfolio, marketing, and promotional purposes. We will never sell your images to 
              third parties without your explicit consent.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-foreground mb-4">Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our website may use cookies to enhance your experience. You can choose to have your 
              computer warn you each time a cookie is being sent, or you can choose to turn off 
              all cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-foreground mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at 
              hello@vkcreative.com.
            </p>
          </section>
        </div>
      </div>
    </section>
  )
}
