import { useState } from "react";
import { Send, Plus, Loader, CheckCircle, AlertCircle, Music } from "lucide-react";

interface HeritageAudioManagerProps {
  onNarrationCreated?: (narration: any) => void;
}

/**
 * AdminAudioManager - Admin dashboard for creating heritage site narrations
 * Allows admins to input site descriptions and generate audio via AI Gateway
 */
export function AdminAudioManager({
  onNarrationCreated,
}: HeritageAudioManagerProps) {
  const [formData, setFormData] = useState({
    siteName: "",
    siteSlug: "",
    siteId: "",
    description: "",
    voiceId: "nova",
    language: "es",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(
    null
  );

  const voices = [
    { id: "alloy", name: "Alloy (Neutral)" },
    { id: "echo", name: "Echo (Deep)" },
    { id: "fable", name: "Fable (Storytelling)" },
    { id: "onyx", name: "Onyx (Male)" },
    { id: "nova", name: "Nova (Female)" },
    { id: "shimmer", name: "Shimmer (Bright)" },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenerateSpeech = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.siteName ||
      !formData.siteId ||
      !formData.description ||
      !formData.siteSlug
    ) {
      setErrorMessage("All fields are required");
      return;
    }

    if (formData.description.length < 50) {
      setErrorMessage("Description must be at least 50 characters");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setGeneratedAudioUrl(null);

    try {
      const response = await fetch("/api/dg/audio/generate-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: formData.description,
          heritageSiteId: formData.siteId,
          voiceId: formData.voiceId,
          siteSlug: formData.siteSlug,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Speech generation failed");
      }

      const result = await response.json();

      setGeneratedAudioUrl(result.audioUrl);
      setSuccessMessage(
        `Narration generated successfully! Duration: ${(result.audioFile?.durationSeconds || 0).toFixed(0)}s`
      );

      onNarrationCreated?.(result);

      // Reset form after success
      setTimeout(() => {
        setFormData({
          siteName: "",
          siteSlug: "",
          siteId: "",
          description: "",
          voiceId: "nova",
          language: "es",
        });
      }, 2000);
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Unknown error occurred";
      setErrorMessage(errorMsg);
      console.error("[AdminAudioManager] Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg border border-slate-200 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Music className="w-6 h-6 text-amber-600" />
          <h2 className="text-2xl font-bold text-slate-900">
            Heritage Audio Manager
          </h2>
        </div>
        <p className="text-slate-600">
          Create AI-generated narrations for heritage sites using text-to-speech
        </p>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200 flex gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-green-900">Success!</p>
            <p className="text-sm text-green-700">{successMessage}</p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 p-4 bg-red-50 rounded-lg border border-red-200 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-900">Error</p>
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleGenerateSpeech} className="space-y-4">
        {/* Site Name */}
        <div>
          <label
            htmlFor="siteName"
            className="block text-sm font-medium text-slate-900 mb-1"
          >
            Heritage Site Name *
          </label>
          <input
            id="siteName"
            name="siteName"
            type="text"
            value={formData.siteName}
            onChange={handleInputChange}
            placeholder="E.g., Real del Monte Historic Town"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 text-slate-900"
            disabled={isLoading}
          />
        </div>

        {/* Site ID & Slug Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="siteId"
              className="block text-sm font-medium text-slate-900 mb-1"
            >
              Site ID *
            </label>
            <input
              id="siteId"
              name="siteId"
              type="text"
              value={formData.siteId}
              onChange={handleInputChange}
              placeholder="site_001"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 text-slate-900"
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="siteSlug"
              className="block text-sm font-medium text-slate-900 mb-1"
            >
              URL Slug *
            </label>
            <input
              id="siteSlug"
              name="siteSlug"
              type="text"
              value={formData.siteSlug}
              onChange={handleInputChange}
              placeholder="real-del-monte-historic"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 text-slate-900"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-slate-900 mb-1"
          >
            Site Description * (minimum 50 characters)
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Write a detailed description of the heritage site that will be converted to speech..."
            rows={5}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 text-slate-900 font-sans"
            disabled={isLoading}
          />
          <p className="text-xs text-slate-600 mt-1">
            {formData.description.length} characters
          </p>
        </div>

        {/* Voice Selection Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="voiceId"
              className="block text-sm font-medium text-slate-900 mb-1"
            >
              Voice Style
            </label>
            <select
              id="voiceId"
              name="voiceId"
              value={formData.voiceId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 text-slate-900 bg-white"
              disabled={isLoading}
            >
              {voices.map((voice) => (
                <option key={voice.id} value={voice.id}>
                  {voice.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="language"
              className="block text-sm font-medium text-slate-900 mb-1"
            >
              Language
            </label>
            <select
              id="language"
              name="language"
              value={formData.language}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 text-slate-900 bg-white"
              disabled={isLoading}
            >
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Generate Narration
              </>
            )}
          </button>
        </div>
      </form>

      {/* Generated Audio Preview */}
      {generatedAudioUrl && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm font-medium text-green-900 mb-3">
            Preview Generated Audio
          </p>
          <audio
            controls
            src={generatedAudioUrl}
            className="w-full rounded"
            crossOrigin="anonymous"
          />
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-900">
        <p className="font-medium mb-2">How it works:</p>
        <ol className="list-decimal list-inside space-y-1 text-xs">
          <li>Enter heritage site details and description</li>
          <li>Select a voice style for the narration</li>
          <li>Click "Generate Narration" to create audio via AI Gateway</li>
          <li>Audio is stored in Supabase and linked to the heritage site</li>
          <li>Narration appears in the public heritage gallery</li>
        </ol>
      </div>
    </div>
  );
}

export default AdminAudioManager;
