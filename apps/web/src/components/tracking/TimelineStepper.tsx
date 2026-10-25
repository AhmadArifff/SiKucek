'use client';

import React from 'react';
import { TrackingStep } from '../../lib/tracking-store';
import {
  CheckCircle,
  Clock,
  Sparkles,
  Waves,
  Wind,
  Shirt,
  PackageCheck,
  CheckCircle2,
} from 'lucide-react';

interface TimelineStepperProps {
  steps: TrackingStep[];
  currentStatus: string;
}

export default function TimelineStepper({ steps }: TimelineStepperProps) {
  const getStageIcon = (status: string, isCompleted: boolean, isCurrent: boolean) => {
    if (isCompleted) {
      return <CheckCircle className="w-5 h-5 text-white" />;
    }

    switch (status) {
      case 'received':
        return <Clock className={`w-5 h-5 ${isCurrent ? 'text-white' : 'text-slate-400'}`} />;
      case 'washing':
        return <Waves className={`w-5 h-5 ${isCurrent ? 'text-white' : 'text-slate-400'}`} />;
      case 'drying':
        return <Wind className={`w-5 h-5 ${isCurrent ? 'text-white' : 'text-slate-400'}`} />;
      case 'ironing':
        return <Shirt className={`w-5 h-5 ${isCurrent ? 'text-white' : 'text-slate-400'}`} />;
      case 'packing_qc':
        return <PackageCheck className={`w-5 h-5 ${isCurrent ? 'text-white' : 'text-slate-400'}`} />;
      case 'ready':
        return <Sparkles className={`w-5 h-5 ${isCurrent ? 'text-white' : 'text-slate-400'}`} />;
      case 'completed':
        return <CheckCircle2 className={`w-5 h-5 ${isCurrent ? 'text-white' : 'text-slate-400'}`} />;
      default:
        return <Clock className={`w-5 h-5 ${isCurrent ? 'text-white' : 'text-slate-400'}`} />;
    }
  };

  return (
    <div className="glass-panel rounded-3xl sm:rounded-4xl p-5 sm:p-8 border border-sky-100/90 shadow-xl shadow-sky-500/5 relative overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-sky-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between mb-7 pb-4 border-b border-sky-100/80">
        <div>
          <h3 className="text-base sm:text-lg font-heading font-black text-slate-900 flex items-center gap-2">
            <span>Linimasa Pengerjaan Cucian (7 Tahap)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 font-sans">
            Pelacakan akurat proses laundry pakaian Anda secara real-time
          </p>
        </div>
        <span className="text-[11px] font-bold px-3 py-1 bg-sky-100/80 text-sky-800 rounded-full border border-sky-200/80 shadow-xs flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Proses Otomatis
        </span>
      </div>

      {/* Desktop Stepper */}
      <div className="hidden lg:block relative z-10">
        <div className="relative flex justify-between items-start">
          {/* Connecting Background Line */}
          <div className="absolute top-6 left-8 right-8 h-1 bg-slate-200/80 rounded-full -z-0 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 via-sky-500 to-slate-200 w-full" />
          </div>

          {steps.map((step, idx) => {
            let circleBg = 'bg-slate-100 text-slate-400 border border-slate-200';
            if (step.isCompleted) {
              circleBg = 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 border border-emerald-400';
            } else if (step.isCurrent) {
              circleBg = 'bg-gradient-to-br from-sky-500 to-teal-500 text-white ring-4 ring-sky-300/40 shadow-xl shadow-sky-500/35 animate-pulse border border-sky-300';
            }

            return (
              <div
                key={step.status}
                className="relative z-10 flex flex-col items-center text-center max-w-[125px]"
              >
                {/* Step Circle */}
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${circleBg}`}
                >
                  {getStageIcon(step.status, step.isCompleted, step.isCurrent)}
                </div>

                {/* Stage Info */}
                <p
                  className={`text-xs font-heading font-black mt-3 leading-snug ${
                    step.isCurrent
                      ? 'text-sky-600'
                      : step.isCompleted
                      ? 'text-slate-900'
                      : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </p>

                {step.timestamp && (
                  <span className="text-[10px] text-slate-500 mt-1 font-mono font-medium">
                    {step.timestamp}
                  </span>
                )}

                {step.isCurrent && (
                  <span className="mt-2 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-sky-100 text-sky-800 rounded-full border border-sky-300 shadow-xs">
                    Sedang Dikerjakan
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile / Tablet Vertical Stepper */}
      <div className="lg:hidden space-y-3 relative z-10">
        {steps.map((step, idx) => {
          let badgeBg = 'bg-slate-100 text-slate-400 border-slate-200';

          if (step.isCompleted) {
            badgeBg = 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-emerald-400 shadow-md shadow-emerald-500/20';
          } else if (step.isCurrent) {
            badgeBg = 'bg-gradient-to-br from-sky-500 to-teal-500 text-white border-sky-300 ring-2 ring-sky-300/40 shadow-lg shadow-sky-500/25';
          }

          return (
            <div
              key={step.status}
              className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3.5 ${
                step.isCurrent
                  ? 'border-sky-300 bg-sky-50/70 shadow-sm shadow-sky-200/50 ring-1 ring-sky-300/40'
                  : 'border-slate-200/70 bg-white/80'
              }`}
            >
              {/* Step Icon */}
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${badgeBg}`}
              >
                {getStageIcon(step.status, step.isCompleted, step.isCurrent)}
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0 font-sans">
                <div className="flex items-center justify-between gap-2">
                  <p
                    className={`text-xs sm:text-sm font-heading font-black ${
                      step.isCurrent
                        ? 'text-sky-700'
                        : step.isCompleted
                        ? 'text-slate-900'
                        : 'text-slate-500'
                    }`}
                  >
                    {idx + 1}. {step.label}
                  </p>

                  {step.isCurrent && (
                    <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-sky-500 text-white rounded-full shrink-0 shadow-xs">
                      Aktif
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                  {step.description}
                </p>

                {step.timestamp && (
                  <p className="text-[10px] font-mono font-medium text-slate-500 mt-1">
                    {step.timestamp}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

