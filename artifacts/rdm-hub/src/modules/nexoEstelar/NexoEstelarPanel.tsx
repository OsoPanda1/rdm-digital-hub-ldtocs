/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, File, FileText, Image, FileArchive, Trash2,
  Download, Share2, Search, HardDrive, BarChart3,
  Clock, Loader2, AlertCircle, X, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface StoredFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  base64?: string;
}

const STORAGE_KEY = "rdm_nexo_files";
const MAX_STORAGE_SIZE = 5 * 1024 * 1024; // 5MB for base64 storage

const RECENT_ACTIVITY = [
  { user: "Isabella", action: "subió", file: "memory_graph.json", time: "hace 2h" },
  { user: "Carlos", action: "descargó", file: "reporte_ventas.pdf", time: "hace 4h" },
  { user: "María", action: "compartió", file: "festival_poster.png", time: "hace 6h" },
  { user: "Admin", action: "eliminó", file: "cache_temp.tmp", time: "hace 8h" },
  { user: "Ana", action: "subió", file: "artesania_foto.jpg", time: "hace 1d" },
];

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function getFileIcon(type: string) {
  if (type.startsWith("image/")) return <Image className="h-4 w-4 text-pink-400" />;
  if (type.includes("pdf")) return <FileText className="h-4 w-4 text-red-400" />;
  if (type.includes("zip") || type.includes("archive")) return <FileArchive className="h-4 w-4 text-amber-400" />;
  return <File className="h-4 w-4 text-blue-400" />;
}

