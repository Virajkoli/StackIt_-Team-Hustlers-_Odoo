"use client";

import { useSession } from "next-auth/react";

export default function SessionDebug() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="p-4 bg-yellow-100 text-yellow-800 rounded">Loading session...</div>;
  }

  if (!session) {
    return <div className="p-4 bg-red-100 text-red-800 rounded">No session found</div>;
  }

  return (
    <div className="p-4 bg-blue-100 text-blue-800 rounded mb-4">
      <h3 className="font-bold mb-2">Session Debug Info:</h3>
      <pre className="text-xs overflow-auto">
        {JSON.stringify(session, null, 2)}
      </pre>
      <div className="mt-2">
        <p><strong>User Role:</strong> {session.user?.role || 'undefined'}</p>
        <p><strong>Is Admin:</strong> {session.user?.role === 'ADMIN' ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
}
