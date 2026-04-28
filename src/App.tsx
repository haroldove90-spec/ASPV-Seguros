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
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types & Constants ---

enum Role {
  CLIENT = 'cliente',
  OPERATOR = 'operador',
  ADMIN = 'admin'
}

type ServiceStatus = 'Completado' | 'En Camino' | 'Pendiente';

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
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handlePanic = () => {
    setIsRequesting(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setToastMessage(`Alerta enviada. Ubicación actual recibida (Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}). Un gestor te contactará en breve.`);
          setIsRequesting(false);
        },
        () => {
          setToastMessage("No se pudo obtener la ubicación. Alerta enviada con ubicación predeterminada.");
          setIsRequesting(false);
        }
      );
    } else {
      setToastMessage("Geolocalización no soportada. Alerta enviada.");
      setIsRequesting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="grid grid-cols-1 md:grid-cols-12 gap-6"
    >
        <AnimatePresence>
            {toastMessage && <CustomToast message={toastMessage} onClose={() => setToastMessage(null)} />}
        </AnimatePresence>

      <div className="md:col-span-12 lg:col-span-5 flex flex-col gap-6">
        <div className="bg-white border border-slate-200 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-sm">
          <div className="absolute inset-0 bg-red-500/[0.02] pointer-events-none" />
          <p className="text-red-600 text-[10px] font-black uppercase tracking-[0.2em] mb-8 relative z-10">Central de Emergencias</p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePanic}
            disabled={isRequesting}
            className="relative group z-10"
          >
            <div className="absolute inset-0 bg-red-600 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity animate-pulse" />
            <div className="relative w-48 h-48 rounded-full bg-red-600 flex flex-col items-center justify-center text-white font-bold p-6 shadow-[0_20px_50px_rgba(220,38,38,0.3)] border-4 border-white">
              <span className="text-lg leading-tight uppercase tracking-widest font-black">
                {isRequesting ? 'ENVIANDO...' : 'SOLICITAR ASISTENCIA'}
              </span>
            </div>
          </motion.button>
          
          <p className="mt-8 text-slate-400 text-[10px] font-bold uppercase tracking-widest relative z-10">Atención 24/7 Garantizada</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Grúa', icon: Truck, color: 'text-blue-900' },
            { label: 'Llanta', icon: Wrench, color: 'text-blue-900' },
            { label: 'Corriente', icon: Battery, color: 'text-blue-900' },
          ].map((opt) => (
            <button 
              key={opt.label}
              className="p-4 rounded-[1.5rem] bg-white border border-slate-100 hover:border-blue-900/20 transition-all flex flex-col items-center gap-2 text-center group shadow-sm"
            >
              <div className={`p-3 rounded-xl bg-slate-50 group-hover:bg-blue-50 ${opt.color} transition-colors`}>
                <opt.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-tight text-slate-500 group-hover:text-blue-900">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="md:col-span-12 lg:col-span-7 flex flex-col gap-6">
        <div className="flex-1 bg-white border border-slate-200 rounded-[2rem] p-6 lg:p-8 overflow-hidden relative shadow-sm min-h-[350px]">
          <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
          
          <div className="relative z-10 h-full flex flex-col">
            <h3 className="text-xs font-black text-slate-900 mb-6 flex items-center justify-between uppercase tracking-[0.2em]">
              Tu Ubicación
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
            </h3>
            
            <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center relative min-h-[200px]">
                <div className="relative">
                    <div className="w-10 h-10 bg-blue-600/10 rounded-full border border-blue-600/30 flex items-center justify-center animate-ping absolute" />
                    <MapPin className="w-6 h-6 text-blue-900 relative z-10" />
                </div>
            </div>

            <div className="mt-6 flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <Navigation className="w-4 h-4 text-blue-900 mt-1 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Dirección Detectada</p>
                <p className="text-xs font-bold text-slate-800">Calz. de los Jinetes, Tlalnepantla de Baz, Edo. Méx.</p>
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

const AdminView = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Servicios de Hoy', value: '142', icon: FileText, color: 'text-blue-900' },
          { label: 'Unidades Activas', value: '48', icon: Truck, color: 'text-blue-900' },
          { label: 'Tiempo Promedio', value: '14m', icon: Clock, color: 'text-blue-900' },
        ].map((kpi) => (
          <div key={kpi.label} className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-sm">
            <div className={`w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center ${kpi.color} mb-2`}>
              <kpi.icon className="w-4 h-4" />
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.15em]">{kpi.label}</p>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{kpi.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between px-6 sm:px-8">
          <h3 className="font-black text-xs text-blue-900 uppercase tracking-widest">Actividad Reciente</h3>
          <button className="text-[10px] text-slate-400 hover:text-blue-900 transition-all font-black uppercase tracking-tighter flex items-center">
            Reporte Ejecutivo <ChevronRight className="w-3 h-3 ml-1" />
          </button>
        </div>
        
        <div className="overflow-x-auto">
            {/* Desktop Table View */}
            <table className="hidden md:table w-full text-left">
                <thead>
                <tr className="text-slate-400 text-[9px] uppercase font-black tracking-widest border-b border-slate-50">
                    <th className="px-8 py-4">Folio / Tipo</th>
                    <th className="px-8 py-4">Ubicación</th>
                    <th className="px-8 py-4">Estatus</th>
                    <th className="px-8 py-4">Fecha/Hora</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                {MOCK_SERVICES.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-5">
                            <div className="font-bold text-slate-900 text-sm">{s.type}</div>
                            <div className="text-[9px] font-mono text-slate-400 opacity-60">#{s.id.split('-')[1]}</div>
                        </td>
                        <td className="px-8 py-5">
                            <div className="text-xs text-slate-600 max-w-[220px] truncate">{s.location}</div>
                        </td>
                        <td className="px-8 py-5">
                            <Badge status={s.status} />
                        </td>
                        <td className="px-8 py-5 text-[10px] text-slate-500 font-bold">{s.time}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Mobile Cards View */}
            <div className="md:hidden divide-y divide-slate-100">
                {MOCK_SERVICES.map((s) => (
                    <div key={s.id} className="p-4 flex items-center justify-between gap-4">
                        <div className="space-y-1">
                            <p className="text-xs font-black text-slate-900">{s.type}</p>
                            <p className="text-[10px] text-slate-500 truncate max-w-[150px]">{s.location}</p>
                        </div>
                        <Badge status={s.status} />
                    </div>
                ))}
            </div>
        </div>
      </div>

      <div className="p-6 bg-blue-900 rounded-[2rem] shadow-lg text-white">
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-[11px] font-black uppercase tracking-widest italic opacity-80">Performance Red Operativa</h3>
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
                <span className="text-[9px] font-black uppercase">Sin Incidencias</span>
            </div>
        </div>
        <div className="flex items-end space-x-2 h-24">
            {[30, 50, 40, 70, 45, 80, 60, 75, 85, 55].map((h, i) => (
                <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    className="flex-1 bg-white/20 border-t border-white/40 rounded-t hover:bg-white/40 transition-colors"
                />
            ))}
        </div>
      </div>
    </motion.div>
  );
};

// --- Main Application ---

export default function App() {
  const [role, setRole] = useState<Role>(Role.CLIENT);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleRole = (r: Role) => {
    setRole(r);
    setIsSidebarOpen(false);
  };

  const menuItems = [
    { id: Role.CLIENT, label: 'Cliente', icon: User },
    { id: Role.OPERATOR, label: 'Operador', icon: Truck },
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
          {role === Role.ADMIN && <AdminView key="admin" />}
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
