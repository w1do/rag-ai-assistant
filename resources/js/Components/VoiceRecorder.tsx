import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceRecorderProps {
    onRecordingComplete: (blob: Blob) => void;
    isUploading?: boolean;
}

export default function VoiceRecorder({ onRecordingComplete, isUploading }: VoiceRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                mediaRecorderRef.current.stop();
            }
        };
    }, []);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            // Определяем поддерживаемый MIME-тип
            // iOS Safari поддерживает audio/mp4. Большинство других - audio/webm.
            let mimeType = '';
            if (MediaRecorder.isTypeSupported('audio/webm')) {
                mimeType = 'audio/webm';
            } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
                mimeType = 'audio/mp4';
            } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
                mimeType = 'audio/ogg';
            }

            const mediaRecorder = new MediaRecorder(stream, { mimeType });
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: mimeType });
                onRecordingComplete(blob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);

            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);

        } catch (err) {
            console.error('Ошибка при доступе к микрофону:', err);
            alert('Не удалось получить доступ к микрофону. Пожалуйста, проверьте настройки разрешений.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setRecordingTime(0);
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 border border-border-color-one rounded-[2px] bg-extra-color w-full">
            <div className="mb-4 text-2xl font-bold text-white-color font-mono">
                {formatTime(recordingTime)}
            </div>
            
            <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isUploading}
                className={cn(
                    "relative flex items-center justify-center w-20 h-20 rounded-full transition-all duration-300 shadow-lg border-2",
                    isRecording 
                        ? "bg-red-500 border-red-500 hover:bg-red-600 animate-pulse scale-110 text-white" 
                        : "bg-transparent border-border-color-one text-white hover:bg-primary-color hover:border-primary-color hover:text-black-color",
                    isUploading && "opacity-50 cursor-not-allowed"
                )}
            >
                {isUploading ? (
                    <Loader2 className="w-8 h-8 animate-spin" />
                ) : isRecording ? (
                    <Square className="w-8 h-8 fill-current" />
                ) : (
                    <Mic className="w-8 h-8" />
                )}
                
                {isRecording && (
                   <span className="absolute -inset-1 rounded-full border-2 border-red-500 animate-ping opacity-75"></span>
                )}
            </button>
            
            <p className="mt-6 text-xs font-bold text-text-secondary uppercase tracking-widest">
                {isUploading ? 'Загрузка записи...' : isRecording ? 'Нажмите, чтобы остановить' : 'Нажмите, чтобы записать голос'}
            </p>
        </div>
    );
}
