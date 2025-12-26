import React, { useState, useRef } from 'react';
import { Camera, MapPin, Upload, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { analyzeReport } from '../services/geminiService';
import { Report, ReportCategory } from '../types';

interface ReportFormProps {
  onSuccess: (report: Report) => void;
}

const ReportForm: React.FC<ReportFormProps> = ({ onSuccess }) => {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'uploading' | 'minting' | 'success'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
      }, (error) => {
        console.error("Error fetching location", error);
        setLocation("Unknown Location");
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description) return;

    setStatus('analyzing');
    setIsAnalyzing(true);

    // 1. AI Analysis
    const result = await analyzeReport(description, preview || undefined);
    
    setStatus('uploading');
    // Simulate IPFS Upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setStatus('minting');
    // Simulate Blockchain Transaction delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newReport: Report = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      description,
      category: (result.category as ReportCategory) || ReportCategory.OTHER,
      location: location || "Remote",
      image: preview || undefined,
      authenticityScore: result.score,
      aiAnalysis: result.summary,
      txHash: "0x" + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join(''),
      ipfsCid: "Qm" + Array.from({length: 44}, () => Math.floor(Math.random()*16).toString(16)).join(''),
      status: result.score > 0.8 ? 'Verified' : 'Flagged',
    };

    setStatus('success');
    setTimeout(() => {
      onSuccess(newReport);
    }, 1500);
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-slate-800/50 rounded-2xl border border-green-500/30">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-green-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Report Submitted Successfully</h3>
        <p className="text-slate-400 text-center max-w-md">
          Your report has been verified, stored on IPFS, and a hash has been minted on the blockchain. Thank you for your contribution.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-slate-800/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-slate-700">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <AlertTriangle className="text-yellow-500" />
        Submit Anonymous Report
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Description */}
        <div>
          <label className="block text-slate-400 text-sm font-medium mb-2">
            Description of Incident
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none h-32"
            placeholder="Describe what happened, who was involved, etc..."
            required
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-slate-400 text-sm font-medium mb-2">
            Location
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. Main St & 5th Ave"
            />
            <button
              type="button"
              onClick={handleLocation}
              className="p-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-xl transition-colors"
              title="Use Current Location"
            >
              <MapPin className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Media Upload */}
        <div>
          <label className="block text-slate-400 text-sm font-medium mb-2">
            Evidence (Photo/Video)
          </label>
          <div 
            className="border-2 border-dashed border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500 hover:bg-slate-700/30 transition-all"
            onClick={() => fileInputRef.current?.click()}
          >
            {preview ? (
              <div className="relative w-full h-48 rounded-lg overflow-hidden">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <span className="text-white font-medium">Change Image</span>
                </div>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center mb-3">
                  <Camera className="w-6 h-6 text-slate-300" />
                </div>
                <p className="text-slate-300 font-medium">Click to upload evidence</p>
                <p className="text-slate-500 text-sm mt-1">JPG, PNG, MP4 (Max 10MB)</p>
              </>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*,video/*"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* AI Analysis Disclaimer */}
        <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-500/20 flex items-start gap-3">
          <Upload className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
          <div className="text-sm text-blue-200/80">
            <span className="font-semibold text-blue-300">AI Authenticity Check:</span> Your media will be analyzed by our AI to detect deepfakes before being permanently stored on the blockchain.
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status !== 'idle' || !description}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3
            ${status !== 'idle' || !description 
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-purple-900/50'
            }`}
        >
          {status === 'idle' && "Submit Report Anonymously"}
          {status === 'analyzing' && (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Verifying Authenticity...
            </>
          )}
          {status === 'uploading' && (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Encrypting & Uploading to IPFS...
            </>
          )}
          {status === 'minting' && (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Minting Block...
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ReportForm;