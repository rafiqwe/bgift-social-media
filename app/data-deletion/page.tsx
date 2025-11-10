export default function DataDeletionPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-4">Data Deletion Instructions</h1>
      <p className="mb-4">
        In accordance with Facebook’s data privacy policy, users can request the
        deletion of their data collected through this app.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        How to Request Data Deletion
      </h2>
      <p>
        If you want to delete your account or remove your personal data from our
        system, please follow one of the options below:
      </p>

      <ul className="list-disc list-inside mt-3 space-y-2">
        <li>
          Send an email to{" "}
          <a
            href="mailto:youremail@example.com"
            className="text-blue-600 underline"
          >
            youremail@example.com
          </a>{" "}
          with the subject line <strong>“Delete My Data”</strong>.
        </li>
        <li>
          Include your full name and the email or account ID associated with
          your account.
        </li>
      </ul>

      <p className="mt-4">
        Once we receive your request, your data will be permanently deleted from
        our servers within 7 business days.
      </p>

      <p className="mt-6 text-sm text-gray-600">
        If you signed up using Facebook Login, this process will also remove
        your connection from the Facebook app.
      </p>
    </div>
  );
}
