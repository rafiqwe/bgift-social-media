// app/terms/page.tsx
export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
      <p className="mb-4">
        By accessing or using our website and services, you agree to these Terms
        of Service. Please read them carefully.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Use of Service</h2>
      <p>
        You agree to use our services only for lawful purposes and in accordance
        with applicable laws and regulations.
      </p>
      <p className="text-sm text-gray-600 mb-6">
        Effective date: <time dateTime="2025-11-10">November 10, 2025</time>
      </p>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Overview</h2>
        <p className="mb-2">
          These Terms govern your access to and use of our social platform,
          including profiles, posts, messaging, and community features. They
          describe responsibilities, permitted uses, and how we handle reports
          and enforcement to keep the community safe and welcoming.
        </p>
        <p className="text-sm text-gray-600">
          If you are using our services on behalf of an organization, you
          represent that you have the authority to bind that organization to
          these Terms.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Key Definitions</h2>
        <ul className="list-disc pl-5 space-y-1 text-gray-700">
          <li>
            <strong>Service:</strong> the website, mobile apps, APIs, and
            related features we provide.
          </li>
          <li>
            <strong>Content:</strong> text, images, video, audio, profiles,
            messages and other material you or others post.
          </li>
          <li>
            <strong>Community Standards:</strong> rules that govern acceptable
            behavior on the platform.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">
          User Conduct & Community Standards
        </h2>
        <p className="mb-2">
          You agree to act respectfully and lawfully. Prohibited behavior
          includes harassment, hate speech, threats, impersonation, doxxing, and
          posting illegal or infringing content.
        </p>
        <ul className="list-decimal pl-5 space-y-1 text-gray-700">
          <li>Be honest and identify yourself accurately.</li>
          <li>Respect others{"'"} privacy and intellectual property.</li>
          <li>
            Do not exploit platform features to harass, spam, or manipulate.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Reporting & Enforcement</h2>
        <p className="mb-2">
          If you encounter content or behavior that violates these Terms or our
          Community Standards, please report it using the in-app reporting tools
          or email{" "}
          <a
            href="mailto:safety@example.com"
            className="text-blue-600 underline"
          >
            safety@example.com
          </a>
          .
        </p>
        <p className="text-sm text-gray-600">
          We review reports and may remove content, issue warnings, suspend
          accounts, or take other actions as needed. We may also escalate
          serious matters to law enforcement when required.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">
          Data, Privacy & Third Parties
        </h2>
        <p className="mb-2">
          Our Privacy Policy explains how we collect, use, and share
          information. By using the Service you consent to those practices; see{" "}
          <a href="/privacy" className="text-blue-600 underline">
            Privacy Policy
          </a>{" "}
          for details.
        </p>
        <p className="text-sm text-gray-600">
          We may integrate with third-party services (e.g., analytics, payment
          providers). Those services are subject to their own terms and privacy
          practices.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Intellectual Property</h2>
        <p className="mb-2">
          You retain ownership of your Content but grant us a worldwide,
          non-exclusive, royalty-free license to operate, display, and
          distribute it as needed to provide the Service. Do not post content
          you do not have rights to.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Changes & Contact</h2>
        <p className="mb-2">
          We may update these Terms from time to time. Material changes will be
          communicated via the app or email. Continued use after changes
          constitutes acceptance.
        </p>
        <p className="text-sm text-gray-600">
          Questions? Contact us at{" "}
          <a
            href="mailto:muhammedrabbi.dev@gmail.com"
            className="text-blue-600 underline"
          >
            muhammedrabbi.dev@gmail.com
          </a>{" "}
          or visit{" "}
          <a href="/help" className="text-blue-600 underline">
            Help Center
          </a>
          .
        </p>
      </section>
      {/* <h2 className="text-xl font-semibold mt-6 mb-2">2. Accounts</h2>
      <p>
        You are responsible for maintaining the confidentiality of your account
        and agree not to share your credentials with others.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Content</h2>
      <p>
        All materials provided on this website are for informational or
        personal use only. Unauthorized reproduction or distribution is
        prohibited.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Termination</h2>
      <p>
        We may suspend or terminate your access to the service at any time if
        you violate these terms.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Limitation of Liability</h2>
      <p>
        We are not liable for any damages arising from your use of our site or
        inability to access it.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Contact</h2>
      <p>
        If you have any questions about these Terms, contact us at{" "}
        <a href="mailto:muhammedrabbi.dev@gmail.com" className="text-blue-600 underline">
          muhammedrabbi.dev@gmail.com
        </a>.
      </p> */}
    </div>
  );
}
