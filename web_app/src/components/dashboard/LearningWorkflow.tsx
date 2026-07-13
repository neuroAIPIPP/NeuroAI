import {
  AlertCircle,
  BookOpen,
  Cpu,
  PlayCircle,
  ScanFace,
  Target,
  Video,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const workflowSteps = [
  {
    id: 1,
    title: 'Langkah 1: Pengaturan Perangkat Keras',
    description:
      'Hubungkan headset EEG dan berikan izin kamera. Pastikan semua perangkat siap sebelum melanjutkan.',
    icon: Cpu,
    buttonText: 'Ke Perangkat Keras',
    buttonLink: '/hardware',
  },
  {
    id: 2,
    title: 'Langkah 2: Registrasi Wajah',
    description:
      'Daftarkan wajah Anda untuk mengaktifkan verifikasi identitas dan analisis wajah real-time selama sesi pembelajaran.',
    icon: ScanFace,
    buttonText: 'Ke Registrasi Wajah',
    buttonLink: '/face-register',
  },
  {
    id: 3,
    title: 'Langkah 3: Pilih Kursus',
    description: 'Pilih kursus yang ingin Anda pelajari.',
    icon: BookOpen,
    buttonText: 'Pilih Kursus',
    buttonLink: '/session',
  },
  {
    id: 4,
    title: 'Langkah 4: Pilih Pertemuan',
    description: 'Pilih pertemuan hari ini atau materi pembelajaran.',
    icon: Video,
  },
  {
    id: 5,
    title: 'Langkah 5: Kalibrasi',
    description:
      'Selesaikan proses kalibrasi pelacakan mata dan perhatian sebelum memasuki sesi pembelajaran.',
    icon: Target,
  },
  {
    id: 6,
    title: 'Langkah 6: Sesi Pembelajaran',
    description:
      'Tonton video pembelajaran sementara NeuroLearn AI memantau fokus dan perhatian Anda secara terus-menerus.',
    icon: PlayCircle,
    isImportant: true,
    importantText:
      'Penting: Video pembelajaran tidak dapat dijeda atau dilewati untuk memastikan pemantauan biometrik terus menerus dan analisis fokus yang akurat.',
  },
];

export default function LearningWorkflow() {
  return (
    <div className="flex-1 flex flex-col w-full">
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-[27px] top-4 bottom-8 w-0.5 bg-gray-200 z-0 hidden md:block"></div>

        <div className="flex flex-col gap-6">
          {workflowSteps.map((step) => (
            <div
              key={step.id}
              className="relative z-10 flex flex-col md:flex-row gap-6 items-start"
            >
              {/* Icon Circle */}
              <div className="hidden md:flex flex-shrink-0 w-[56px] h-[56px] rounded-full bg-[#8EACCD] text-white items-center justify-center shadow-md relative z-10">
                <step.icon size={24} strokeWidth={2} />
              </div>

              {/* Content Card */}
              <div className="flex-1 bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 w-full">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3 md:hidden mb-2">
                    <div className="flex-shrink-0 w-[40px] h-[40px] rounded-full bg-[#8EACCD] text-white flex items-center justify-center shadow-md">
                      <step.icon size={18} strokeWidth={2} />
                    </div>
                    <h3 className="text-lg font-bold text-[#2A3441]">
                      {step.title}
                    </h3>
                  </div>
                  <h3 className="text-lg font-bold text-[#2A3441] hidden md:block">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-3xl">
                    {step.description}
                  </p>

                  {step.isImportant && (
                    <div className="mt-4 bg-yellow-50/80 border-l-4 border-yellow-400 p-4 rounded-r-lg flex gap-3 items-start">
                      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-yellow-800 leading-relaxed font-medium">
                        {step.importantText}
                      </p>
                    </div>
                  )}
                </div>

                {step.buttonText && step.buttonLink && (
                  <Link
                    href={step.buttonLink}
                    className="flex-shrink-0 w-full md:w-auto mt-2 md:mt-0"
                  >
                    <button className="w-full md:w-auto px-6 py-2.5 bg-[#3B526A] text-white text-sm font-bold rounded-full hover:bg-[#2C3F53] transition-all shadow-md border-none cursor-pointer whitespace-nowrap">
                      {step.buttonText}
                    </button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
