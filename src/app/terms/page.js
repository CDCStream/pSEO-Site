import { FileText } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service - MakerSilo',
  description: 'Terms of Service for MakerSilo. Read our terms and conditions for using our free online tools.',
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0b] via-[#0f0f10] to-[#0a0a0b]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-6">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-gray-400">Last updated: February 5, 2026</p>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-lg max-w-none">
          <div className="bg-white/5 rounded-2xl border border-white/10 p-8 space-y-8">

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Agreement to Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                By accessing and using MakerSilo (makersilo.com), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Description of Services</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                MakerSilo provides free online tools including but not limited to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Text generators and converters</li>
                <li>Meme generators</li>
                <li>Symbol and emoji libraries</li>
                <li>Wallpaper and background generators</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                All tools are provided "as is" and are processed locally in your browser.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. User Responsibilities</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                When using our services, you agree to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Use our tools for lawful purposes only</li>
                <li>Not create content that is illegal, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable</li>
                <li>Not attempt to interfere with or disrupt our services</li>
                <li>Not use automated systems to access our services without permission</li>
                <li>Respect intellectual property rights of others</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Intellectual Property</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                <strong className="text-white">Our Content:</strong> The MakerSilo website, including its design, logos, and original content, is protected by copyright and other intellectual property laws.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                <strong className="text-white">Your Content:</strong> You retain all rights to the content you create using our tools. We do not claim ownership of any text, images, or other content you generate.
              </p>
              <p className="text-gray-300 leading-relaxed">
                <strong className="text-white">Third-Party Content:</strong> Some meme templates and images may be subject to third-party copyrights. Users are responsible for ensuring their use complies with applicable laws and fair use guidelines.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Disclaimer of Warranties</h2>
              <p className="text-gray-300 leading-relaxed">
                Our services are provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied. We do not warrant that our services will be uninterrupted, error-free, or free of viruses or other harmful components. We make no warranties regarding the accuracy, reliability, or availability of our tools.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Limitation of Liability</h2>
              <p className="text-gray-300 leading-relaxed">
                To the fullest extent permitted by law, MakerSilo shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services. This includes but is not limited to damages for loss of profits, data, or other intangible losses.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Acceptable Use</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                You may not use our services to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Create or distribute illegal content</li>
                <li>Infringe on intellectual property rights</li>
                <li>Spread malware or engage in hacking activities</li>
                <li>Harass, abuse, or harm others</li>
                <li>Engage in fraudulent activities</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Modifications to Services</h2>
              <p className="text-gray-300 leading-relaxed">
                We reserve the right to modify, suspend, or discontinue any part of our services at any time without prior notice. We may also update these terms from time to time, and your continued use of our services constitutes acceptance of any changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Third-Party Links</h2>
              <p className="text-gray-300 leading-relaxed">
                Our website may contain links to third-party websites or services. We are not responsible for the content, privacy policies, or practices of any third-party sites or services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. Indemnification</h2>
              <p className="text-gray-300 leading-relaxed">
                You agree to indemnify and hold harmless MakerSilo and its affiliates from any claims, damages, losses, or expenses arising from your use of our services or violation of these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">11. Governing Law</h2>
              <p className="text-gray-300 leading-relaxed">
                These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">12. Severability</h2>
              <p className="text-gray-300 leading-relaxed">
                If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">13. Contact Us</h2>
              <p className="text-gray-300 leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <p className="text-purple-400 mt-2">contact@makersilo.com</p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
