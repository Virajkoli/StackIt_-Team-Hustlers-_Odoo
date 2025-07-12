"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Trash2, Shield, AlertTriangle } from "lucide-react";

export default function AdminActions({ contentType, contentId, onDelete }) {
  const { data: session } = useSession();
  const [isDeleting, setIsDeleting] = useState(false);

  // Only show for admin users
  if (!session || session.user.role !== "ADMIN") {
    return null;
  }

  const handleDelete = async () => {
    const contentName = contentType === "question" ? "question" : "answer";
    
    if (!confirm(`Are you sure you want to delete this ${contentName}? This action cannot be undone.`)) {
      return;
    }

    try {
      setIsDeleting(true);
      
      const params = new URLSearchParams();
      if (contentType === "question") {
        params.append("questionId", contentId);
      } else {
        params.append("answerId", contentId);
      }

      const response = await fetch(`/api/admin/moderate?${params}`, {
        method: "DELETE"
      });

      if (response.ok) {
        if (onDelete) {
          onDelete(contentId);
        } else {
          // Refresh the page if no callback provided
          window.location.reload();
        }
      } else {
        const data = await response.json();
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error deleting content:", error);
      alert("Error deleting content");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-red-100">
      <div className="flex items-center gap-1 text-xs text-red-600">
        <Shield className="w-3 h-3" />
        <span>Admin Actions:</span>
      </div>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="flex items-center gap-1 px-2 py-1 text-xs bg-red-100 text-red-700 hover:bg-red-200 rounded transition-colors disabled:opacity-50"
        title={`Delete ${contentType}`}
      >
        <Trash2 className="w-3 h-3" />
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
}
