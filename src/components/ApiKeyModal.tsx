import React, { useState, useEffect } from 'react';
import { getStoredApiKey, saveApiKey, clearApiKey } from '../services/geminiService';
import { 
  Key, 
  ShieldCheck, 
  X, 
  Eye, 
  EyeOff, 
  Check, 
  ExternalLink, 
  Lock, 
  Trash2,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  onKeySaved,
}) => {
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setApiKeyInput(getStoredApiKey());
      setSaveSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    saveApiKey(apiKeyInput.trim());
    onKeySaved(apiKeyInput.trim());
    setSaveSuccess(true);
    setTimeout(() => {
      onClose();
    }, 900);
  };

  const handleClear = () => {
    clearApiKey();
    setApiKeyInput('');
    onKeySaved('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20">
              <Key className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Google Gemini API Key</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Seguro
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Para geração de pareceres e consultoria executiva inteligente
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Info Card */}
        <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 text-xs space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Armazenamento Local & Seguro</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Sua chave é armazenada temporariamente na sessão do seu navegador (<code className="text-amber-300">sessionStorage</code>) e enviada diretamente para a API oficial do Google. Ela <strong>nunca</strong> é compartilhada ou gravada em servidores de terceiros.
          </p>
        </div>

        {/* Input Field */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
            <span>Chave de API (Gemini):</span>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 text-[11px] flex items-center gap-1 transition-colors underline"
            >
              <span>Obter chave gratuita no Google AI Studio</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </label>

          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              placeholder="Cole sua API Key (Ex: AIzaSy...)"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none font-mono transition-all pr-20"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="p-1.5 text-slate-400 hover:text-slate-200 rounded transition-colors"
                title={showKey ? 'Ocultar chave' : 'Mostrar chave'}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              {apiKeyInput && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1.5 text-rose-400 hover:text-rose-300 rounded transition-colors"
                  title="Remover chave"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!apiKeyInput.trim()}
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
              saveSuccess
                ? 'bg-emerald-600 text-white'
                : apiKeyInput.trim()
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Chave Salva!</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Salvar Chave</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
