export const metadata = {
  title: 'Terms of Service - TextForge',
  description: 'TextForge terms of service. Read our usage guidelines.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>

      <div className="prose prose-invert prose-lg max-w-none space-y-6">
        <p className="text-gray-400">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">1. Acceptance of Terms</h2>
          <p className="text-gray-400">
            By accessing and using TextForge, you agree to be bound by these Terms of Service.
            If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">2. Use of Service</h2>
          <p className="text-gray-400">
            TextForge provides free online tools for text transformation, symbol copying,
            meme creation, and wallpaper generation. These tools are provided "as is" without
            warranties of any kind.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">3. User Conduct</h2>
          <p className="text-gray-400">
            You agree to use our services responsibly and not to create content that is
            illegal, harmful, threatening, abusive, harassing, defamatory, or otherwise
            objectionable.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">4. Intellectual Property</h2>
          <p className="text-gray-400">
            Content you create using our tools belongs to you. The TextForge platform,
            including its design, code, and branding, remains our intellectual property.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">5. Limitation of Liability</h2>
          <p className="text-gray-400">
            TextForge shall not be liable for any indirect, incidental, special, consequential,
            or punitive damages resulting from your use of or inability to use the service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">6. Changes to Terms</h2>
          <p className="text-gray-400">
            We reserve the right to modify these terms at any time. Continued use of the
            service after changes constitutes acceptance of the new terms.
          </p>
        </section>
      </div>
    </div>
  );
}

