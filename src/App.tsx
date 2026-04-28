/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Car, 
  Wrench, 
  Battery, 
  MapPin, 
  Navigation, 
  FileText, 
  LayoutDashboard, 
  User, 
  Settings, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Camera, 
  Upload,
  ChevronRight,
  Menu,
  X,
  ShieldCheck,
  TrendingUp,
  Truck,
  Phone,
  Info,
  FileStack,
  Download,
  Send,
  Zap,
  FolderOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types & Constants ---

enum Role {
  CLIENT = 'cliente',
  OPERATOR = 'operador',
  ADJUSTER = 'ajustador',
  ADMIN = 'admin'
}

type ServiceStatus = 'Completado' | 'En Camino' | 'Pendiente' | 'En Revisión';

interface Claim {
  id: string;
  policyNumber: string;
  insuredName: string;
  date: string;
  location: string;
  narrative: string;
  status: ServiceStatus;
  files: number;
}

interface Service {
  id: string;
  type: string;
  location: string;
  status: ServiceStatus;
  time: string;
  user: string;
  operator?: string;
  amount?: string;
}

const PRIMARY_BLUE = '#003366'; // ASPV Dark Blue

const MOCK_CLAIMS: Claim[] = [
  { id: 'SIN-401', policyNumber: 'POL-8821', insuredName: 'Fernando Torres', date: '2024-04-28 14:20', location: 'Av. Gustavo Baz, Tlalnepantla', narrative: 'Choque por alcance en semáforo. Daños menores en fascia trasera.', status: 'En Revisión', files: 4 },
  { id: 'SIN-402', policyNumber: 'POL-3310', insuredName: 'Mariana Ríos', date: '2024-04-27 09:15', location: 'Calz. de los Jinetes, Arboledas', narrative: 'Impacto lateral contra objeto fijo (bolardo). No hay terceros involucrados.', status: 'Completado', files: 6 },
  { id: 'SIN-403', policyNumber: 'POL-5592', insuredName: 'Carlos Slim', date: '2024-04-28 16:45', location: 'Vía Adolfo López Mateos, Tlalnepantla', narrative: 'Rotura de cristal por intento de robo. El vehículo se encontraba estacionado.', status: 'En Revisión', files: 3 },
];

const MOCK_SERVICES: Service[] = [
  { id: 'SRV-101', type: 'Grúa', location: 'Tlalnepantla, EdoMex', status: 'Completado', time: '10:30 AM', user: 'Roberto G.', operator: 'Juan M.', amount: '$1,200' },
  { id: 'SRV-102', type: 'Cambio de Llanta', location: 'Polanco, CDMX', status: 'En Camino', time: '11:15 AM', user: 'Elena V.', operator: 'Carlos R.', amount: '$450' },
  { id: 'SRV-103', type: 'Paso de Corriente', location: 'Condesa, CDMX', status: 'Pendiente', time: '11:45 AM', user: 'Marcos P.', amount: '$300' },
  { id: 'SRV-104', type: 'Grúa', location: 'Santa Fe, CDMX', status: 'Pendiente', time: '12:05 PM', user: 'Sofía L.', amount: '$1,500' },
  { id: 'SRV-105', type: 'Suministro Gasolina', location: 'Coyoacán, CDMX', status: 'Completado', time: '09:15 AM', user: 'David T.', operator: 'Sonia B.', amount: '$850' },
];

// --- Sub-components ---

