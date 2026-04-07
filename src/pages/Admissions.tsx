import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, ChevronRight, ChevronLeft, Upload, AlertCircle } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { cn } from '../lib/utils';
import { GRADES } from '../constants';
import confetti from 'canvas-confetti';

const applicationSchema = z.object({
  learnerInfo: z.object({
    firstName: z.string().min(2, "First name is required"),
    surname: z.string().min(2, "Surname is required"),
    dob: z.string().min(1, "Date of birth is required"),
    grade: z.string().min(1, "Grade is required"),
    gender: z.enum(["Male", "Female", "Other"]),
    address: z.string().min(10, "Full address is required"),
    previousSchool: z.string().optional(),
  }),
  parentInfo: z.object({
    guardianName: z.string().min(2, "Guardian name is required"),
    guardianPhone: z.string().min(10, "Valid phone number is required"),
    guardianEmail: z.string().email("Valid email is required"),
    emergencyContact: z.string().min(10, "Emergency contact is required"),
  }),
  healthHistory: z.object({
    allergies: z.string().min(1, "Please specify or write 'None'"),
    conditions: z.string().min(1, "Please specify or write 'None'"),
    medication: z.string().min(1, "Please specify or write 'None'"),
    disabilities: z.string().min(1, "Please specify or write 'None'"),
    doctorDetails: z.string().min(5, "Doctor/Clinic details are required"),
    emergencyConsent: z.boolean().refine(val => val === true, "Consent is required"),
  }),
  consent: z.object({
    popia: z.boolean().refine(val => val === true, "POPIA consent is required"),
    policy: z.boolean().refine(val => val === true, "Policy acceptance is required"),
    photoConsent: z.enum(["Yes", "No"]),
  }),
  documents: z.object({
    birthCertificate: z.string().min(1, "Birth Certificate is required"),
    reportCard: z.string().min(1, "Latest Report Card is required"),
    guardianId: z.string().min(1, "Guardian ID is required"),
    healthCertificate: z.string().min(1, "Health Certificate is required"),
    transferDocument: z.string().optional(),
  }),
});

type ApplicationForm = z.infer<typeof applicationSchema>;

const STEPS = [
  { id: 1, title: 'Learner Info' },
  { id: 2, title: 'Parent Info' },
  { id: 3, title: 'Health History' },
  { id: 4, title: 'Documents' },
  { id: 5, title: 'Consent & Submit' },
];

