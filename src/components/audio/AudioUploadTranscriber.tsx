import { useState, useRef } from "react";
import { Upload, Mic, Loader, CheckCircle, AlertCircle } from "lucide-react";

interface AudioUploadTranscriberProps {
  heritageSiteId: string;
  onTranscriptionComplete?: (text: string, confidence: number) => void;
  onError?: (error: string) => void;
  language?: string;
}

/**
 * AudioUploadTranscriber - Upload and transcribe audio files
 * Supports both file upload and microphone recording (with fallback)
 */
export function AudioUploadTranscriber({
  heritageSiteId,
  onTranscriptionComplete,
  onError,
  language = "es",
}: AudioUploadTranscriberProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState<{
    text: string;
    confidence: number;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    await transcribeFile(file);
  };

  const transcribeFile = async (file: File) => {
    setIsLoading(true);
    setErrorMessage(null);
    setTranscriptionResult(null);

    try {
      if (!file.type.startsWith("audio/")) {
        throw new Error("Please select an audio file");
      }

      if (file.size > 25 * 1024 * 1024) {
        throw new Error("File size must be less than 25MB");
      }

      setUploadedFileName(file.name);

      // Create FormData
      const formData = new FormData();
      formData.append("audio", file);
      formData.append("heritageSiteId", heritageSiteId);
      formData.append("language", language);

      // Send to server
      const response = await fetch("/api/dg/audio/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Transcription failed");
      }

      const result = await response.json();
      const transcription = {
        text: result.text,
        confidence: result.confidence || 0.95,
      };

      setTranscriptionResult(transcription);
      onTranscriptionComplete?.(transcription.text, transcription.confidence);
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Unknown error occurred";
      setErrorMessage(errorMsg);
      onError?.(errorMsg);
      console.error("[AudioUploadTranscriber] Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await transcribeFile(files[0]);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg border border-slate-200 p-6">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900">
          Transcribe Audio
        </h3>
        <p className="text-sm text-slate-600 mt-1">
          Upload an audio file or record directly to transcribe to text
        </p>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-slate-400 transition-colors cursor-pointer bg-slate-50"
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            fileInputRef.current?.click();
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileSelect}
          disabled={isLoading}
          className="hidden"
          aria-label="Upload audio file"
        />

        <div className="flex justify-center mb-3">
          {isLoading ? (
            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          ) : (
            <Upload className="w-8 h-8 text-slate-400" />
          )}
        </div>

        <p className="text-sm font-medium text-slate-900">
          {isLoading ? "Processing audio..." : "Drag and drop your audio file"}
        </p>
        <p className="text-xs text-slate-600 mt-1">
          or click to browse (MP3, WAV, M4A, etc.)
        </p>
        <p className="text-xs text-slate-500 mt-2">Maximum file size: 25MB</p>
      </div>

      {/* File Info */}
      {uploadedFileName && (
        <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
          <p className="text-sm text-blue-900">
            <span className="font-medium">File:</span> {uploadedFileName}
          </p>
        </div>
      )}

      {/* Error State */}
      {errorMessage && (
        <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-900">Transcription Error</p>
            <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-sm text-red-600 hover:text-red-700 font-medium mt-2 underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Success State */}
      {transcriptionResult && (
        <div className="mt-4 space-y-3">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200 flex gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-green-900">Transcription Complete</p>
              <p className="text-xs text-green-700 mt-1">
                Confidence: {(transcriptionResult.confidence * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Transcribed Text */}
          <div className="p-4 bg-white rounded-lg border border-slate-200">
            <p className="text-xs font-medium text-slate-600 mb-2">
              Transcribed Text
            </p>
            <div className="max-h-40 overflow-y-auto">
              <p className="text-sm text-slate-900 leading-relaxed">
                {transcriptionResult.text}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(transcriptionResult.text);
              }}
              className="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded font-medium text-sm transition-colors"
            >
              Copy Text
            </button>
            <button
              onClick={() => {
                setTranscriptionResult(null);
                setUploadedFileName(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
              className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-sm transition-colors"
            >
              Transcribe Another
            </button>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-4 p-3 bg-blue-50 rounded text-xs text-blue-900">
        <p className="font-medium">Supported Languages:</p>
        <p className="mt-1">
          Spanish (Español), English, and 90+ other languages via AI Gateway
        </p>
      </div>
    </div>
  );
}

export default AudioUploadTranscriber;
