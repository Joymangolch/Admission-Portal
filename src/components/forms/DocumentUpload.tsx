"use client";

import React from "react";
import { uploadDocument } from "@/lib/storage/upload";
import { Loader2, Upload, CheckCircle2, X } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { useState } from "react";

interface DocumentUploadProps {
  applicationId: string;
  type: string;
  label: string;
  initialValue?: string;
  onUploadSuccess: (url: string) => void;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  applicationId,
  type,
  label,
  initialValue,
  onUploadSuccess,
}) => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState(initialValue || "");
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file || !user) return;
    setUploading(true);
    setError("");
    try {
      const result = await uploadDocument(user.uid, type, file);
      const token = await user.getIdToken();
      const res = await fetch("/api/document/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          applicationId,
          type,
          fileUrl: result.url,
          fileName: result.fileName,
        }),
      });
      const resData = await res.json();
      if (resData.success) {
        setUrl(result.url);
        onUploadSuccess(result.url);
      } else {
        throw new Error(resData.error);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-50 last:border-none">
      {/* Name + Status */}
      <div className="min-w-0">
        <p className="text-[13px] font-bold text-slate-700 truncate leading-tight">
          {label}
        </p>
        
        {url ? (
          <div className="flex items-center gap-1 mt-0.5 text-[10px] font-bold text-green-700 uppercase tracking-tighter">
            <CheckCircle2 size={10} aria-hidden="true" />
            Uploaded Successfully
          </div>
        ) : (
          <p className="text-[10px] text-slate-400 mt-0.5 font-medium uppercase tracking-tighter">
            Required: PDF/Image (Max 5MB)
          </p>
        )}
        
        {error && (
          <p className="text-[10px] font-bold text-red-600 mt-0.5 uppercase tracking-tighter" role="alert">
            {error}
          </p>
        )}
      </div>

      {/* Actions (Right Aligned) */}
      <div className="flex items-center gap-2 shrink-0">
        {uploading ? (
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary animate-pulse">
            <Loader2 size={12} className="animate-spin" aria-hidden="true" />
            UPLOADING...
          </div>
        ) : url ? (
          <div className="flex items-center gap-3">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-black underline decoration-primary/30 underline-offset-2 hover:text-primary transition-colors uppercase tracking-tight"
              style={{ color: "var(--gov-navy)" }}
            >
              View
            </a>
            <button
              type="button"
              onClick={() => {
                setUrl("");
                setFile(null);
              }}
              className="p-1.5 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-600 transition-all border border-transparent hover:border-red-100"
              aria-label={`Remove ${label}`}
            >
              <X size={12} aria-hidden="true" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="relative">
              <label
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-tight border transition-all cursor-pointer ${
                  file ? "bg-slate-100 border-slate-300 text-slate-700" : "bg-white border-slate-200 text-slate-500 hover:border-primary/50 hover:text-primary"
                }`}
                tabIndex={0}
              >
                {file ? (file.name.length > 15 ? file.name.substring(0, 12) + "..." : file.name) : "Select File"}
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </label>
            </div>
            
            {file && (
              <button
                type="button"
                onClick={handleUpload}
                className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white text-[10px] font-black rounded uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm"
              >
                <Upload size={12} aria-hidden="true" />
                Upload
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