export default function Admissions() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const { register, handleSubmit, formState: { errors }, trigger, watch, setValue, setError, clearErrors } = useForm<ApplicationForm>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      healthHistory: { emergencyConsent: false },
      consent: { popia: false, policy: false },
      documents: {
        birthCertificate: '',
        reportCard: '',
        guardianId: '',
        healthCertificate: '',
        transferDocument: ''
      }
    }
  });

  const validateFileType = (file: File, fieldName: string) => {
    const acceptedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!acceptedTypes.includes(file.type)) {
      setError(fieldName as any, {
        type: 'manual',
        message: 'Invalid file type. Please upload PDF, JPG, or PNG.'
      });
      return false;
    }
    clearErrors(fieldName as any);
    return true;
  };

  const simulateUpload = (docId: string, fileName: string, fieldName: string) => {
    setUploadProgress(prev => ({ ...prev, [docId]: 0 }));
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 20) + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setValue(fieldName as any, fileName);
        setTimeout(() => {
          setUploadProgress(prev => {
            const next = { ...prev };
            delete next[docId];
            return next;
          });
        }, 800);
      }
      setUploadProgress(prev => ({ ...prev, [docId]: progress }));
    }, 150);
  };

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (step === 1) fieldsToValidate = ['learnerInfo'];
    if (step === 2) fieldsToValidate = ['parentInfo'];
    if (step === 3) fieldsToValidate = ['healthHistory'];
    if (step === 4) fieldsToValidate = ['documents'];

    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) setStep(s => s + 1);
  };

  const prevStep = () => setStep(s => s - 1);

  const onSubmit = async (data: ApplicationForm) => {
    setIsSubmitting(true);
    try {
      const year = new Date().getFullYear();
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      const applicationNumber = `APP-${year}-${randomNum}`;

      const docRef = await addDoc(collection(db, 'applications'), {
        ...data,
        applicationNumber,
        status: 'Received',
        createdAt: new Date().toISOString(),
        serverTimestamp: serverTimestamp(),
      });

      setSubmittedId(applicationNumber);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#001f3f', '#ffffff', '#3b82f6']
      });
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("There was an error submitting your application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedId) {
    return (
      <div className="max-w-2xl mx-auto py-24 px-4 text-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="mb-12">
            <img 
              src="/image001.jpg" 
              alt="Power of Love Logo" 
              className="w-24 h-24 object-contain mx-auto mb-8"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-bold text-navy-900 mb-4">Application Submitted!</h1>
          <p className="text-gray-600 mb-8 text-lg">
            Thank you for applying to Power of Love Primary School. Your application has been received and is being processed.
          </p>
          <div className="bg-navy-50 p-6 rounded-xl border border-navy-100 mb-8">
            <span className="text-navy-600 text-sm font-semibold uppercase tracking-wider block mb-2">Your Application Number</span>
            <span className="text-3xl font-mono font-bold text-navy-900">{submittedId}</span>
          </div>
          <p className="text-sm text-gray-500 mb-8">
            Please keep this number for your records. We will contact you via email regarding the next steps.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-8 py-3 bg-navy-900 text-white rounded-lg font-bold hover:bg-navy-800 transition-all"
          >
            Return Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-navy-900 mb-4">Online Application</h1>
          <p className="text-gray-600">Complete the form below to apply for admission for the 2027 academic year.</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-16 px-4">
          <div className="flex justify-between items-center relative max-w-3xl mx-auto">
            {/* Background Line */}
            <div className="absolute left-0 top-6 -translate-y-1/2 w-full h-1.5 bg-gray-200 rounded-full z-0" />
            
            {/* Progress Line */}
            <motion.div 
              className="absolute left-0 top-6 -translate-y-1/2 h-1.5 bg-gradient-to-r from-navy-900 to-blue-600 rounded-full z-0 shadow-sm shadow-navy-900/20" 
              initial={{ width: 0 }}
              animate={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />

            {STEPS.map((s) => {
              const isCompleted = step > s.id;
              const isActive = step === s.id;
              const isUpcoming = step < s.id;

              return (
                <button
                  key={s.id}
                  type="button"
                  disabled={isUpcoming}
                  onClick={() => !isUpcoming && setStep(s.id)}
                  className={cn(
                    "relative z-10 flex flex-col items-center group transition-all duration-300",
                    isUpcoming ? "cursor-not-allowed" : "cursor-pointer hover:scale-105 active:scale-95"
                  )}
                >
                  <motion.div 
                    initial={false}
                    animate={{
                      scale: isActive ? 1.15 : 1,
                      backgroundColor: isCompleted ? "#22c55e" : isActive ? "#001f3f" : "#ffffff",
                      borderColor: isCompleted ? "#22c55e" : isActive ? "#001f3f" : "#e5e7eb",
                      color: isCompleted || isActive ? "#ffffff" : "#9ca3af"
                    }}
                    className={cn(
                      "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold border-2 transition-all duration-300 shadow-md",
                      isActive && "ring-4 ring-navy-100 shadow-lg shadow-navy-900/20"
                    )}
                  >
                    {isCompleted ? (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                      </motion.div>
                    ) : (
                      <span className="text-sm sm:text-base">{s.id}</span>
                    )}
                  </motion.div>
                  
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-20 sm:w-24 text-center">
                    <span className={cn(
                      "text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 block leading-tight",
                      isActive ? "text-navy-900" : isCompleted ? "text-green-600" : "text-gray-400"
                    )}>
                      {s.title}
                    </span>
                    {isActive && (
                      <motion.div 
                        layoutId="activeStepIndicator"
                        className="w-1 h-1 bg-navy-900 rounded-full mx-auto mt-1"
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-navy-900 mb-8 border-b pb-4">Learner Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">First Name(s)</label>
                    <input {...register('learnerInfo.firstName')} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-navy-900 focus:border-transparent outline-none transition-all" />
                    {errors.learnerInfo?.firstName && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.learnerInfo.firstName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Surname</label>
                    <input {...register('learnerInfo.surname')} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-navy-900 focus:border-transparent outline-none transition-all" />
                    {errors.learnerInfo?.surname && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.learnerInfo.surname.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                    <input type="date" {...register('learnerInfo.dob')} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-navy-900 focus:border-transparent outline-none transition-all" />
                    {errors.learnerInfo?.dob && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.learnerInfo.dob.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Grade Applying For</label>
                    <select {...register('learnerInfo.grade')} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-navy-900 focus:border-transparent outline-none transition-all">
                      <option value="">Select Grade</option>
                      {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                    {errors.learnerInfo?.grade && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.learnerInfo.grade.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                    <div className="flex gap-4">
                      {["Male", "Female", "Other"].map(g => (
                        <label key={g} className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" value={g} {...register('learnerInfo.gender')} className="w-4 h-4 text-navy-900" />
                          <span className="text-sm text-gray-700">{g}</span>
                        </label>
                      ))}
                    </div>
                    {errors.learnerInfo?.gender && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.learnerInfo.gender.message}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Residential Address</label>
                    <textarea {...register('learnerInfo.address')} rows={3} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-navy-900 focus:border-transparent outline-none transition-all" />
                    {errors.learnerInfo?.address && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.learnerInfo.address.message}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Previous School (Optional)</label>
                    <input {...register('learnerInfo.previousSchool')} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-navy-900 focus:border-transparent outline-none transition-all" placeholder="Name of the school last attended" />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-navy-900 mb-8 border-b pb-4">Parent / Guardian Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Primary Guardian Name</label>
                    <input {...register('parentInfo.guardianName')} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-navy-900 focus:border-transparent outline-none transition-all" />
                    {errors.parentInfo?.guardianName && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.parentInfo.guardianName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Guardian Phone</label>
                    <input {...register('parentInfo.guardianPhone')} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-navy-900 focus:border-transparent outline-none transition-all" />
                    {errors.parentInfo?.guardianPhone && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.parentInfo.guardianPhone.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Guardian Email</label>
                    <input type="email" {...register('parentInfo.guardianEmail')} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-navy-900 focus:border-transparent outline-none transition-all" />
                    {errors.parentInfo?.guardianEmail && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.parentInfo.guardianEmail.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Emergency Contact Number</label>
                    <input {...register('parentInfo.emergencyContact')} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-navy-900 focus:border-transparent outline-none transition-all" />
                    {errors.parentInfo?.emergencyContact && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.parentInfo.emergencyContact.message}</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-navy-900 mb-8 border-b pb-4">Health History</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Allergies</label>
                    <input {...register('healthHistory.allergies')} placeholder="Specify or write 'None'" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-navy-900 focus:border-transparent outline-none transition-all" />
                    {errors.healthHistory?.allergies && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.healthHistory.allergies.message}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Chronic Conditions</label>
                    <input {...register('healthHistory.conditions')} placeholder="Specify or write 'None'" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-navy-900 focus:border-transparent outline-none transition-all" />
                    {errors.healthHistory?.conditions && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.healthHistory.conditions.message}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Current Medication</label>
                    <input {...register('healthHistory.medication')} placeholder="Specify or write 'None'" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-navy-900 focus:border-transparent outline-none transition-all" />
                    {errors.healthHistory?.medication && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.healthHistory.medication.message}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Disabilities / Special Needs</label>
                    <input {...register('healthHistory.disabilities')} placeholder="Specify or write 'None'" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-navy-900 focus:border-transparent outline-none transition-all" />
                    {errors.healthHistory?.disabilities && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.healthHistory.disabilities.message}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Doctor / Clinic Details</label>
                    <textarea {...register('healthHistory.doctorDetails')} rows={2} placeholder="Name, Contact Number, Address" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-navy-900 focus:border-transparent outline-none transition-all" />
                    {errors.healthHistory?.doctorDetails && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.healthHistory.doctorDetails.message}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="flex items-start gap-3 cursor-pointer p-4 bg-navy-50 rounded-xl border border-navy-100">
                      <input type="checkbox" {...register('healthHistory.emergencyConsent')} className="mt-1 w-5 h-5 text-navy-900 rounded" />
                      <span className="text-sm text-navy-900 leading-relaxed">
                        I hereby give consent for the school to arrange emergency medical treatment if required, at my expense.
                      </span>
                    </label>
                    {errors.healthHistory?.emergencyConsent && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.healthHistory.emergencyConsent.message}</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-navy-900 mb-8 border-b pb-4">Document Uploads</h2>
                <p className="text-sm text-gray-600 mb-6">
                  Please upload clear copies of the following required documents. You can use your device's camera or select files.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { id: 'birthCertificate', label: 'Birth Certificate', required: true },
                    { id: 'reportCard', label: 'Latest Report Card', required: true },
                    { id: 'guardianId', label: 'Guardian ID / Passport', required: true },
                    { id: 'healthCertificate', label: 'Health / Immunization Certificate', required: true },
                    { id: 'transferDocument', label: 'Transfer Document (If applicable)', required: false },
                  ].map((doc) => {
                    const fieldName = `documents.${doc.id}` as const;
                    const isUploaded = !!watch(fieldName as any);
                    const error = (errors.documents as any)?.[doc.id];
                    const progress = uploadProgress[doc.id];
                    const isUploading = progress !== undefined;

                    return (
                      <div key={doc.id} className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          {doc.label} {doc.required && <span className="text-red-500">*</span>}
                        </label>
                        <div className={cn(
                          "relative border-2 border-dashed rounded-xl p-4 transition-all flex flex-col items-center justify-center gap-2 min-h-[120px]",
                          isUploaded ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-navy-300",
                          isUploading && "border-navy-300 bg-navy-50/30"
                        )}>
                          {isUploading ? (
                            <div className="w-full px-4 space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-navy-900 uppercase tracking-wider">Uploading...</span>
                                <span className="text-[10px] font-bold text-navy-900">{progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${progress}%` }}
                                  transition={{ duration: 0.2 }}
                                  className="bg-navy-900 h-full rounded-full"
                                />
                              </div>
                              <p className="text-[10px] text-center text-gray-500 italic">Processing file securely</p>
                            </div>
                          ) : isUploaded ? (
                            <>
                              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-6 h-6" />
                              </div>
                              <span className="text-xs font-medium text-green-700">Document Uploaded</span>
                              <button 
                                type="button"
                                onClick={() => setValue(fieldName as any, '')}
                                className="text-[10px] text-red-500 hover:underline"
                              >
                                Remove and re-upload
                              </button>
                            </>
                          ) : (
                            <>
                              <Upload className="w-8 h-8 text-gray-400" />
                              <input 
                                type="file" 
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    if (validateFileType(file, fieldName)) {
                                      simulateUpload(doc.id, file.name, fieldName);
                                    } else {
                                      setValue(fieldName as any, '');
                                    }
                                  }
                                }}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                              />
                              <span className="text-xs text-gray-500">Click to upload or drag & drop</span>
                            </>
                          )}
                        </div>
                        {error && (
                          <p className="text-[10px] text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {error.message}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div 
                key="step5"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-navy-900 mb-8 border-b pb-4">Consent & Final Submission</h2>
                
                <div className="space-y-4">
                  <div className="space-y-4">
                    <label className="flex items-start gap-3 cursor-pointer p-4 hover:bg-gray-50 rounded-xl transition-colors">
                      <input type="checkbox" {...register('consent.popia')} className="mt-1 w-5 h-5 text-navy-900 rounded" />
                      <span className="text-sm text-gray-700 leading-relaxed">
                        I consent to the collection and processing of my personal data in accordance with the POPIA Act.
                      </span>
                    </label>
                    {errors.consent?.popia && <p className="text-xs text-red-500">{errors.consent.popia.message}</p>}

                    <label className="flex items-start gap-3 cursor-pointer p-4 hover:bg-gray-50 rounded-xl transition-colors">
                      <input type="checkbox" {...register('consent.policy')} className="mt-1 w-5 h-5 text-navy-900 rounded" />
                      <span className="text-sm text-gray-700 leading-relaxed">
                        I have read and accept the school's admission policy and code of conduct.
                      </span>
                    </label>
                    {errors.consent?.policy && <p className="text-xs text-red-500">{errors.consent.policy.message}</p>}

                    <div className="p-4 bg-white rounded-xl border border-gray-200">
                      <span className="block text-sm font-semibold text-gray-700 mb-3">Photo & Media Consent</span>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" value="Yes" {...register('consent.photoConsent')} className="w-4 h-4 text-navy-900" />
                          <span className="text-sm text-gray-700">Yes, I consent</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" value="No" {...register('consent.photoConsent')} className="w-4 h-4 text-navy-900" />
                          <span className="text-sm text-gray-700">No, I do not consent</span>
                        </label>
                      </div>
                      {errors.consent?.photoConsent && <p className="mt-2 text-xs text-red-500">{errors.consent.photoConsent.message}</p>}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-12 flex justify-between pt-8 border-t border-gray-100">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center gap-2 px-6 py-3 text-gray-600 font-bold hover:text-navy-900 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" /> Previous
              </button>
            ) : <div />}

            {step < 5 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 px-8 py-3 bg-navy-900 text-white rounded-lg font-bold hover:bg-navy-800 transition-all shadow-lg shadow-navy-900/20"
              >
                Next Step <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "flex items-center gap-2 px-10 py-3 bg-navy-900 text-white rounded-lg font-bold transition-all shadow-lg shadow-navy-900/20",
                  isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-navy-800"
                )}
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
