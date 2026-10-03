import React, { useState } from 'react';
import { X, Download, ShieldCheck, Copy, Check, Smartphone, FileCheck } from 'lucide-react';
import { AuriumState } from '../types';
import { AuriumLogo } from './AuriumLogo';

interface ApkDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  apk: AuriumState['apk'];
}

export const ApkDownloadModal: React.FC<ApkDownloadModalProps> = ({ isOpen, onClose, apk }) => {
  const [copiedSha, setCopiedSha] = useState(false);
  const [downloadTriggered, setDownloadTriggered] = useState(false);

  if (!isOpen) return null;

  const handleCopySha = () => {
    navigator.clipboard.writeText(apk.sha256);
    setCopiedSha(true);
    setTimeout(() => setCopiedSha(false), 2000);
  };

  const handleDownload = () => {
    setDownloadTriggered(true);

    const simulatedApkContent = `Aurium Network Node Binary v${apk.version}
Package: network.aurium.node.validator
SHA256: ${apk.sha256}
Release: ${apk.releaseDate}
Consensus Engine: PoMU (Proof of Mobile Uptime)
Status: Signed & Verified`;

    const blob = new Blob([simulatedApkContent], { type: 'application/vnd.android.package-archive' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aurium-validator-${apk.version}.apk`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl overflow-y-auto">
      <div className="aurium-card rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto border border-[#2C3547] shadow-2xl relative my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1F2736]">
          <div className="flex items-center gap-3">
            <AuriumLogo size="sm" showText={false} />
            <div>
              <h2 className="text-xl font-black text-[#F0F6FC] font-sans tracking-wide">
                DIRECT APK SIDELOAD
              </h2>
              <div className="text-xs text-[#8B949E] font-mono">
                Official Android Light Validator Build ({apk.version})
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full recessed-well hover:border-[#F5A623]/40 border border-[#1F2736] flex items-center justify-center text-[#8B949E] hover:text-[#F0F6FC] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* APK Details in Recessed Well */}
          <div className="recessed-well rounded-2xl p-5 border border-[#1F2736] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#8B949E] uppercase tracking-wider text-[11px] font-semibold">Package Name:</span>
              <span className="font-mono font-bold text-[#F5A623]">Aurium Validator {apk.version}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#8B949E] uppercase tracking-wider text-[11px] font-semibold">Binary Size:</span>
              <span className="font-mono text-[#F0F6FC]">{apk.fileSize}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#8B949E] uppercase tracking-wider text-[11px] font-semibold">OS Requirement:</span>
              <span className="text-[#F0F6FC]">{apk.minAndroidVersion}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#8B949E] uppercase tracking-wider text-[11px] font-semibold">Instruction Set:</span>
              <span className="font-mono text-[#58A6FF]">arm64-v8a / armeabi-v7a</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#8B949E] uppercase tracking-wider text-[11px] font-semibold">Channel:</span>
              <span className="text-[#238636] font-bold">Unrestricted Sideload Release</span>
            </div>
          </div>

          {/* SHA-256 Checksum in Recessed Well */}
          <div>
            <div className="flex items-center justify-between text-xs text-[#8B949E] mb-2 font-semibold">
              <span className="flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                <FileCheck className="w-3.5 h-3.5 text-[#238636]" />
                OFFICIAL SHA-256 CHECKSUM
              </span>
              <button
                onClick={handleCopySha}
                className="text-[#F5A623] hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
              >
                {copiedSha ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSha ? 'HASH COPIED' : 'COPY HASH'}</span>
              </button>
            </div>
            <div className="p-3.5 rounded-2xl recessed-well border border-[#1F2736] font-mono text-[11px] text-[#8B949E] break-all select-all">
              {apk.sha256}
            </div>
          </div>

          {/* Download Action Pill Button */}
          <div className="space-y-3">
            <button
              onClick={handleDownload}
              className="btn-gold-capsule w-full py-4 px-6 text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#070A0E]" />
              <span>DOWNLOAD SIGNED APK ({apk.fileSize})</span>
            </button>

            {downloadTriggered && (
              <div className="recessed-well p-3 rounded-2xl border border-[#238636]/40 text-xs text-[#238636] flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Binary package download initiated. Check your device downloads.</span>
              </div>
            )}
          </div>

          {/* Sideload Guide */}
          <div className="pt-2 border-t border-[#1F2736]">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#F0F6FC] mb-3">
              Direct Sideload Instructions:
            </h4>
            <ol className="space-y-2.5 text-xs text-[#8B949E]">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full recessed-well text-[#F5A623] font-mono font-bold flex items-center justify-center shrink-0 border border-[#F5A623]/30 text-[10px]">
                  1
                </span>
                <span>
                  Tap <strong>Download Signed APK</strong> to download the release binary to your phone.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full recessed-well text-[#F5A623] font-mono font-bold flex items-center justify-center shrink-0 border border-[#F5A623]/30 text-[10px]">
                  2
                </span>
                <span>
                  When prompted by Android Package Installer, tap <strong>&quot;Allow from this source&quot;</strong>.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full recessed-well text-[#F5A623] font-mono font-bold flex items-center justify-center shrink-0 border border-[#F5A623]/30 text-[10px]">
                  3
                </span>
                <span>
                  Generate or import your mobile validator keypair and tap <strong>&quot;Start Node&quot;</strong>.
                </span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
