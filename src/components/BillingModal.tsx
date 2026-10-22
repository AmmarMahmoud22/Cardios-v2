import React, { useState } from 'react';
import { Invoice, InvoiceItem, Patient } from '../types';
import { saveInvoice } from '../firebase/firestoreService';
import { CreditCard, DollarSign, Plus, Trash2, X, CheckCircle2, Clock, Printer } from 'lucide-react';

interface BillingModalProps {
  patient: Patient;
  invoices: Invoice[];
  isOpen: boolean;
  onClose: () => void;
  onInvoiceSaved: (invoice: Invoice) => void;
}

const COMMON_CARDIAC_SERVICES = [
  { description: 'Comprehensive Cardiology Consultation & Clinical Exam', category: 'Consultation' as const, amount: 120 },
  { description: 'Transthoracic Echocardiogram (TTE) with Color Doppler', category: 'Echocardiography' as const, amount: 250 },
  { description: '12-Lead Electrocardiogram (ECG) with Interpretation', category: 'Diagnostic (ECG)' as const, amount: 50 },
  { description: '24-Hour Ambulatory Holter ECG Monitoring', category: 'Diagnostic (ECG)' as const, amount: 150 },
  { description: 'Exercise Treadmill Stress Test (TMT)', category: 'Diagnostic (ECG)' as const, amount: 180 },
  { description: 'Monthly Cardios Remote Patient Monitoring (RPM) Telemetry Tier', category: 'RPM Subscription' as const, amount: 80 }
];

export const BillingModal: React.FC<BillingModalProps> = ({
  patient,
  invoices,
  isOpen,
  onClose,
  onInvoiceSaved
}) => {
  const [view, setView] = useState<'history' | 'create'>('history');
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: `item-1`,
      description: 'Comprehensive Cardiology Consultation & Clinical Exam',
      category: 'Consultation',
      amount: 120
    }
  ]);
  const [paymentStatus, setPaymentStatus] = useState<Invoice['status']>('Paid');
  const [paymentMethod, setPaymentMethod] = useState<Invoice['paymentMethod']>('Credit Card');
  const [notes, setNotes] = useState('Outpatient cardiology clinic service.');

  if (!isOpen) return null;

  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

  const addItemFromPreset = (service: typeof COMMON_CARDIAC_SERVICES[0]) => {
    setItems([
      ...items,
      {
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        description: service.description,
        category: service.category,
        amount: service.amount
      }
    ]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const handleSaveInvoice = async () => {
    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      patientId: patient.id,
      patientName: patient.name,
      invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      items,
      totalAmount,
      status: paymentStatus,
      paymentMethod,
      notes
    };

    await saveInvoice(newInvoice);
    onInvoiceSaved(newInvoice);
    setView('history');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold">Billing, Services & Invoicing</h2>
              <div className="text-[11px] text-slate-400">
                Patient: {patient.name} ({patient.mrn})
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-6 pt-4 border-b border-slate-200 flex items-center gap-4 text-xs font-bold">
          <button
            onClick={() => setView('history')}
            className={`pb-2.5 border-b-2 transition ${
              view === 'history'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Invoice History ({invoices.length})
          </button>
          <button
            onClick={() => setView('create')}
            className={`pb-2.5 border-b-2 transition flex items-center gap-1.5 ${
              view === 'create'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            Create New Invoice
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {view === 'history' ? (
            <div className="space-y-4">
              {invoices.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No billing invoices on file. Click "Create New Invoice" to log cardiac services.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
                  {invoices.map(inv => (
                    <div key={inv.id} className="p-4 hover:bg-slate-50 transition space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 font-mono text-sm">{inv.invoiceNumber}</span>
                          <span className="text-slate-400">({inv.date})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            inv.status === 'Paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {inv.status === 'Paid' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            {inv.status}
                          </span>
                          <strong className="text-sm font-black text-slate-900">
                            ${inv.totalAmount.toFixed(2)}
                          </strong>
                        </div>
                      </div>

                      {/* Line items preview */}
                      <div className="pl-2 space-y-1 text-slate-600">
                        {inv.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between text-[11px]">
                            <span>• {it.description} <span className="text-slate-400 font-mono">[{it.category}]</span></span>
                            <span className="font-medium text-slate-700">${it.amount.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      {inv.notes && (
                        <div className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-100">
                          Note: {inv.notes} • Method: {inv.paymentMethod || 'Direct'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Create Invoice Form */
            <div className="space-y-5 text-xs">
              {/* Quick cardiac services selection */}
              <div>
                <span className="block font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Add Standard Cardiology Clinical Services:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {COMMON_CARDIAC_SERVICES.map((srv, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => addItemFromPreset(srv)}
                      className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-left transition flex items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold text-slate-800">{srv.description}</div>
                        <div className="text-[10px] text-slate-500">{srv.category}</div>
                      </div>
                      <span className="font-bold text-emerald-700">${srv.amount}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Items List */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white">
                <div className="flex justify-between font-bold text-slate-800 border-b border-slate-100 pb-2 mb-3">
                  <span>Selected Invoice Items ({items.length})</span>
                  <span>Amount ($)</span>
                </div>

                <div className="space-y-2 mb-4">
                  {items.map(it => (
                    <div key={it.id} className="flex items-center justify-between gap-3 text-slate-700">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => removeItem(it.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <span>{it.description}</span>
                      </div>
                      <span className="font-bold text-slate-900">${it.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-800">Total Billed Amount:</span>
                  <strong className="text-xl font-black text-emerald-700">
                    ${totalAmount.toFixed(2)}
                  </strong>
                </div>
              </div>

              {/* Status and Method */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Payment Status:</label>
                  <select
                    value={paymentStatus}
                    onChange={e => setPaymentStatus(e.target.value as Invoice['status'])}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold"
                  >
                    <option value="Paid">Paid in Full</option>
                    <option value="Pending">Pending Payment</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Payment Channel:</label>
                  <select
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value as Invoice['paymentMethod'])}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  >
                    <option value="Credit Card">Credit / Debit Card</option>
                    <option value="Cash">Cash</option>
                    <option value="Insurance">Insurance Pre-Auth</option>
                    <option value="Bank Transfer">Bank Wire Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Billing Notes:</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setView('history')}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveInvoice}
                  disabled={items.length === 0}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md disabled:opacity-50"
                >
                  Save & Archive Invoice
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
