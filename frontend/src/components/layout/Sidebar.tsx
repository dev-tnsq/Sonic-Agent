import React from 'react';
import { Layout, Activity, Shield, LineChart } from 'lucide-react';

const menuItems = [
  { icon: Layout, label: 'Dashboard', href: '/' },
  { icon: Shield, label: 'Security', href: '/security' },
  { icon: Activity, label: 'Monitoring', href: '/monitoring' },
  { icon: LineChart, label: 'Trading', href: '/trading' },
];

export function Sidebar() {
  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-[#111] border-r border-[#222] p-4">
      <div className="flex items-center gap-2 mb-8 p-2">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg" />
        <h1 className="text-xl font-bold">Sonic Dream AI</h1>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#222] transition-colors"
          >
            <item.icon className="w-5 h-5 text-gray-400" />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}
