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
    <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-sky-100 shadow-md">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-sky-50">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
            <span>Linimasa Pengerjaan Cucian (7 Tahap)</span>
          </h3>
          <p className="text-xs text-slate-600">
            Pelacakan akurat proses laundry pakaian Anda secara real-time
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-sky-50 text-sky-700 rounded-full border border-sky-200">
          Proses Otomatis
        </span>
      </div>

      {/* Desktop Stepper */}
      <div className="hidden lg:block">
        <div className="relative flex justify-between items-start">
          {/* Connecting Background Line */}
          <div className="absolute top-5 left-6 right-6 h-1 bg-slate-100 -z-0" />

          {steps.map((step, idx) => {
            let circleBg = 'bg-slate-200 text-slate-400';
            if (step.isCompleted) {
              circleBg = 'bg-emerald-500 text-white shadow-md shadow-emerald-200';
            } else if (step.isCurrent) {
              circleBg = 'bg-sky-500 text-white ring-4 ring-sky-100 shadow-lg shadow-sky-300 animate-pulse';
            }

            return (
              <div
                key={step.status}
                className="relative z-10 flex flex-col items-center text-center max-w-[125px]"
              >
                {/* Step Circle */}
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${circleBg}`}
                >
                  {getStageIcon(step.status, step.isCompleted, step.isCurrent)}
                </div>

                {/* Stage Info */}
                <p
                  className={`text-xs font-bold mt-2.5 leading-snug ${
                    step.isCurrent
                      ? 'text-sky-600 font-extrabold'
                      : step.isCompleted
                      ? 'text-slate-800'
                      : 'text-slate-500'
                  }`}
                >
                  {step.label}
                </p>

                {step.timestamp && (
                  <span className="text-[10px] text-slate-500 mt-0.5 font-mono">
                    {step.timestamp}
                  </span>
                )}

                {step.isCurrent && (
                  <span className="mt-1.5 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide bg-sky-100 text-sky-700 rounded-full border border-sky-300 animate-bounce">
                    Sedang Proses
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile / Tablet Vertical Stepper */}
      <div className="lg:hidden space-y-4">
        {steps.map((step, idx) => {
          let badgeBg = 'bg-slate-100 text-slate-400 border-slate-200';
          let borderLeft = 'border-slate-200';

          if (step.isCompleted) {
            badgeBg = 'bg-emerald-500 text-white border-emerald-500 shadow-sm';
            borderLeft = 'border-emerald-500';
          } else if (step.isCurrent) {
            badgeBg = 'bg-sky-500 text-white border-sky-500 ring-2 ring-sky-200';
            borderLeft = 'border-sky-500 bg-sky-50/50';
          }

          return (
            <div
              key={step.status}
              className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3.5 ${
                step.isCurrent
                  ? 'border-sky-300 bg-sky-50/60 shadow-sm shadow-sky-100 ring-1 ring-sky-200'
                  : 'border-slate-100 bg-white'
              }`}
            >
              {/* Step Icon */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${badgeBg}`}
              >
                {getStageIcon(step.status, step.isCompleted, step.isCurrent)}
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p
                    className={`text-xs sm:text-sm font-bold ${
                      step.isCurrent
                        ? 'text-sky-700'
                        : step.isCompleted
                        ? 'text-slate-800'
                        : 'text-slate-500'
                    }`}
                  >
                    {idx + 1}. {step.label}
                  </p>

                  {step.isCurrent && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-sky-100 text-sky-700 rounded-full shrink-0">
                      Aktif
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                  {step.description}
                </p>

                {step.timestamp && (
                  <p className="text-[10px] font-mono text-slate-500 mt-1">
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