const Badge = ({ status }: { status: ServiceStatus }) => {
  const styles = {
    'Completado': 'bg-green-100 text-green-800 border-green-200',
    'En Camino': 'bg-blue-100 text-blue-800 border-blue-200',
    'Pendiente': 'bg-amber-100 text-amber-800 border-amber-200',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${styles[status]}`}>
      {status}
    </span>
  );
};

const CustomToast = ({ message, onClose }: { message: string, onClose: () => void }) => (
    <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-zinc-900/90 backdrop-blur-md text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 max-w-[90vw] md:max-w-md border border-white/10"
    >
        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-white" />
        </div>
        <p className="text-sm font-medium leading-tight">{message}</p>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-4 h-4" />
        </button>
    </motion.div>
);

// --- View Components ---

const ClientView = () => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePanic = () => {
    setIsRequesting(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setToastMessage(`Ubicación confirmada. Preparando formulario de asistencia...`);
          setTimeout(() => {
              setIsRequesting(false);
              setShowForm(true);
          }, 1000);
        },
        () => {
          setToastMessage("No se pudo obtener la ubicación. Por favor ingresa los datos en el formulario.");
          setIsRequesting(false);
          setShowForm(true);
        }
      );
    } else {
      setShowForm(true);
      setIsRequesting(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
        setIsSubmitting(false);
        setToastMessage("Solicitud enviada exitosamente. Estamos en camino.");
        setShowForm(false);
    }, 2000);
  };

  if (showForm) {
      return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto w-full px-4"
        >
            <AnimatePresence>
                {toastMessage && <CustomToast message={toastMessage} onClose={() => setToastMessage(null)} />}
            </AnimatePresence>

            <div className="bg-white border-t-[12px] border-blue-900 rounded-[2rem] p-6 sm:p-10 shadow-2xl relative">
                <button onClick={() => setShowForm(false)} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <X className="w-5 h-5 text-slate-300" />
                </button>
                
                <div className="mb-10 text-center sm:text-left">
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Solicitud de Asistencia</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">Atención inmediata ASPV Seguros</p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-8">
                    <div className="space-y-6">
                        <div className="p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100 focus-within:border-blue-900/30 transition-all">
                            <label className="block text-[11px] font-black uppercase tracking-widest text-blue-900 mb-3">Nombre Completo del Asegurado</label>
                            <input required type="text" placeholder="Ej. Juan Pérez" className="w-full bg-transparent border-b-2 border-slate-200 py-3 text-lg font-bold focus:outline-none focus:border-blue-900 transition-all" />
                        </div>
                        
                        <div className="p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100 focus-within:border-blue-900/30 transition-all">
                            <label className="block text-[11px] font-black uppercase tracking-widest text-blue-900 mb-3">Teléfono de Contacto (10 dígitos)</label>
                            <input required type="tel" placeholder="55 1234 5678" className="w-full bg-transparent border-b-2 border-slate-200 py-3 text-lg font-bold focus:outline-none focus:border-blue-900 transition-all" />
                        </div>

                        <div className="p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100 focus-within:border-blue-900/30 transition-all">
                            <label className="block text-[11px] font-black uppercase tracking-widest text-blue-900 mb-3">Servicio Requerido</label>
                            <div className="relative">
                                <select className="w-full bg-transparent border-b-2 border-slate-200 py-3 text-lg font-bold focus:outline-none focus:border-blue-900 transition-all appearance-none">
                                    <option>Grúa (Avería o Siniestro)</option>
                                    <option>Paso de Corriente</option>
                                    <option>Cambio de Llanta</option>
                                    <option>Suministro de Combustible</option>
                                    <option>Asistencia Médica</option>
                                </select>
                                <ChevronRight className="w-5 h-5 absolute right-0 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                        <div className="p-6 bg-blue-50/50 rounded-[1.5rem] border border-blue-100/50">
                            <label className="block text-[11px] font-black uppercase tracking-widest text-blue-900 mb-2 flex items-center gap-2">
                                <MapPin className="w-4 h-4" /> Ubicación Detectada
                            </label>
                            <p className="text-sm font-bold text-slate-600 leading-relaxed">Calz. de los Jinetes, Arboledas, Tlalnepantla de Baz, Estado de México.</p>
                        </div>

                        <div className="p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                            <label className="block text-[11px] font-black uppercase tracking-widest text-blue-900 mb-4">Evidencia del Problema</label>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <label className="flex-1 border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-blue-900/30 transition-all group">
                                    <div className="w-12 h-12 bg-blue-900 text-white rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                        <Camera className="w-6 h-6" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Tomar Foto</span>
                                    <input type="file" accept="image/*" capture="environment" className="hidden" />
                                </label>
                                <label className="flex-1 border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-blue-900/30 transition-all group">
                                    <div className="w-12 h-12 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                        <Upload className="w-6 h-6" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Cargar Archivo</span>
                                    <input type="file" accept="image/*" className="hidden" />
                                </label>
                            </div>
                        </div>
                    </div>

                    <button 
                        disabled={isSubmitting}
                        type="submit"
                        className="w-full py-6 bg-blue-900 text-white rounded-[2rem] font-black uppercase tracking-[0.4em] text-xs shadow-2xl shadow-blue-900/40 hover:bg-slate-900 transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>
                                <Clock className="w-5 h-5 animate-spin" />
                                PROCESANDO SOLICITUD...
                            </>
                        ) : (
                            <>
                                <ShieldCheck className="w-6 h-6" />
                                CONFIRMAR Y ENVIAR AYUDA
                            </>
                        )}
                    </button>
                </form>
            </div>
        </motion.div>
      );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full"
    >
        <AnimatePresence>
            {toastMessage && <CustomToast message={toastMessage} onClose={() => setToastMessage(null)} />}
        </AnimatePresence>

      <div className="md:col-span-12 lg:col-span-5 flex flex-col gap-6">
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-sm min-h-[450px]">
          <div className="absolute inset-0 bg-red-500/[0.03] pointer-events-none" />
          <p className="text-red-600 text-[11px] font-black uppercase tracking-[0.25em] mb-12 relative z-10 animate-pulse">Central de Asistencia Vial</p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePanic}
            disabled={isRequesting}
            className="relative group z-10"
          >
            <div className="absolute inset-0 bg-red-600 rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity animate-pulse" />
            <div className="relative w-64 h-64 rounded-full bg-red-600 flex flex-col items-center justify-center text-white font-bold p-8 shadow-[0_30px_70px_rgba(220,38,38,0.5)] border-[12px] border-white group-active:scale-90 transition-transform">
              <span className="text-2xl sm:text-3xl leading-[1.1] uppercase tracking-tighter font-black text-center">
                {isRequesting ? 'LOCALIZANDO...' : 'SOLICITAR ASISTENCIA'}
              </span>
            </div>
          </motion.button>
          
          <p className="mt-12 text-slate-400 text-[11px] font-black uppercase tracking-[0.2em] relative z-10 flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              OPERATIVO 24/7 EN LÍNEA
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Grúa', icon: Truck, color: 'text-blue-900' },
            { label: 'Llanta', icon: Wrench, color: 'text-blue-900' },
            { label: 'Corriente', icon: Battery, color: 'text-blue-900' },
          ].map((opt) => (
            <button 
              key={opt.label}
              onClick={() => setShowForm(true)}
              className="p-6 rounded-[2rem] bg-white border border-slate-100 hover:border-blue-900/30 transition-all flex flex-col items-center gap-4 text-center group shadow-sm active:scale-95"
            >
              <div className={`p-4 rounded-2xl bg-slate-50 group-hover:bg-blue-50 ${opt.color} transition-colors shadow-inner`}>
                <opt.icon className="w-7 h-7" />
              </div>
              <span className="text-[11px] uppercase font-black tracking-widest text-slate-500 group-hover:text-blue-900">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="md:col-span-12 lg:col-span-7 flex flex-col gap-6">
        <div className="flex-1 bg-white border border-slate-200 rounded-[2.5rem] p-8 lg:p-10 overflow-hidden relative shadow-sm min-h-[450px]">
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#003366 2px, transparent 2px)', backgroundSize: '24px 24px' }} />
          
          <div className="relative z-10 h-full flex flex-col">
            <h3 className="text-[11px] font-black text-slate-900 mb-8 flex items-center justify-between uppercase tracking-[0.3em]">
              Localización Satelital
              <span className="flex h-3 w-3 rounded-full bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.8)] animate-pulse"></span>
            </h3>
            
            <div className="flex-1 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center justify-center relative shadow-inner overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[180%] h-[180%] border-4 border-blue-900/5 rounded-full" />
                    <div className="w-[130%] h-[130%] border-4 border-blue-900/5 rounded-full absolute" />
                    <div className="w-[80%] h-[80%] border-4 border-blue-900/5 rounded-full absolute" />
                </div>
                <div className="relative">
                    <div className="w-16 h-16 bg-blue-600/10 rounded-full border border-blue-600/30 flex items-center justify-center animate-ping absolute" />
                    <div className="w-16 h-16 bg-blue-900 rounded-full border-[6px] border-white flex items-center justify-center relative z-10 shadow-2xl">
                        <MapPin className="w-8 h-8 text-white" />
                    </div>
                </div>
            </div>

            <div className="mt-8 flex items-start gap-5 p-6 bg-blue-900 text-white rounded-[2rem] shadow-2xl border border-white/10">
              <div className="p-3 bg-white/10 rounded-xl">
                <Navigation className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] mb-2 opacity-60">Dirección Confirmada</p>
                <p className="text-base font-bold leading-snug">Calz. de los Jinetes #124, Las Arboledas, Tlainepantla de Baz, Edo. Méx.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const OperatorView = () => {
  const [activeJob, setActiveJob] = useState<Service | null>(null);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Servicios Activos</h2>
        <span className="text-[10px] font-black text-blue-900 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 uppercase tracking-widest">3 Disponibles</span>
      </div>

      <AnimatePresence mode="wait">
        {!activeJob ? (
          <div className="space-y-3">
            {MOCK_SERVICES.filter(s => s.status === 'Pendiente').map((job) => (
              <motion.div 
                key={job.id}
                layout
                className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm hover:border-blue-900/30 transition-all"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
                        <Truck className="w-6 h-6 text-blue-900" />
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                            <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-100 px-2 rounded">#{job.id.split('-')[1]}</span>
                            <h3 className="font-bold text-slate-900 text-sm">{job.type}</h3>
                        </div>
                        <div className="flex items-center text-slate-500 text-xs">
                            <MapPin className="w-3.5 h-3.5 mr-1" />
                            {job.location}
                        </div>
                    </div>
                </div>
                <button 
                  onClick={() => setActiveJob(job)}
                  className="w-full sm:w-auto px-8 py-2.5 bg-blue-900 text-white text-[11px] font-black uppercase tracking-widest rounded-lg hover:bg-slate-800 transition-all active:scale-95 shadow-md shadow-blue-900/20"
                >
                  ACEPTAR
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className="p-4 rounded-xl bg-blue-900 text-white flex items-center justify-between shadow-xl">
              <div className="flex items-center space-x-3">
                <Navigation className="w-4 h-4 animate-pulse" />
                <span className="font-bold text-xs uppercase tracking-widest">Ruta Activa - En camino</span>
              </div>
              <span className="text-[10px] font-black opacity-80">ETA: 12 MIN</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-[2rem] p-6 space-y-6 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Cliente Asignado</p>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-900" />
                    </div>
                    <div>
                        <span className="text-slate-900 font-bold block text-base">{activeJob.user}</span>
                        <span className="text-[10px] text-slate-500 lowercase font-mono">folio: {activeJob.id}</span>
                    </div>
                  </div>
                </div>
                <div className="sm:text-right space-y-2">
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Liquidación</p>
                  <p className="text-3xl font-black text-blue-900 tracking-tight">{activeJob.amount}</p>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Evidencia de Arribo</p>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="aspect-square bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-300">
                      <Camera className="w-6 h-6 outline-none" />
                    </div>
                  ))}
                  <button className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 transition-all hover:bg-slate-100 hover:border-blue-900/20 group">
                    <Upload className="w-5 h-5 mb-1 group-hover:-translate-y-0.5 transition-transform" />
                    <span className="text-[8px] uppercase font-black">Subir</span>
                  </button>
                </div>
              </div>

              <button 
                onClick={() => setActiveJob(null)}
                className="w-full py-4 bg-green-600 hover:bg-green-700 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-md active:scale-[0.98]"
              >
                Finalizar Servicio
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const AJUSTADORES = [
    "JOSE LLERGOS TEJERO (CAM)", "KEVIN ARMANDO NAH MORENO (MID)", "JESUS SILVANO SIMA PECH (MID)",
    "AMELIA DE JESUS DZUL CHAB (MID)", "FIDEL ANGEL CANUL TZAB (MID)", "IRVING JOSE POOT CETINA (CUN)",
    "NANCY SALAZAR (CUN)", "MIGUEL ANGEL CORTES RODRIGUEZ (MID)", "JENNY TRINIDAD CERINO MORALES (TAB)",
    "JESUS MONTEJO RODRIGUEZ (TAB)", "JOVANY PEREZ GONZALEZ (TAB)", "VINCEL DANIEL ACOSTA VARGAS (TAB)",
    "CESAR RAYMUNDO VAZQUEZ (CUN)", "INOCENTE DE JESUS CEFERINO ARIAS (CUN)", "ALEJANDRO PADILLA COCOM (MID)"
];

const ASEGURADORAS = [
    "BEPENSA AUTOSEGURO", "GENERAL DE SEGUROS", "MAPFRE SEGUROS", "ANA SEGUROS", "AFIRME SEGUROS",
    "SEGUROS INBURSA", "ZURICH", "SURA MÉXICO", "SPT SEGUROS", "HDI SEGUROS", "EL POTOSI SEGUROS",
    "AIG SEGUROS", "SEGUROS AZTECA", "NOVA", "ALLIANZ SEGUROS", "CRABI SEGUROS", "MAPS SEGUROS"
];

const ZONAS = ["MERIDA", "VALLADOLID", "CHETUMAL", "COZUMEL", "CANCUN", "FELIPE CARRILLO PUERTO", "PLAYA DEL CARMEN", "VILLAHERMOSA"];

const AdjusterView = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [tipoAsistencia, setTipoAsistencia] = useState("LOCAL");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setToastMessage("Siniestro registrado exitosamente en la base de datos de ASPV SURESTE.");
        }, 2000);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto"
        >
            <AnimatePresence>
                {toastMessage && <CustomToast message={toastMessage} onClose={() => setToastMessage(null)} />}
            </AnimatePresence>

            <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-2 bg-blue-900" />
                
                <div className="p-8 md:p-10 border-b border-slate-50 bg-slate-50/50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <div className="space-y-1">
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">REGISTRO DE SINIESTROS ASPV SURESTE</h3>
                            <p className="text-xs font-bold text-blue-900 uppercase tracking-widest">ASISTENCIA Y SERVICIOS DE PROTECCIÓN VIAL</p>
                        </div>
                        <FileStack className="w-12 h-12 text-blue-900/10 hidden md:block" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-white border border-blue-900/10 rounded-2xl shadow-sm">
                            <p className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Clock className="w-3 h-3" /> Política de Siniestralidad
                            </p>
                            <p className="text-[11px] font-bold text-slate-500 leading-tight">
                                CORTE DE SINIESTRALIDAD DESFASADO A UNA QUINCENA.
                            </p>
                        </div>
                        <div className="p-4 bg-white border border-blue-900/10 rounded-2xl space-y-2 shadow-sm">
                            <div className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-900 mt-1" />
                                <p className="text-[10px] font-medium text-slate-600">
                                    <span className="font-black text-slate-900">1er CORTE:</span> DÍA 1 AL 15 (PAGO DÍA 30)
                                </p>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-900 mt-1" />
                                <p className="text-[10px] font-medium text-slate-600">
                                    <span className="font-black text-slate-900">2do CORTE:</span> DÍA 16 AL 30/31 (PAGO DÍA 15 SIG.)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
                    <div className="p-6 bg-blue-900 rounded-[2rem] text-white shadow-xl shadow-blue-900/10 border border-white/10">
                        <label className="block text-[11px] font-black uppercase tracking-[0.2em] mb-3 opacity-70">Nombre del Ajustador</label>
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                <User className="w-6 h-6 text-white" />
                            </div>
                            <select 
                                required
                                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:bg-white/20 transition-all appearance-none"
                            >
                                <option value="" className="text-slate-900">SELECCIONAR AJUSTADOR</option>
                                {AJUSTADORES.map(aj => <option key={aj} value={aj} className="text-slate-900">{aj}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">No. de Siniestro (Folio)</label>
                            <input required type="text" placeholder="SIN-0000" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Aseguradora</label>
                            <select required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold">
                                <option value="">SELECCIONAR</option>
                                {ASEGURADORAS.map(as => <option key={as} value={as}>{as}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nombre del Asegurado</label>
                            <input required type="text" placeholder="Nombre completo" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Fecha de Atención</label>
                            <input required type="datetime-local" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Tipo de Siniestro</label>
                            <select 
                                required 
                                value={tipoAsistencia}
                                onChange={(e) => setTipoAsistencia(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold border-blue-900/10 focus:border-blue-900"
                            >
                                <option value="LOCAL">LOCAL</option>
                                <option value="FORANEO">FORÁNEO</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Zona de Atención</label>
                            <select required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold">
                                <option value="">SELECCIONAR CIUDAD</option>
                                {ZONAS.map(z => <option key={z} value={z}>{z}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Lugar de la Atención (Municipio)</label>
                        <input required type="text" placeholder="Ej. San Francisco de Campeche" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">KM (Solo Foráneos)</label>
                            <input disabled={tipoAsistencia === "LOCAL"} type="text" placeholder="Arriba del KM30" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold disabled:opacity-30" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Monto de Casetas</label>
                            <input type="text" placeholder="$ 0.00" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Recuperación Crucero</label>
                            <input type="text" placeholder="$ 0.00" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold" />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Narrativa de los Hechos</label>
                        <textarea required rows={4} placeholder="Describa a detalle lo sucedido..." className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm font-medium focus:border-blue-900/30 transition-all resize-none shadow-inner"></textarea>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Evidencias Fotográficas</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="border-2 border-dashed border-slate-100 rounded-[1.5rem] p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-all group">
                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner">
                                    <Camera className="w-6 h-6 text-blue-900" />
                                </div>
                                <p className="text-sm font-bold text-slate-900">Tomar Foto</p>
                                <p className="text-[10px] text-slate-400 mt-1 uppercase font-black tracking-tighter">Siniestro o Documentos</p>
                                <input type="file" accept="image/*" capture="environment" className="hidden" />
                            </label>
                            <label className="border-2 border-dashed border-slate-100 rounded-[1.5rem] p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-all group">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Upload className="w-6 h-6 text-slate-400" />
                                </div>
                                <p className="text-sm font-bold text-slate-900">Subir Archivo</p>
                                <p className="text-[10px] text-slate-400 mt-1 uppercase font-black tracking-tighter">Galería o PDF</p>
                                <input type="file" accept="image/*,application/pdf" className="hidden" />
                            </label>
                        </div>
                    </div>

                    <button 
                        disabled={isSubmitting}
                        type="submit"
                        className="w-full py-5 bg-blue-900 text-white rounded-2xl font-black uppercase tracking-[0.4em] text-xs shadow-2xl shadow-blue-900/20 hover:bg-slate-900 transition-all disabled:opacity-50 flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                        {isSubmitting ? (
                            <>
                                <Clock className="w-5 h-5 animate-spin" />
                                REGISTRANDO EN ASPV SURESTE...
                            </>
                        ) : (
                            <>
                                <ShieldCheck className="w-5 h-5" />
                                FINALIZAR REGISTRO DE SINIESTRO
                            </>
                        )}
                    </button>
                    <p className="text-center text-[9px] text-slate-400 font-black uppercase tracking-widest leading-loose">
                        ESTE DOCUMENTO TIENE VALIDEZ LEGAL INTERNA PARA PROCESOS DE SINIESTRALIDAD.<br/>
                        REVISAR DATOS ANTES DE ENVIAR.
                    </p>
                </form>
            </div>
        </motion.div>
    );
};


const AdminView = () => {
    const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    const handleAction = (type: string) => {
        setIsActionLoading(true);
        setTimeout(() => {
            setIsActionLoading(false);
            setToast(type === 'download' ? "Expediente descargado correctamente." : "Expediente enviado a 'Casa Seguro' exitosamente.");
        }, 1500);
    };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <AnimatePresence>
        {toast && <CustomToast message={toast} onClose={() => setToast(null)} />}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Siniestros Hoy', value: '08', icon: AlertCircle, color: 'text-red-600' },
          { label: 'En Revisión', value: '03', icon: Clock, color: 'text-amber-500' },
          { label: 'Expedientes', value: '42', icon: FolderOpen, color: 'text-blue-900' },
          { label: 'Cierre Mensual', value: '$840k', icon: TrendingUp, color: 'text-green-600' },
        ].map((kpi) => (
          <div key={kpi.label} className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-sm">
            <div className={`w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center ${kpi.color} mb-2`}>
              <kpi.icon className="w-4 h-4" />
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.15em]">{kpi.label}</p>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{kpi.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Claims Table */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-black text-xs text-blue-900 uppercase tracking-widest flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Gestión de Siniestros
                </h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-slate-400 text-[9px] uppercase font-black tracking-widest border-b border-slate-50">
                            <th className="px-6 py-4">Siniestro / Póliza</th>
                            <th className="px-6 py-4">Asegurado</th>
                            <th className="px-6 py-4">Estatus</th>
                            <th className="px-6 py-4">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {MOCK_CLAIMS.map((c) => (
                            <tr 
                                key={c.id} 
                                onClick={() => setSelectedClaim(c)}
                                className={`cursor-pointer hover:bg-slate-50 transition-colors ${selectedClaim?.id === c.id ? 'bg-blue-50/50' : ''}`}
                            >
                                <td className="px-6 py-5">
                                    <div className="font-bold text-slate-900 text-sm">{c.id}</div>
                                    <div className="text-[9px] font-mono text-slate-400">{c.policyNumber}</div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="text-xs font-bold text-slate-700">{c.insuredName}</div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                        c.status === 'Completado' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-amber-100 text-amber-700 border-amber-200'
                                    }`}>
                                        {c.status}
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <button className="p-2 hover:bg-white rounded-lg text-blue-900 transition-colors">
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Claim Detail Panel */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm flex flex-col">
            {selectedClaim ? (
                <div className="space-y-6 flex flex-col h-full">
                    <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Detalle de Siniestro</h4>
                        <button onClick={() => setSelectedClaim(null)} className="text-slate-300 hover:text-slate-600">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                        <div>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">Narrativa de Hechos</p>
                            <p className="text-xs text-slate-600 leading-relaxed font-medium">"{selectedClaim.narrative}"</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Camera className="w-3 h-3 text-slate-400" />
                                <span className="text-[10px] font-bold text-slate-500">{selectedClaim.files} Archivos adjuntos</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto space-y-3">
                        <button 
                            disabled={isActionLoading}
                            onClick={() => handleAction('download')}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-blue-900 text-blue-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all"
                        >
                            <Download className="w-3.5 h-3.5" />
                            Descargar Expediente ZIP
                        </button>
                        <button 
                            disabled={isActionLoading}
                            onClick={() => handleAction('send')}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-blue-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md shadow-blue-900/10"
                        >
                            <Send className="w-3.5 h-3.5" />
                            Enviar a Casa Seguro
                        </button>
                    </div>
                </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-10 space-y-4 opacity-40">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                        <Info className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Seleccione un siniestro para ver el expediente completo</p>
                </div>
            )}
        </div>
      </div>
    </motion.div>
  );
};

