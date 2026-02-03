export default function TermsPage() {
  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-6 max-w-3xl">
        <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-8">
          Terms of Service
        </h1>
        <p className="text-muted-foreground mb-8">
          Last updated: January 2026
        </p>

        <div className="prose prose-neutral max-w-none space-y-8">
          <section>
            <h2 className="font-serif text-2xl text-foreground mb-4">Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              VK Creative provides professional photography and videography services. 
              All services are subject to availability and must be booked in advance with 
              a signed contract and deposit.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-foreground mb-4">Booking & Payment</h2>
            <p className="text-muted-foreground leading-relaxed">
              A non-refundable retainer of 30% is required to secure your date. The remaining 
              balance is due 14 days before your event. We accept bank transfers, credit cards, 
              and checks. Payment plans are available upon request.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-foreground mb-4">Cancellation Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Cancellations made more than 90 days before the event will result in forfeiture 
              of the retainer. Cancellations within 90 days are subject to the full contract amount. 
              Date changes are accommodated when possible, subject to availability.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-foreground mb-4">Delivery</h2>
            <p className="text-muted-foreground leading-relaxed">
              Wedding galleries are delivered within 6-8 weeks. Portrait and brand sessions 
              are delivered within 2-3 weeks. Films and video content may require additional 
              time. Rush delivery is available for an additional fee.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-foreground mb-4">Copyright & Usage</h2>
            <p className="text-muted-foreground leading-relaxed">
              All images and videos are copyrighted by VK Creative. Clients receive a personal 
              use license for printing and sharing. Commercial use requires a separate license. 
              We retain the right to use images for portfolio and marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-foreground mb-4">Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              While we take every precaution with equipment and backup systems, our liability 
              is limited to the total amount paid for services. We are not responsible for 
              circumstances beyond our control that may affect the outcome of the session.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-foreground mb-4">Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              For questions about these terms, please contact us at hello@vkcreative.com. 
              Full service agreements are provided upon booking.
            </p>
          </section>
        </div>
      </div>
    </section>
  )
}
