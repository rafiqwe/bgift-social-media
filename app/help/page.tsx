// app/help/page.tsx
export default function HelpPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-4">Help & Support</h1>
      <p className="mb-6">
        Need assistance? We’re here to help. Below are some common questions and
        ways to reach us for support.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        1. How do I create an account?
      </h2>
      <p>
        You can sign up easily using your email or social login options. Once
        registered, you’ll have full access to all features.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        2. I forgot my password. What should I do?
      </h2>
      <p>
        Click the <strong>“Forgot Password”</strong> link on the login page and
        follow the instructions to reset your password securely.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        3. I can’t log in with my social account
      </h2>
      <p>
        Make sure your app permissions are granted. If the issue continues,
        clear your browser cookies and try again, or contact us.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        4. How do I delete my account?
      </h2>
      <p>
        If you wish to delete your account permanently, please contact our
        support team with your registered email address.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Need more help?</h2>
      <p>Reach out anytime — we’ll respond within 24–48 hours.</p>

      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <p className="text-lg font-medium">📩 Contact Support</p>
        <p>
          Email:{" "}
          <a
            href="mailto:muhammedrabbi.dev@gmail.com"
            className="text-blue-600 underline"
          >
            muhammedrabbi.dev@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