// --- Main Application ---

export default function App() {
  const [role, setRole] = useState<Role>(Role.CLIENT);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevenir que el navegador lo muestre automáticamente
      e.preventDefault();
      // Guardar el evento para dispararlo luego
      setDeferredPrompt(e);
      // Mostrar nuestro propio aviso
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Mostrar el prompt del navegador
    deferredPrompt.prompt();
    
    // Esperar a que el usuario responda
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`ASPV: Resultado de instalación: ${outcome}`);
    
    // Limpiar el estado
    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  const toggleRole = (r: Role) => {
    setRole(r);
    setIsSidebarOpen(false);
  };

  const menuItems = [
    { id: Role.CLIENT, label: 'Cliente', icon: User },
    { id: Role.OPERATOR, label: 'Operador', icon: Truck },
    { id: Role.ADJUSTER, label: 'Ajustador', icon: FileStack },
    { id: Role.ADMIN, label: 'Gestión', icon: LayoutDashboard },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-900/10 flex flex-col">
      
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-white border-b border-slate-100 flex items-center justify-between px-4 sm:px-10 z-50">
        <div className="flex items-center gap-4">
          <img 
            src="https://cossma.com.mx/aspv.png" 
            alt="ASPV Seguros" 
            className="h-10 sm:h-12 object-contain"
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex bg-slate-50 p-1 rounded-xl border border-slate-100">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setRole(item.id)}
              className={`px-6 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${
                role === item.id 
                ? 'bg-white text-blue-900 shadow-sm border border-slate-100' 
                : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-6">
          <div className="hidden lg:block text-right">
            <p className="text-[9px] text-blue-900 font-black uppercase tracking-widest">Atención VIP</p>
            <p className="text-xs font-bold text-slate-900">800 234 9000</p>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="md:hidden p-2 text-slate-400 hover:text-blue-900 transition-colors"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div className="hidden sm:flex w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 items-center justify-center">
            <User className="w-5 h-5 text-slate-400" />
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Navigation */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white z-[60] md:hidden pt-24 px-6"
          >
            <div className="space-y-3">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleRole(item.id)}
                  className={`w-full flex items-center space-x-4 p-5 rounded-2xl transition-all ${
                    role === item.id ? 'bg-blue-900 text-white shadow-xl translate-x-1' : 'text-slate-500 bg-slate-50 border border-transparent'
                  }`}
                >
                  <item.icon className="w-6 h-6 shrink-0" />
                  <span className="text-lg font-black uppercase tracking-widest">{item.label}</span>
                </button>
              ))}
            </div>
            <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center text-center gap-3">
                <Phone className="w-8 h-8 text-blue-900" />
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Atención Telefónica</p>
                <p className="text-xl font-black text-blue-900">800 234 9000</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <main className="flex-1 pt-28 pb-16 px-4 sm:px-10 max-w-7xl mx-auto w-full">
        <header className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-900 shadow-[0_0_8px_rgba(0,51,102,0.4)]" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                    ACCESO {role.toUpperCase()}
                </p>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight uppercase">
              {role === Role.CLIENT && "Hola, Harold"}
              {role === Role.OPERATOR && "Operativo"}
              {role === Role.ADJUSTER && "Ajuste Siniestro"}
              {role === Role.ADMIN && "Estatus Red"}
            </h2>
          </div>
          
          <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-4 rounded-2xl shadow-sm">
            <div className="w-1.5 h-10 bg-blue-900 rounded-full" />
            <div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Protección Activa</p>
              <p className="text-xs font-black text-blue-900 tracking-wider font-mono">ASPV-2024-PLATINUM</p>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {role === Role.CLIENT && <ClientView key="client" />}
          {role === Role.OPERATOR && <OperatorView key="operator" />}
          {role === Role.ADJUSTER && <AdjusterView key="adjuster" />}
          {role === Role.ADMIN && <AdminView key="admin" />}
        </AnimatePresence>

        {/* PWA Install Banner */}
        <AnimatePresence>
            {showInstallButton && (
                <motion.div 
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-24 left-4 right-4 z-[70] md:max-w-xs md:left-auto md:right-10"
                >
                    <div className="bg-blue-900 border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-white p-2 rounded-lg">
                                <Car className="w-5 h-5 text-blue-900" />
                            </div>
                            <div>
                                <p className="text-[10px] text-white/60 font-black uppercase tracking-widest">Instalar App</p>
                                <p className="text-xs font-bold text-white">ASPV en tu inicio</p>
                            </div>
                        </div>
                        <button 
                            onClick={handleInstallClick}
                            className="bg-white text-blue-900 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-100"
                        >
                            Instalar
                        </button>
                        <button onClick={() => setShowInstallButton(false)} className="text-white/40 hover:text-white">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="h-20 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between px-10 gap-2 py-4 sm:py-0">
        <p className="text-[9px] text-slate-400 font-black tracking-widest uppercase text-center">ASPV Protección Vial S.A. de C.V. &copy; 2024</p>
        <div className="flex gap-6 items-center">
          <span className="flex items-center gap-2 text-[9px] text-blue-900 font-black tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-900 animate-pulse" />
            CONEXIÓN ESTABLE
          </span>
          <span className="text-[9px] text-slate-300 font-mono italic">v. 1.0.4-LITE</span>
        </div>
      </footer>

    </div>
  );
}
