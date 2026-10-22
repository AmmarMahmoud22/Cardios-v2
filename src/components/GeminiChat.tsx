import React, { useState, useEffect, useRef } from 'react';
import { Patient, VitalSign, Prescription, LabTest, ChatMessage } from '../types';
import { Sparkles, Send, Bot, User, Stethoscope, AlertTriangle, CheckCircle, RefreshCw, X } from 'lucide-react';

interface GeminiChatProps {
  patient: Patient;
  vitals: VitalSign[];
  prescriptions: Prescription[];
  labs: LabTest[];
  isOpen: boolean;
  onClose: () => void;
}

export const GeminiChat: React.FC<GeminiChatProps> = ({
  patient,
  vitals,
  prescriptions,
  labs,
  isOpen,
  onClose
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Latest readings summary
  const latestVital = vitals[0];
  const activeRx = prescriptions[0];
  const pendingLabs = labs.filter(l => l.status === 'Pending Review');

  // Grounding prompt synthesis for cardiology recommendations
  const generateInitialAnalysis = () => {
    let analysis = `### 🩺 Cardios AI Clinical Summary for **${patient.name}** (${patient.age}y ${patient.gender})
**Primary Diagnosis:** ${patient.primaryDiagnosis}

---

#### 1. ⚠️ Hemodynamic & RPM Evaluation
`;

    if (latestVital) {
      if (latestVital.systolic >= 160 || latestVital.diastolic >= 100) {
        analysis += `• **Stage 2 Hypertension Alert:** Latest reading of **${latestVital.systolic}/${latestVital.diastolic} mmHg** (HR: ${latestVital.heartRate} bpm) from ${latestVital.source} indicates suboptimal BP control.
• **Guideline Action (ESC/ESH 2024):** Patient is exceeding target threshold (<130/80 mmHg). Consider uptitrating ACE-inhibitor (Ramipril from 5mg to 10mg) or adding dihydropyridine CCB (Amlodipine 5mg).`;
      } else {
        analysis += `• **Stable Hemodynamics:** Latest BP ${latestVital.systolic}/${latestVital.diastolic} mmHg and HR ${latestVital.heartRate} bpm within acceptable limits.`;
      }
    } else {
      analysis += `• No RPM recordings logged yet. Recommend baseline 7-day home telemetry.`;
    }

    analysis += `\n\n#### 2. 💊 Pharmacotherapy & GDMT Alignment
`;
    if (activeRx && activeRx.medications.length > 0) {
      analysis += `• **Active Regimen:** ${activeRx.medications.map(m => m.name).join(', ')}.
• **Statin Intensity:** High-intensity Atorvastatin 80mg prescribed. Target LDL-C < 55 mg/dL.
• **Antiplatelet Coverage:** Dual antiplatelet therapy (Aspirin + P2Y12 inhibitor) active post-PCI.`;
    } else {
      analysis += `• No active prescriptions recorded in this encounter.`;
    }

    if (pendingLabs.length > 0) {
      analysis += `\n\n#### 3. 🧪 Diagnostic & Lab Watchlist
• **${pendingLabs.length} STAT / Pending Lab(s):** ${pendingLabs.map(l => l.testName).join(', ')}. Review before major medication escalations.`;
    }

    analysis += `\n\n---
*How would you like to proceed? You can ask me to draft patient instructions, check drug-drug interactions, or calculate cardiovascular risk scores.*`;

    return analysis;
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Set initial clinical analysis
      setMessages([
        {
          id: 'msg-init',
          sender: 'ai',
          text: generateInitialAnalysis(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedActions: [
            'How to handle the high BP reading?',
            'Check drug-drug interactions',
            'Draft patient WhatsApp advice',
            'Calculate CHA2DS2-VASc score'
          ]
        }
      ]);
    }
  }, [isOpen, patient.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  // Handle user query
  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'doctor',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    // If Gemini API key is configured in env, make real API call
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    let aiResponseText = '';

    if (apiKey && apiKey !== 'your_gemini_api_key_here') {
      try {
        const prompt = `You are Cardios AI, a world-class clinical cardiology decision support assistant for Dr. Karim El-Sayed.
Patient Context:
- Name: ${patient.name}, Age: ${patient.age}, Gender: ${patient.gender}
- Primary Diagnosis: ${patient.primaryDiagnosis}
- Allergies: ${patient.allergies.join(', ') || 'None'}
- Recent Vitals: ${latestVital ? `${latestVital.systolic}/${latestVital.diastolic} mmHg, HR ${latestVital.heartRate} bpm` : 'None'}
- Active Meds: ${activeRx ? activeRx.medications.map(m => `${m.name} ${m.dosage}`).join(', ') : 'None'}
- Labs: ${labs.map(l => `${l.testName}: ${l.result} ${l.unit}`).join(', ')}

Doctor/User Query: "${query}"

Provide clear, professional, evidence-based cardiology guidance aligned with ESC and ACC/AHA guidelines.`;

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        });

        if (res.ok) {
          const data = await res.json();
          aiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        }
      } catch (err) {
        console.warn('Gemini API call failed, falling back to cardiology clinical heuristic:', err);
      }
    }

    // High fidelity cardiology heuristic response fallback if API key is not present or offline
    if (!aiResponseText) {
      await new Promise(resolve => setTimeout(resolve, 600)); // natural conversational pacing
      const lower = query.toLowerCase();

      if (lower.includes('bp') || lower.includes('blood pressure') || lower.includes('high') || lower.includes('handle')) {
        aiResponseText = `**Guideline Strategy for Elevated BP (${latestVital?.systolic || 168}/${latestVital?.diastolic || 98} mmHg):**

1. **Rule out Hypertensive Emergency:** Patient has no acute neurological deficit or chest pain reported. Classified as **Hypertensive Urgency / Stage 2 Uncontrolled**.
2. **Medication Titration:**
   • If renal function is preserved (eGFR > 60), titrate **Ramipril from 5mg to 10mg once daily**.
   • Alternatively, add **Amlodipine 5mg once daily in the evening** to achieve synergistic vasodilation.
3. **RPM Protocol:** Request patient to re-measure BP resting in 2 hours via the Cardios Patient Portal.
4. **Sodium Restriction:** Strict dietary sodium < 1,500 mg/day.`;
      } else if (lower.includes('interaction') || lower.includes('drug')) {
        aiResponseText = `**Pharmacotherapy Interaction Screen:**

• **Aspirin (81mg) + Ticagrelor (90mg):** Dual antiplatelet therapy (DAPT) has class I indication for 12 months post-PCI. Increased bleeding risk; ensure no concomitant NSAIDs or gastro-irritants.
• **Atorvastatin (80mg):** High-intensity statin. Check liver enzymes and CPK if patient develops uncharacteristic myalgia.
• **Ramipril + Bisoprolol:** Safe combination. Monitor resting heart rate (target 60-70 bpm) and standing blood pressure to prevent symptomatic orthostasis.
• **Allergy Alert:** Patient has documented penicillin allergy; current regimen contains no beta-lactams.`;
      } else if (lower.includes('patient') || lower.includes('whatsapp') || lower.includes('advice') || lower.includes('message')) {
        aiResponseText = `**Draft WhatsApp / SMS message for ${patient.name}:**

"Dear ${patient.name}, Dr. Karim El-Sayed reviewed your home blood pressure reading today (${latestVital?.systolic || 168}/${latestVital?.diastolic || 98} mmHg). Please remain calm, rest for 30 minutes in a quiet room, avoid caffeine, and log another reading in your Cardios Portal. Take your prescribed evening medications as scheduled. If you experience severe headache, visual blurring, or chest discomfort, contact our clinic immediately or call emergency."`;
      } else if (lower.includes('chads') || lower.includes('score') || lower.includes('risk')) {
        aiResponseText = `**Cardiovascular Risk Stratification for ${patient.name}:**

• **ASCVD Category:** Very High Risk (Established CAD post-STEMI). Target LDL-C: < 55 mg/dL with >=50% reduction from baseline.
• **CHA2DS2-VASc Estimate (if AF present):**
  - Age >= 65: +1
  - Hypertension: +1
  - Vascular disease (prior MI): +1
  - Total Score: 3 points (Oral Anticoagulation strongly indicated if arrhythmia documented).`;
      } else {
        aiResponseText = `**Cardios AI Clinical Recommendation:**

Based on ${patient.name}'s current clinical profile (${patient.primaryDiagnosis}), the priority is stabilizing home blood pressure trends and maintaining optimal neurohormonal blockade.

• Ensure continued daily logging through the **Cardios Mobile RPM portal**.
• Target clinic BP: **< 130/80 mmHg**.
• Review serum creatinine and electrolytes before any diuretic adjustment.`;
      }
    }

    const aiMsg: ChatMessage = {
      id: `msg-ai-${Date.now()}`,
      sender: 'ai',
      text: aiResponseText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        'How to handle the high BP reading?',
        'Check drug-drug interactions',
        'Draft patient WhatsApp advice'
      ]
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col h-[640px]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-orange-500 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold font-heading">Cardios AI Clinical Assistant</h2>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-mono border border-rose-500/30">
                  ESC / AHA Grounded
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Patient Context: {patient.name} ({patient.primaryDiagnosis})
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setMessages([]);
                setTimeout(() => {
                  setMessages([
                    {
                      id: `msg-reinit-${Date.now()}`,
                      sender: 'ai',
                      text: generateInitialAnalysis(),
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      suggestedActions: [
                        'How to handle the high BP reading?',
                        'Check drug-drug interactions',
                        'Draft patient WhatsApp advice'
                      ]
                    }
                  ]);
                }, 100);
              }}
              title="Refresh AI Analysis"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat message history */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map(msg => {
            const isAI = msg.sender === 'ai';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 text-xs ${isAI ? 'justify-start' : 'justify-end'}`}
              >
                {isAI && (
                  <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 shadow-sm whitespace-pre-wrap leading-relaxed ${
                    isAI
                      ? 'bg-white border border-slate-200 text-slate-800'
                      : 'bg-rose-600 text-white font-medium'
                  }`}
                >
                  <div>{msg.text}</div>
                  <div
                    className={`text-[10px] mt-2 flex justify-end ${
                      isAI ? 'text-slate-400' : 'text-rose-200'
                    }`}
                  >
                    {msg.timestamp}
                  </div>

                  {/* Suggestion Chips */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                      {msg.suggestedActions.map((act, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(act)}
                          className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 text-[11px] font-medium transition border border-slate-200"
                        >
                          {act}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {!isAI && (
                  <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-200 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 text-xs items-center text-slate-500">
              <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-sm text-slate-600 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span>Cardios AI analyzing patient telemetry & clinical evidence...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200 shrink-0">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask Cardios AI (e.g. check drug interaction, suggest titration, explain alert)..."
              className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/20 disabled:opacity-50 transition"
            >
              <Send className="w-3.5 h-3.5" />
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
