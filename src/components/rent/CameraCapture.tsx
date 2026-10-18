import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, X, RotateCcw } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (dataUrl: string) => void;
  onClose: () => void;
  title?: string;
}

export default function CameraCapture({ onCapture, onClose, title = 'Skeniraj tablico' }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Dostop do kamere ni bil dovoljen ali ni kamere na voljo.');
    }
  };

  const stopCamera = () => {
    stream?.getTracks().forEach((track) => track.stop());
  };

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setPhoto(dataUrl);
    stopCamera();
  };

  const retake = () => {
    setPhoto(null);
    startCamera();
  };

  const confirm = () => {
    if (photo) {
      onCapture(photo);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
      <div className="flex items-center justify-between p-4">
        <Button variant="ghost" size="icon" className="text-white" onClick={onClose}>
          <X className="w-6 h-6" />
        </Button>
        <h2 className="text-white font-semibold">{title}</h2>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex items-center justify-center relative">
        {!photo ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-contain"
          />
        ) : (
          <img src={photo} alt="Zajeta slika" className="w-full h-full object-contain" />
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {error && <p className="text-destructive text-center px-4 py-2">{error}</p>}

      <div className="p-6 flex items-center justify-center gap-4">
        {!photo ? (
          <Button
            size="lg"
            className="rounded-full w-16 h-16 p-0 bg-white hover:bg-white/90"
            onClick={takePhoto}
            disabled={!stream}
          >
            <Camera className="w-6 h-6 text-black" />
          </Button>
        ) : (
          <>
            <Button variant="outline" size="lg" onClick={retake}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Ponovi
            </Button>
            <Button size="lg" className="btn-emergency" onClick={confirm}>
              Uporabi sliko
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
