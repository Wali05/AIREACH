// filepath: src/app/(dashboard)/dashboard/sales/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { DataTable } from '@/components/ui/card';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';

interface SaleRecord {
  id: string;
  amount: number;
  currency: string;
  webinarTitle: string;
  date: string;
}

export default function SalesPage() {
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/sales');
        if (!res.ok) throw new Error('Failed to fetch sales');
        const data = await res.json();
        const mapped: SaleRecord[] = data.map((sale: any) => ({
          id: sale.id,
          amount: sale.amount,
          currency: sale.currency,
          webinarTitle: sale.webinar?.title || 'Unknown',
          date: new Date(sale.createdAt).toLocaleDateString(),
        }));
        setSales(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  return (
    <div className="p-6 bg-[#111014] text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sales</h1>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Refresh
        </Button>
      </div>
      <Card className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="px-4 py-2">Sale ID</th>
              <th className="px-4 py-2">
                <div className="flex items-center gap-1 cursor-pointer">
                  Amount <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th className="px-4 py-2">Currency</th>
              <th className="px-4 py-2">Webinar</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-center">
                  Loading sales...
                </td>
              </tr>
            ) : sales.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-center">
                  No sales found
                </td>
              </tr>
            ) : (
              sales.map((s) => (
                <tr key={s.id} className="border-b border-gray-800 hover:bg-gray-800">
                  <td className="px-4 py-3">{s.id}</td>
                  <td className="px-4 py-3">{s.amount}</td>
                  <td className="px-4 py-3 uppercase">{s.currency}</td>
                  <td className="px-4 py-3">{s.webinarTitle}</td>
                  <td className="px-4 py-3">{s.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
