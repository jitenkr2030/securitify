export default function SimpleTest() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Simple Test Page</h1>
        <p className="text-xl text-muted-foreground mb-8">
          If you can see this page, the redirect loop is fixed!
        </p>
        <div className="space-y-4">
          <a href="/auth/signin" className="inline-block">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              Test Sign In
            </button>
          </a>
          <a href="/auth-test" className="inline-block ml-4">
            <button className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50">
              Test Auth Status
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}