export const metadata = {
  title: 'Privacy Policy - MakerSilo',
  description: 'MakerSilo privacy policy. Learn how we handle your data.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>

      <div className="prose prose-invert prose-lg max-w-none space-y-6">
        <p className="text-gray-400">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">1. Introduction</h2>
          <p className="text-gray-400">
            MakerSilo ("we", "our", or "us") is committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, and safeguard your information
            when you use our website.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">2. Information We Collect</h2>
          <p className="text-gray-400">
            MakerSilo operates entirely in your browser. We do not collect, store, or transmit
            any personal information you enter into our tools. All text transformations,
            meme creations, and wallpaper generations happen locally on your device.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">3. Cookies and Analytics</h2>
          <p className="text-gray-400">
            We may use cookies and similar tracking technologies to track activity on our
            website and improve our services. You can instruct your browser to refuse all
            cookies or to indicate when a cookie is being sent.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">4. Third-Party Services</h2>
          <p className="text-gray-400">
            We may display advertisements from third-party ad networks (such as Google AdSense).
            These services may use cookies to serve ads based on your prior visits to our
            website or other websites.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">5. Contact Us</h2>
          <p className="text-gray-400">
            If you have questions about this Privacy Policy, please contact us through our website.
          </p>
        </section>
      </div>
    </div>
  );
}


