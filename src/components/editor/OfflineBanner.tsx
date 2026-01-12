export default function OfflineBanner({ online }: { online: boolean }) {
  if (online) return null;
  return (
    <div className="rounded bg-yellow-50 border border-yellow-200 p-2 text-yellow-800 text-sm">
      You’re offline. Edits will sync automatically when you reconnect.
    </div>
  );
}