function loadFiles(): StoredFile[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveFiles(files: StoredFile[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
}

export default function NexoEstelarPanel() {
  const [files, setFiles] = useState<StoredFile[]>(loadFiles);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: ((e.clientX - rect.left) / rect.width - 0.5) * 10,
          y: ((e.clientY - rect.top) / rect.height - 0.5) * 10,
        });
      }
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  const processFiles = useCallback(async (fileList: FileList | File[]) => {
    const newFiles = Array.from(fileList);
    const validTypes = ["image/", "application/pdf", "text/"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    setUploading(true);
    setUploadProgress(0);
    setError(null);

    const processed: StoredFile[] = [];
    let totalSize = 0;

    for (let i = 0; i < newFiles.length; i++) {
      const f = newFiles[i];
      setUploadProgress(((i + 1) / newFiles.length) * 80);

      if (!validTypes.some((vt) => f.type.startsWith(vt))) {
        setError(`"${f.name}" — tipo no soportado`);
        continue;
      }
      if (f.size > maxSize) {
        setError(`"${f.name}" excede 10MB`);
        continue;
      }

      const stored: StoredFile = {
        id: `${Date.now()}-${i}`,
        name: f.name,
        size: f.size,
        type: f.type,
        uploadedAt: new Date().toISOString(),
      };

      totalSize += f.size;
      if (totalSize <= MAX_STORAGE_SIZE) {
        try {
          const b64 = await fileToBase64(f);
          stored.base64 = b64;
        } catch {
          // skip base64 for this file
        }
      }

      processed.push(stored);
    }

    setUploadProgress(100);
    const updated = [...files, ...processed];
    setFiles(updated);
    saveFiles(updated);

    setTimeout(() => {
      setUploading(false);
      setUploadProgress(0);
      if (processed.length > 0) {
        toast.success(`${processed.length} archivo(s) cargado(s)`);
      }
    }, 300);
  }, [files]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files);
      }
    },
    [processFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        processFiles(e.target.files);
        e.target.value = "";
      }
    },
    [processFiles]
  );

  const deleteFile = (id: string) => {
    const updated = files.filter((f) => f.id !== id);
    setFiles(updated);
    saveFiles(updated);
    toast.success("Archivo eliminado");
  };

  const downloadFile = (file: StoredFile) => {
    if (file.base64) {
      const a = document.createElement("a");
      a.href = file.base64;
      a.download = file.name;
      a.click();
    } else {
      toast.error("Archivo no disponible para descarga (solo metadata almacenada)");
    }
  };

  const copyShareLink = (file: StoredFile) => {
    navigator.clipboard.writeText(
      `${window.location.origin}/nexo-estelar?file=${file.id}`
    );
    toast.success("Enlace copiado");
  };

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSize = files.reduce((s, f) => s + f.size, 0);
  const typeBreakdown = files.reduce(
    (acc, f) => {
      if (f.type.startsWith("image/")) acc.images++;
      else if (f.type.includes("pdf")) acc.pdfs++;
      else acc.others++;
      return acc;
    },
    { images: 0, pdfs: 0, others: 0 }
  );

  return (
    <div ref={containerRef} className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-16 space-y-8">
        {/* Hero */}
        <section className="text-center space-y-4 relative pt-4">
          <div
            className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-10 blur-3xl pointer-events-none"
            style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)",
              transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
              Nexo{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Estelar
              </span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-xl mx-auto">
              Centro de Intercambio Digital — Sube, organiza y comparte archivos del ecosistema RDM.
            </p>
          </motion.div>
        </section>

        <div className="grid lg:grid-cols-[1fr_280px] gap-6">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Upload Zone */}
            <Card
              className={`
                relative overflow-hidden border-2 border-dashed transition-all duration-300 cursor-pointer
                ${isDragOver
                  ? "border-blue-400 bg-blue-500/5"
                  : "border-muted hover:border-primary/30"
                }
              `}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.txt,.csv,.json,.md"
                className="hidden"
                onChange={handleFileSelect}
              />
              <div className="p-8 sm:p-12 flex flex-col items-center gap-4 text-center">
                <div className={`
                  w-16 h-16 rounded-full flex items-center justify-center transition-all
                  ${isDragOver ? "bg-blue-500/20 scale-110" : "bg-muted"}
                `}>
                  <Upload className={`h-7 w-7 ${isDragOver ? "text-blue-400" : "text-muted-foreground"}`} />
                </div>
                <div>
                  <p className="font-semibold text-sm">
                    {isDragOver ? "Suelta los archivos aquí" : "Arrastra archivos o haz clic para seleccionar"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Imágenes, PDFs, texto — Máx 10MB por archivo
                  </p>
                </div>
              </div>

              {/* Upload Progress */}
              {uploading && (
                <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Loader2 className="h-3 w-3 animate-spin text-blue-400" />
                    <span className="text-xs text-muted-foreground">Subiendo...</span>
                  </div>
                  <Progress value={uploadProgress} className="h-1.5" />
                </div>
              )}
            </Card>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
                <button onClick={() => setError(null)} className="ml-auto">
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            {/* Search */}
            {files.length > 0 && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar archivos..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            )}

            {/* File List */}
            {filteredFiles.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                  Archivos ({filteredFiles.length})
                </p>
                <AnimatePresence>
                  {filteredFiles.map((file) => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <Card className="p-3 sm:p-4 hover:bg-accent/30 transition-colors">
                        <div className="flex items-center gap-3">
                          {getFileIcon(file.type)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                              <span>{formatBytes(file.size)}</span>
                              <span>·</span>
                              <span>{new Date(file.uploadedAt).toLocaleDateString("es-MX")}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={(e) => { e.stopPropagation(); copyShareLink(file); }}
                              title="Compartir"
                            >
                              <Share2 className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={(e) => { e.stopPropagation(); downloadFile(file); }}
                              title="Descargar"
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:text-destructive"
                              onClick={(e) => { e.stopPropagation(); deleteFile(file.id); }}
                              title="Eliminar"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : files.length === 0 ? (
              <Card className="p-12 text-center">
                <File className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-sm text-muted-foreground">
                  No hay archivos aún. Arrastra o selecciona archivos para empezar.
                </p>
              </Card>
            ) : (
              <Card className="p-8 text-center">
                <Search className="h-8 w-8 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">
                  No se encontraron archivos para "{searchQuery}"
                </p>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <Card className="p-5 space-y-4">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Estadísticas
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total archivos</span>
                  <span className="font-medium">{files.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tamaño total</span>
                  <span className="font-medium">{formatBytes(totalSize)}</span>
                </div>
                <div className="border-t pt-3 space-y-2">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    Por tipo
                  </p>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Image className="h-3 w-3 text-pink-400" /> Imágenes
                    </span>
                    <span>{typeBreakdown.images}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <FileText className="h-3 w-3 text-red-400" /> PDFs
                    </span>
                    <span>{typeBreakdown.pdfs}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <File className="h-3 w-3 text-blue-400" /> Otros
                    </span>
                    <span>{typeBreakdown.others}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-5 space-y-4">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Actividad Reciente
              </h3>
              <div className="space-y-3">
                {RECENT_ACTIVITY.map((a, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="h-3 w-3 mt-1 text-emerald-500 shrink-0" />
                    <div>
                      <p className="text-xs">
                        <span className="font-medium">{a.user}</span>{" "}
                        <span className="text-muted-foreground">{a.action}</span>{" "}
                        <span className="font-medium">{a.file}</span>
                      </p>
                      <p className="text-[10px] text-muted-foreground">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
