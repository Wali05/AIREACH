"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  CreditCard, 
  DollarSign, 
  Calendar,
  CheckCircle,
  XCircle,
  ChevronRight,
  RefreshCcw,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

interface Transaction {
  id: string;
  webinarId: string;
  webinarTitle: string;
  userId: string;
  userName?: string;
  email?: string;
  amount: number;
  currency: string;
  status: "completed" | "pending" | "failed" | "refunded";
  createdAt: string;
  stripeSessionId?: string;
}

export default function PaymentsDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    end: new Date().toISOString().split('T')[0]
  });
  
  // Stats
  const [stats, setStats] = useState({
    totalRevenue: 0,
    transactionCount: 0,
    averageOrderValue: 0,
    successRate: 0
  });
  
  useEffect(() => {
    fetchTransactions();
  }, [dateRange]);
  
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        startDate: dateRange.start,
        endDate: dateRange.end
      }).toString();
      
      const response = await fetch(`/api/payments?${queryParams}`);
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }
      
      const data = await response.json();
      setTransactions(data);
      
      // Calculate stats
      const successfulTransactions = data.filter((t: Transaction) => t.status === "completed");
      const totalRevenue = successfulTransactions.reduce((sum: number, t: Transaction) => sum + t.amount, 0);
      const successRate = data.length > 0 ? (successfulTransactions.length / data.length) * 100 : 0;
      
      setStats({
        totalRevenue: totalRevenue / 100, // Convert from cents to dollars
        transactionCount: data.length,
        averageOrderValue: data.length > 0 ? (totalRevenue / successfulTransactions.length) / 100 : 0,
        successRate
      });
      
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Failed to load payment data");
    } finally {
      setLoading(false);
    }
  };
  
  const filteredTransactions = searchQuery 
    ? transactions.filter(t => 
        t.webinarTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.email && t.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.userName && t.userName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        t.stripeSessionId?.includes(searchQuery)
      )
    : transactions;
  
  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount / 100); // Convert from cents
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case "completed": return "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400";
      case "pending": return "text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400";
      case "failed": return "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400";
      case "refunded": return "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400";
      default: return "text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400";
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <section className="mb-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Payments Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            View and manage all your webinar transactions
          </p>
        </motion.div>
      </section>

      {/* Stats Grid */}
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-6 bg-white dark:bg-gray-800/50 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 backdrop-blur-sm"
          >
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  ${stats.totalRevenue.toFixed(2)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-emerald-500 to-green-600 h-10 w-10 rounded-md flex items-center justify-center text-white shadow-lg">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-6 bg-white dark:bg-gray-800/50 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 backdrop-blur-sm"
          >
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Transactions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.transactionCount}
                </p>
              </div>
              <div className="bg-gradient-to-br from-violet-500 to-indigo-600 h-10 w-10 rounded-md flex items-center justify-center text-white shadow-lg">
                <CreditCard className="h-5 w-5" />
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-6 bg-white dark:bg-gray-800/50 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 backdrop-blur-sm"
          >
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Order</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  ${stats.averageOrderValue.toFixed(2)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 h-10 w-10 rounded-md flex items-center justify-center text-white shadow-lg">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="p-6 bg-white dark:bg-gray-800/50 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 backdrop-blur-sm"
          >
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.successRate.toFixed(1)}%
                </p>
              </div>
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 h-10 w-10 rounded-md flex items-center justify-center text-white shadow-lg">
                <CheckCircle className="h-5 w-5" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Filters */}
      <section className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date
              </label>
              <Input 
                type="date" 
                id="startDate"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="max-w-[180px]"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Date
              </label>
              <Input 
                type="date" 
                id="endDate"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="max-w-[180px]"
              />
            </div>
          </div>
          
          <div className="flex gap-4 items-end">
            <div className="flex-1 sm:w-64">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Search Transactions
              </label>
              <Input
                type="text"
                id="search"
                placeholder="Search by name, email, webinar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => fetchTransactions()}
              className="flex items-center gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Transactions Table */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white dark:bg-gray-800/50 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 backdrop-blur-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Webinar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex justify-center mb-3">
                      <div className="w-6 h-6 border-2 border-t-indigo-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                    </div>
                    Loading transactions...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                    No transactions found for the selected criteria
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => (
                  <tr 
                    key={transaction.id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/25 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      <div className="font-mono text-xs text-gray-500 dark:text-gray-400">
                        {transaction.stripeSessionId?.substring(0, 14)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {transaction.webinarTitle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div>{transaction.userName || "Anonymous"}</div>
                      {transaction.email && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">{transaction.email}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(transaction.status)}`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {format(new Date(transaction.createdAt), "MMM d, yyyy")}
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {format(new Date(transaction.createdAt), "h:mm a")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.section>
    </div>
  );
}
