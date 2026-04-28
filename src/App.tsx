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
  CreditCard,
  ShieldCheck,
  TrendingUp,
  Truck
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

const MOCK_SERVICES: Service[] = [
  { id: 'SRV-001', type: 'Grúa', location: 'Tlalnepantla de Baz, EdoMex', status: 'Completado', time: '10:30 AM', user: 'Roberto G.', operator: 'Juan M.', amount: '$1,200' },
  { id: 'SRV-002', type: 'Cambio de Llanta', location: 'Polanco, CDMX', status: 'En Camino', time: '11:15 AM', user: 'Elena V.', operator: 'Carlos R.', amount: '$450' },
  { id: 'SRV-003', type: 'Paso de Corriente', location: 'Condesa, CDMX', status: 'Pendiente', time: '11:45 AM', user: 'Marcos P.', amount: '$300' },
  { id: 'SRV-004', type: 'Grúa', location: 'Santa Fe, CDMX', status: 'Pendiente', time: '12:05 PM', user: 'Sofía L.', amount: '$1,500' },
  { id: 'SRV-005', type: 'Asistencia Médica', location: 'Coyoacán, CDMX', status: 'Completado', time: '09:15 AM', user: 'David T.', operator: 'Sonia B.', amount: '$850' },
];

// --- Sub-components ---

