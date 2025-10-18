export default function BlockOverlay({ appName }) {
  return (
    <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center text-white z-[9999]">
      <h1 className="text-3xl font-bold mb-4">Stay Focused 🔒</h1>
      <p className="text-lg mb-6">
        {appName ? `${appName} is blocked during focus mode.` : 'Focus mode is active.'}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="bg-blue-500 px-4 py-2 rounded-lg font-semibold hover:bg-blue-600"
      >
        Return to Work
      </button>
    </div>
  );
}
