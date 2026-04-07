import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, FileText, Download, CheckCircle, AlertCircle, Info, Check, User, Mail, Hash, ShieldCheck } from 'lucide-react';
import { FEES_BY_GRADE, SCHOOL_INFO, GRADES } from '../constants';
import { cn } from '../lib/utils';
import { jsPDF } from 'jspdf';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function Fees() {
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [paymentType, setPaymentType] = useState<'Monthly' | 'Quarterly'>('Monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);
  const [lastMethod, setLastMethod] = useState<'PayFast' | 'EFT' | null>(null);

  const [formData, setFormData] = useState({
    learnerName: '',
    studentNumber: '',
    parentEmail: '',
    parentPhone: '',
  });

  const gradeData = selectedGrade ? FEES_BY_GRADE[selectedGrade] : null;
  const amount = gradeData ? (paymentType === 'Monthly' ? gradeData.monthly : gradeData.quarterly) : 0;

  const generateInvoice = (invoiceNum: string, isReceipt = false) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(0, 31, 63); // Navy
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text(SCHOOL_INFO.name, 20, 25);
    
    // Invoice Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`${isReceipt ? 'Receipt' : 'Invoice'} #: ${invoiceNum}`, 140, 55);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 140, 62);
    
    // School Details
    doc.setFontSize(10);
    doc.text('Power of Love Primary School', 20, 55);
    doc.text(SCHOOL_INFO.address, 20, 60);
    doc.text(SCHOOL_INFO.phone, 20, 65);
    doc.text(SCHOOL_INFO.email, 20, 70);
    
    // Bill To
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('BILL TO:', 20, 85);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Parent Name: ${formData.learnerName}`, 20, 92);
    doc.text(`Learner: ${formData.learnerName}`, 20, 97);
    doc.text(`Grade: ${selectedGrade}`, 20, 102);
    doc.text(`Student/App #: ${formData.studentNumber}`, 20, 107);
    
    // Table Header
    doc.setFillColor(240, 240, 240);
    doc.rect(20, 120, 170, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('Description', 25, 127);
    doc.text('Period', 100, 127);
    doc.text('Amount', 160, 127);
    
    // Table Row
    doc.setFont('helvetica', 'normal');
    doc.text(`School Fees - ${selectedGrade}`, 25, 140);
    doc.text(paymentType, 100, 140);
    doc.text(`R ${amount.toFixed(2)}`, 160, 140);
    
    // Total
    doc.line(20, 150, 190, 150);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL DUE:', 130, 160);
    doc.text(`R ${amount.toFixed(2)}`, 160, 160);
    
    if (isReceipt) {
      doc.setTextColor(34, 197, 94); // Green
      doc.text('PAID IN FULL', 20, 160);
      doc.setTextColor(0, 0, 0);
    } else {
      // Banking Details
      doc.setFontSize(11);
      doc.text('BANKING DETAILS FOR EFT:', 20, 180);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Account Name: ${SCHOOL_INFO.bankDetails.accountName}`, 20, 187);
      doc.text(`Bank: ${SCHOOL_INFO.bankDetails.bank}`, 20, 192);
      doc.text(`Account Number: ${SCHOOL_INFO.bankDetails.accountNumber}`, 20, 197);
      doc.text(`Branch Code: ${SCHOOL_INFO.bankDetails.branchCode}`, 20, 202);
      doc.text(`Reference: ${formData.learnerName} - ${selectedGrade}`, 20, 207);
    }
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(isReceipt ? 'Thank you for your payment.' : 'Thank you for your payment. Please email proof of payment to info@poweroflove.edu.za', 105, 280, { align: 'center' });
    
    return doc;
  };

  const generateStationeryPDF = () => {
    if (!selectedGrade || !gradeData) return;

    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(0, 31, 63); // Navy
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text(SCHOOL_INFO.name, 20, 25);
    
    // Title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`Stationery List: ${selectedGrade}`, 20, 55);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Academic Year: 2027`, 20, 62);
    doc.text(`Date Generated: ${new Date().toLocaleDateString()}`, 20, 67);
    
    // School Details
    doc.text(SCHOOL_INFO.address, 140, 55);
    doc.text(SCHOOL_INFO.phone, 140, 60);
    doc.text(SCHOOL_INFO.email, 140, 65);
    
    // Table Header
    doc.setFillColor(240, 240, 240);
    doc.rect(20, 80, 170, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('Item Description', 25, 87);
    doc.text('Quantity/Note', 140, 87);
    
    // Items
    doc.setFont('helvetica', 'normal');
    gradeData.stationery.forEach((item, index) => {
      const y = 100 + (index * 10);
      doc.text(item, 25, y);
      doc.rect(140, y - 4, 5, 5); // Checkbox
    });
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Please ensure all items are clearly labeled with the learner\'s name.', 105, 280, { align: 'center' });
    
    doc.save(`Stationery_List_${selectedGrade.replace(' ', '_')}.pdf`);
  };

  const handlePayment = async (method: 'PayFast' | 'EFT') => {
    if (!formData.learnerName || !formData.studentNumber || !selectedGrade) {
      alert("Please fill in all required fields.");
      return;
    }

    setLastMethod(method);

    if (method === 'PayFast') {
      setShowCheckout(true);
      return;
    }

    setIsProcessing(true);
    try {
      const invoiceNum = `INV-${Date.now().toString().slice(-6)}`;
      
      // Save to Firestore
      await addDoc(collection(db, 'payments'), {
        invoiceNumber: invoiceNum,
        type: 'Fee',
        learnerName: formData.learnerName,
        studentNumber: formData.studentNumber,
        grade: selectedGrade,
        amount,
        period: paymentType,
        status: 'Pending',
        method,
        createdAt: new Date().toISOString(),
      });

      const doc = generateInvoice(invoiceNum);
      doc.save(`${invoiceNum}.pdf`);
      
      setPaymentSuccess(invoiceNum);
    } catch (error) {
      console.error("Payment error:", error);
      alert("Error processing payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const completePayFastCheckout = async () => {
    setIsProcessing(true);
    try {
      const invoiceNum = `REC-${Date.now().toString().slice(-6)}`;
      
      // Save to Firestore
      await addDoc(collection(db, 'payments'), {
        invoiceNumber: invoiceNum,
        type: 'Fee',
        learnerName: formData.learnerName,
        studentNumber: formData.studentNumber,
        grade: selectedGrade,
        amount,
        period: paymentType,
        status: 'Paid',
        method: 'PayFast',
        createdAt: new Date().toISOString(),
      });

      const doc = generateInvoice(invoiceNum, true);
      doc.save(`${invoiceNum}.pdf`);
      
      setPaymentSuccess(invoiceNum);
      setShowCheckout(false);
    } catch (error) {
      console.error("Payment error:", error);
      alert("Error processing payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-24 px-4 text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-bold text-navy-900 mb-4">
          {lastMethod === 'PayFast' ? 'Payment Successful!' : 'Payment Initiated!'}
        </h1>
        <p className="text-gray-600 mb-8 text-lg">
          Your {lastMethod === 'PayFast' ? 'receipt' : 'invoice'} <strong>{paymentSuccess}</strong> has been generated and downloaded.
        </p>
        
        {lastMethod === 'EFT' ? (
          <div className="bg-navy-50 p-6 rounded-xl border border-navy-100 mb-8 text-left">
            <h3 className="font-bold text-navy-900 mb-4 flex items-center gap-2">
              <Info className="w-5 h-5" /> Next Steps
            </h3>
            <ul className="space-y-3 text-sm text-navy-800">
              <li className="flex gap-2">
                <span className="font-bold">1.</span>
                <span>Please use the banking details on the invoice for your EFT.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">2.</span>
                <span>Use your child's name and grade as the reference.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">3.</span>
                <span>Email proof of payment to <strong>{SCHOOL_INFO.email}</strong>.</span>
              </li>
            </ul>
          </div>
        ) : (
          <div className="bg-green-50 p-6 rounded-xl border border-green-100 mb-8 text-left">
            <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" /> Transaction Verified
            </h3>
            <p className="text-sm text-green-800">
              Your payment via PayFast has been successfully processed. A copy of your receipt has been downloaded for your records.
            </p>
          </div>
        )}

        <button 
          onClick={() => {
            setPaymentSuccess(null);
            setLastMethod(null);
          }}
          className="px-8 py-3 bg-navy-900 text-white rounded-lg font-bold hover:bg-navy-800 transition-all"
        >
          Make Another Payment
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isProcessing && setShowCheckout(false)}
              className="absolute inset-0 bg-navy-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="bg-navy-900 p-6 text-white text-center">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">Secure Checkout</h3>
                <p className="text-navy-300 text-sm">Redirecting to PayFast Sandbox</p>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Learner</span>
                    <span className="font-bold text-navy-900">{formData.learnerName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Grade</span>
                    <span className="font-bold text-navy-900">{selectedGrade}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Payment Period</span>
                    <span className="font-bold text-navy-900">{paymentType}</span>
                  </div>
                  <div className="pt-4 border-t border-dashed flex justify-between items-center">
                    <span className="text-navy-900 font-bold">Total Due</span>
                    <span className="text-2xl font-black text-navy-900">R {amount}</span>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-3">
                  <Info className="w-5 h-5 text-blue-600 shrink-0" />
                  <p className="text-[10px] text-blue-800 leading-relaxed">
                    This is a secure sandbox environment. No actual funds will be deducted from your account during this demonstration.
                  </p>
                </div>

                <button 
                  onClick={completePayFastCheckout}
                  disabled={isProcessing}
                  className="w-full py-4 bg-navy-900 text-white rounded-xl font-bold hover:bg-navy-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-navy-900/20"
                >
                  {isProcessing ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Confirm & Pay R " + amount
                  )}
                </button>
                
                <button 
                  onClick={() => setShowCheckout(false)}
                  disabled={isProcessing}
                  className="w-full py-2 text-gray-400 text-sm font-medium hover:text-navy-900 transition-colors"
                >
                  Cancel and return
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-navy-900 mb-4">School Fees & Payments</h1>
          <p className="text-gray-600">Select a grade to view fee structures and stationery requirements.</p>
        </div>

        {/* Grade Selection */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {GRADES.map((grade) => (
            <button
              key={grade}
              onClick={() => setSelectedGrade(grade)}
              className={cn(
                "px-6 py-3 rounded-full font-bold transition-all border-2 flex items-center gap-2",
                selectedGrade === grade 
                  ? "bg-navy-900 text-white border-navy-900 shadow-lg shadow-navy-900/20" 
                  : "bg-white text-gray-600 border-gray-200 hover:border-navy-900 hover:text-navy-900"
              )}
            >
              {selectedGrade === grade && <Check className="w-4 h-4" />}
              {grade}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {selectedGrade ? (
            <motion.div 
              key={selectedGrade}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Fee Details */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                  <h2 className="text-2xl font-bold text-navy-900 mb-6 flex items-center gap-2">
                    <CreditCard className="w-6 h-6" /> Fee Structure: {selectedGrade}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={cn(
                      "p-6 rounded-xl border-2 transition-all cursor-pointer relative overflow-hidden group",
                      paymentType === 'Monthly' ? "border-navy-900 bg-navy-50/50" : "border-gray-100 hover:border-navy-200"
                    )} onClick={() => setPaymentType('Monthly')}>
                      {paymentType === 'Monthly' && (
                        <div className="absolute top-0 right-0 p-2 bg-navy-900 text-white rounded-bl-xl">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                      <span className="text-sm font-semibold text-navy-600 uppercase tracking-wider">Monthly Payment</span>
                      <div className="text-3xl font-bold text-navy-900 mt-2">R {FEES_BY_GRADE[selectedGrade].monthly}</div>
                      <p className="text-xs text-gray-500 mt-2">Payable by the 1st of every month.</p>
                    </div>
                    <div className={cn(
                      "p-6 rounded-xl border-2 transition-all cursor-pointer relative overflow-hidden group",
                      paymentType === 'Quarterly' ? "border-navy-900 bg-navy-50/50" : "border-gray-100 hover:border-navy-200"
                    )} onClick={() => setPaymentType('Quarterly')}>
                      {paymentType === 'Quarterly' && (
                        <div className="absolute top-0 right-0 p-2 bg-navy-900 text-white rounded-bl-xl">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                      <span className="text-sm font-semibold text-navy-600 uppercase tracking-wider">Quarterly Payment</span>
                      <div className="text-3xl font-bold text-navy-900 mt-2">R {FEES_BY_GRADE[selectedGrade].quarterly}</div>
                      <p className="text-xs text-gray-500 mt-2">Payable at the start of each term.</p>
                    </div>
                  </div>
                  <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-3">
                    <Info className="w-5 h-5 text-blue-600 shrink-0" />
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> There is no registration or enrolment fee for {selectedGrade}.
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                  <h2 className="text-2xl font-bold text-navy-900 mb-6 flex items-center gap-2">
                    <FileText className="w-6 h-6" /> Stationery List
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {FEES_BY_GRADE[selectedGrade].stationery.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-navy-400" />
                        {item}
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={generateStationeryPDF}
                    className="mt-8 flex items-center gap-2 text-navy-900 font-bold hover:underline"
                  >
                    <Download className="w-5 h-5" /> Download Stationery List (PDF)
                  </button>
                </div>
              </div>

              {/* Payment Form */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden h-fit sticky top-24">
                <div className="bg-navy-900 p-6 text-white">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6" /> Secure Payment
                  </h2>
                  <p className="text-navy-200 text-xs mt-1">Complete your transaction safely</p>
                </div>
                
                <div className="p-8 space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Learner Details</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          type="text" 
                          placeholder="Learner Full Name"
                          value={formData.learnerName}
                          onChange={(e) => setFormData({...formData, learnerName: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-900 outline-none transition-all" 
                        />
                      </div>
                    </div>
                    
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="text" 
                        value={formData.studentNumber}
                        onChange={(e) => setFormData({...formData, studentNumber: e.target.value})}
                        placeholder="Student / App Number"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-900 outline-none transition-all" 
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 mt-4">Contact Information</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          type="email" 
                          placeholder="Parent Email Address"
                          value={formData.parentEmail}
                          onChange={(e) => setFormData({...formData, parentEmail: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-900 outline-none transition-all" 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-dashed border-gray-200">
                    <div className="flex justify-between items-end mb-6">
                      <div className="text-gray-500 text-sm">
                        <span className="block font-medium">Total Amount</span>
                        <span className="text-[10px] uppercase tracking-widest">{paymentType} Fees</span>
                      </div>
                      <div className="text-3xl font-black text-navy-900">R {amount}</div>
                    </div>
                    
                    <div className="space-y-3">
                      <button 
                        onClick={() => handlePayment('PayFast')}
                        disabled={isProcessing}
                        className="w-full py-4 bg-navy-900 text-white rounded-xl font-bold hover:bg-navy-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-navy-900/20"
                      >
                        {isProcessing ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <CreditCard className="w-5 h-5" /> Pay Online (PayFast)
                          </>
                        )}
                      </button>
                      <button 
                        onClick={() => handlePayment('EFT')}
                        disabled={isProcessing}
                        className="w-full py-4 bg-white border-2 border-navy-900 text-navy-900 rounded-xl font-bold hover:bg-navy-50 transition-all flex items-center justify-center gap-2"
                      >
                        <FileText className="w-5 h-5" /> Generate EFT Invoice
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-gray-400 shrink-0" />
                      <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Late Payment Policy</h4>
                    </div>
                    <p className="text-[10px] text-gray-500 leading-relaxed">
                      Payments are due by the 1st of the month/term. Reminders will be sent after 14 days. Persistent non-payment will require a meeting to agree on a payment plan.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-gray-200">
              <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Grade Selected</h3>
              <p className="text-gray-500">Please select a grade above to view fee details and make a payment.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