const Badge = ({ status }: { status: ServiceStatus }) => {
  const styles = {
    'Completado': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    'En Camino': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    'Pendiente': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${styles[status]}`}>
      {status}
    </span>
  );
};

// --- View Components ---

const ClientView = () => {
  const [isRequesting, setIsRequesting] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="grid grid-cols-1 md:grid-cols-12 gap-8"
    >
      <div className="md:col-span-12 lg:col-span-5 flex flex-col gap-8">
        <div className="bg-[#0f0f0f] border border-white/5 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-indigo-600/5 blur-3xl" />
          <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-8 relative z-10">Servicio Inmediato</p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsRequesting(!isRequesting)}
            className="relative group z-10"
          >
            <div className="absolute inset-0 bg-indigo-600 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity animate-pulse" />
            <div className="relative w-52 h-52 rounded-full bg-indigo-600 flex flex-col items-center justify-center text-white font-bold p-8 shadow-[0_0_50px_rgba(79,70,229,0.4)] border border-white/20">
              <span className="text-xl leading-tight">
                {isRequesting ? 'SOLICITANDO...' : 'SOLICITAR ASISTENCIA'}
              </span>
            </div>
          </motion.button>
          
          <p className="mt-8 text-slate-500 text-sm font-medium relative z-10">Pulsa para asistencia VIP</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Grúa', icon: Truck, color: 'text-indigo-400' },
            { label: 'Llanta', icon: Wrench, color: 'text-indigo-400' },
            { label: 'Corriente', icon: Battery, color: 'text-indigo-400' },
          ].map((opt) => (
            <button 
              key={opt.label}
              className="p-5 rounded-[1.5rem] bg-[#0f0f0f] border border-white/5 hover:border-white/20 transition-all flex flex-col items-center gap-3 text-center group"
            >
              <div className={`p-3 rounded-xl bg-white/5 group-hover:bg-white/10 ${opt.color} transition-colors`}>
                <opt.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-tight text-slate-400 group-hover:text-white">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="md:col-span-12 lg:col-span-7 flex flex-col gap-6">
        <div className="flex-1 bg-[#0f0f0f] border border-white/5 rounded-[2rem] p-8 overflow-hidden relative shadow-2xl min-h-[400px]">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          
          <div className="relative z-10 h-full flex flex-col">
            <h3 className="text-sm font-semibold text-white mb-6 flex items-center justify-between uppercase tracking-wider">
              Ubicación Actual
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
            </h3>
            
            <div className="flex-1 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center relative min-h-[250px]">
                <div className="relative">
                    <div className="w-12 h-12 bg-indigo-500/20 rounded-full border border-indigo-500/50 flex items-center justify-center animate-ping absolute" />
                    <MapPin className="w-8 h-8 text-indigo-500 relative z-10" />
                </div>
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                   <span className="text-[10px] font-mono text-slate-400">19.5429° N, 99.1944° W</span>
                </div>
            </div>

            <div className="mt-6 flex items-start gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-lg">
                <Navigation className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-tighter mb-1">Destino sugerido</p>
                <p className="text-sm font-medium text-slate-200">Calz. de los Jinetes, Tlalnepantla de Baz, Edo. Méx.</p>
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
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-semibold text-white tracking-tight">Servicios Disponibles</h2>
        <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest">3 en espera</span>
      </div>

      <AnimatePresence mode="wait">
        {!activeJob ? (
          <div className="space-y-4">
            {MOCK_SERVICES.filter(s => s.status === 'Pendiente').map((job) => (
              <motion.div 
                key={job.id}
                layout
                className="p-6 rounded-[2rem] bg-[#0f0f0f] border border-white/5 flex items-center justify-between hover:border-white/10 transition-colors shadow-lg"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">{job.id}</span>
                    <h3 className="font-semibold text-slate-200">{job.type}</h3>
                  </div>
                  <div className="flex items-center text-slate-400 text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-indigo-500" />
                    {job.location}
                  </div>
                </div>
                <button 
                  onClick={() => setActiveJob(job)}
                  className="px-8 py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-500 transition-all shadow-lg active:scale-95"
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
            className="space-y-6"
          >
            <div className="p-6 rounded-[1.5rem] bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-indigo-500 rounded-full p-2">
                    <Navigation className="w-4 h-4 text-white animate-pulse" />
                </div>
                <span className="font-bold text-sm tracking-tight uppercase">Ruta en curso hacia el cliente</span>
              </div>
              <span className="text-xs font-black bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/20">ETA: 12 MIN</span>
            </div>

            <div className="bg-[#0f0f0f] border border-white/5 rounded-[2rem] p-8 space-y-8 shadow-2xl">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black">Cliente VIP</p>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
                      <User className="w-7 h-7 text-indigo-400" />
                    </div>
                    <div>
                        <span className="text-white font-semibold text-xl block">{activeJob.user}</span>
                        <span className="text-[10px] text-slate-500 lowercase font-mono">id: {activeJob.id}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 text-right">
                  <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black">Ganancia Estimada</p>
                  <p className="text-3xl font-light text-emerald-500">{activeJob.amount}</p>
                </div>
              </div>

              <div className="space-y-6 pt-8 border-t border-white/5">
                <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black">Protocolo de Evidencia</p>
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="aspect-video bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-slate-600 transition-colors hover:bg-white/10">
                      <Camera className="w-8 h-8 opacity-40 hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                  <button className="aspect-video bg-indigo-600/5 hover:bg-indigo-600/10 border-2 border-dashed border-indigo-500/20 rounded-2xl flex flex-col items-center justify-center text-indigo-400/60 transition-all hover:text-indigo-400 group">
                    <Upload className="w-6 h-6 mb-2 group-hover:-translate-y-1 transition-transform" />
                    <span className="text-[10px] uppercase font-black tracking-widest">Adjuntar</span>
                  </button>
                </div>
              </div>

              <button 
                onClick={() => setActiveJob(null)}
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-[0_0_40px_rgba(79,70,229,0.2)]"
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
      className="space-y-8"
    >
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Servicios Hoy', value: '142', icon: FileText, trend: '+12%', color: 'text-indigo-400' },
          { label: 'Unidades Activas', value: '48', icon: Truck, trend: '85%', color: 'text-emerald-500' },
          { label: 'Tiempo Promedio', value: '14m', icon: Clock, trend: '-2m', color: 'text-amber-500' },
        ].map((kpi) => (
          <div key={kpi.label} className="p-6 rounded-2xl bg-[#0f0f0f] border border-white/5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className={`p-2.5 rounded-xl bg-white/5 ${kpi.color}`}>
                <kpi.icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${kpi.trend.startsWith('+') ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : 'text-slate-500 border-white/5 bg-white/5'}`}>
                {kpi.trend}
              </span>
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{kpi.label}</p>
              <h3 className="text-4xl font-light text-white mt-1">{kpi.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#0f0f0f] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <h3 className="font-bold text-sm text-white uppercase tracking-widest">Servicios Recientes</h3>
          <button className="text-xs text-slate-500 hover:text-white transition-colors flex items-center font-bold tracking-tighter">
            VER REPORTE COMPLETO <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 text-[10px] uppercase font-bold tracking-[0.2em] border-b border-white/5">
                <th className="px-8 py-5">Folio / Tipo</th>
                <th className="px-8 py-5">Ubicación</th>
                <th className="px-8 py-5">Estatus</th>
                <th className="px-8 py-5">Monto</th>
                <th className="px-8 py-5">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {MOCK_SERVICES.map((s) => (
                <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-5">
                    <div className="font-bold text-slate-200">{s.type}</div>
                    <div className="text-[10px] font-mono text-slate-500 opacity-60">#{s.id.split('-')[1]}</div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="text-sm text-slate-400 max-w-[200px] truncate">{s.location}</div>
                  </td>
                  <td className="px-8 py-5">
                    <Badge status={s.status} />
                  </td>
                  <td className="px-8 py-5 font-bold text-white tracking-tight">{s.amount || '---'}</td>
                  <td className="px-8 py-5 text-xs text-slate-500 font-medium">{s.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mini Performance Chart Sim */}
      <div className="p-8 bg-[#0f0f0f] border border-white/10 rounded-[2rem] shadow-2xl">
        <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Flujo de Operación</h3>
            <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Normal</span>
            </div>
        </div>
        <div className="flex items-end space-x-3 h-32">
            {[40, 60, 45, 80, 50, 90, 70, 85, 95, 60].map((h, i) => (
                <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    className="flex-1 bg-indigo-600/10 border-t border-indigo-500/40 rounded-t-lg transition-colors hover:bg-indigo-600/30"
                />
            ))}
        </div>
        <div className="flex justify-between mt-4">
            {['10:00', '11:00', '12:00', '13:00', '14:00'].map(t => (
                <span key={t} className="text-[9px] font-mono text-slate-600 font-bold">{t}</span>
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
    { id: Role.ADMIN, label: 'Administrador', icon: LayoutDashboard },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-indigo-500/30 flex flex-col">
      
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-10 z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.3)]">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-semibold tracking-tight text-white uppercase">
            ELITE <span className="font-light opacity-60">ASSIST</span>
          </span>
        </div>

        {/* Desktop Role Toggle */}
        <nav className="hidden md:flex bg-white/5 p-1 rounded-xl border border-white/10">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setRole(item.id)}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                role === item.id 
                ? 'bg-white/10 text-white shadow-lg' 
                : 'text-slate-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <div className="hidden sm:block text-right">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Soporte Premium</p>
            <p className="text-sm font-medium text-white">800-ASSIST-VIP</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
            <User className="w-5 h-5 text-indigo-400" />
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="md:hidden p-2 text-slate-400 hover:text-white"
          >
            {isSidebarOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed inset-0 bg-[#050505] z-40 md:hidden pt-28 px-8"
          >
            <div className="space-y-4">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleRole(item.id)}
                  className={`w-full flex items-center space-x-4 p-5 rounded-2xl transition-all ${
                    role === item.id ? 'bg-indigo-600 text-white border border-indigo-500/20 shadow-xl' : 'text-slate-500 bg-white/5 border border-transparent'
                  }`}
                >
                  <item.icon className="w-6 h-6" />
                  <span className="text-xl font-bold">{item.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 pt-32 pb-20 px-8 max-w-7xl mx-auto w-full">
        <header className="mb-12 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">
                    Sector {role.toUpperCase()}
                </p>
            </div>
            <h2 className="text-5xl font-black text-white tracking-widest uppercase">
              {role === Role.CLIENT && "Harold"}
              {role === Role.OPERATOR && "Operativo"}
              {role === Role.ADMIN && "Directiva"}
            </h2>
          </div>
          
          <div className="hidden lg:flex items-center gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-[2rem]">
            <div className="w-1.5 h-12 bg-indigo-600 rounded-full" />
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Nivel de Acceso</p>
              <p className="text-sm font-black text-white tracking-wider">PLATINUM ELITE MBR</p>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {role === Role.CLIENT && <ClientView key="client" />}
          {role === Role.OPERATOR && <OperatorView key="operator" />}
          {role === Role.ADMIN && <AdminView key="admin" />}
        </AnimatePresence>
      </main>

      {/* Footer Branding */}
      <footer className="h-16 border-t border-white/5 bg-[#050505] flex items-center justify-between px-10">
        <p className="text-[10px] text-slate-600 font-bold tracking-widest uppercase italic">Elite Protección Vial S.A. de C.V. &copy; 2026</p>
        <div className="flex gap-6 items-center">
          <span className="flex items-center gap-2 text-[10px] text-emerald-500 font-black tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            EN LÍNEA
          </span>
          <span className="text-[10px] text-slate-600 font-mono underline decoration-slate-800 underline-offset-4">V. 2.4.0-STABLE</span>
        </div>
      </footer>

    </div>
  );
}
