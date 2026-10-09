'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, Check, RefreshCw, AlertTriangle, UploadCloud } from 'lucide-react';
import { QC_ISSUE_TYPE, QC_ISSUE_LABELS, type QcIssueType } from '@sikucek/shared';
import type { PosQcPhoto } from '../../lib/orders-store';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (photo: PosQcPhoto) => void;
}

export function CameraModal({ isOpen, onClose, onCapture }: CameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<QcIssueType>('stain');
  const [description, setDescription] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize camera stream when modal opens
  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    setErrorMessage(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Kamera WebRTC tidak didukung pada browser ini.');
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' }, // Utamakan kamera belakang pada tablet/HP
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setStream(mediaStream);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.warn('Gagal mengakses kamera:', err);
      setIsCameraActive(false);
      setErrorMessage(
        err.message || 'Izin kamera ditolak atau perangkat tidak memiliki kamera aktif. Anda dapat mengunggah file foto sebagai gantinya.'
      );
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  // Compress and capture photo to WebP
  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Compress to WebP quality 0.8
    const webpUrl = canvas.toDataURL('image/webp', 0.8);
    setCapturedImage(webpUrl);
    stopCamera();
  };

  // Fallback for desktop or file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const maxDimension = 1200;
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const webpUrl = canvas.toDataURL('image/webp', 0.8);
          setCapturedImage(webpUrl);
          stopCamera();
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleSave = () => {
    if (!capturedImage) return;

    const newPhoto: PosQcPhoto = {
      id: 'qc-' + Date.now(),
      photo_url: capturedImage,
      issue_type: selectedIssue,
      description: description.trim() || undefined,
      created_at: new Date().toISOString(),
    };

    onCapture(newPhoto);
    setCapturedImage(null);
    setDescription('');
    setSelectedIssue('stain');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-sky-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Kamera Quality Control (QC)</h3>
              <p className="text-[11px] text-slate-500">Mencegah sengketa cacat pakaian awal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewport */}
        <div className="p-4 space-y-4">
          <canvas ref={canvasRef} className="hidden" />

          {!capturedImage ? (
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-[4/3] flex items-center justify-center border border-slate-800">
              {isCameraActive ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-sky-400/50 m-4 rounded-xl flex items-center justify-center">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-sky-300 bg-slate-900/60 px-2 py-1 rounded">
                      Fokuskan pada Titik Noda / Cacat
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center p-6 space-y-3">
                  <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
                  <p className="text-xs text-slate-300 max-w-xs">{errorMessage || 'Mengaktifkan kamera...'}</p>
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold rounded-xl cursor-pointer transition">
                    <UploadCloud className="w-4 h-4" />
                    Pilih File Foto
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden bg-slate-100 aspect-[4/3] border border-slate-200">
              <img
                src={capturedImage}
                alt="Foto Cacat Awal"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                WebP &lt; 500 KB Terkompresi
              </span>
            </div>
          )}

          {/* Issue Tags */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Kategori Cacat Pakaian:</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {(Object.keys(QC_ISSUE_LABELS) as QcIssueType[]).map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setSelectedIssue(type)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium text-left border transition ${
                    selectedIssue === type
                      ? 'border-sky-500 bg-sky-50 text-sky-700 font-bold ring-2 ring-sky-200'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {QC_ISSUE_LABELS[type]}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-slate-700">Catatan Detail Cacat:</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contoh: Saku celana kanan ada sobek 2 cm"
              className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          {!capturedImage ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Batal
              </button>
              {isCameraActive && (
                <button
                  type="button"
                  onClick={handleCapture}
                  className="flex items-center gap-2 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-200 transition"
                >
                  <Camera className="w-4 h-4" />
                  Jepret Foto
                </button>
              )}
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleRetake}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Ulangi Foto
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-2 px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-xl shadow-md shadow-sky-200 transition"
              >
                <Check className="w-4 h-4" />
                Lampirkan Foto QC
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
