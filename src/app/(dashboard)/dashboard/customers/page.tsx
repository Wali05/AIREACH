'use client';

import { useState, useEffect } from 'react';
import { Search, ChevronDown, Filter, Download, Plus, ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  webinarAttended: string;
  date: string;
  status: string;
  tags: string[];
  source: string;
  conversion?: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/leads');
        
        if (!response.ok) {
          throw new Error('Failed to fetch customers');
        }
        
        const data = await response.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const enhancedData = data.map((lead: any) => ({
          id: lead.id,
          name: lead.name || lead.email,
          email: lead.email,
          webinarAttended: lead.webinar?.title || 'Unknown',
          date: new Date(lead.createdAt).toLocaleDateString(),
          status: 'New',
          tags: ['Webinar Attendee', 'New Lead', 'Follow Up'].slice(0, Math.floor(Math.random() * 3) + 1),
          source: 'Webinar',
        }));
        
        setCustomers(enhancedData);
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCustomers();
  }, []);
  
  // Filter customers based on search query and filter
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.status.toLowerCase().includes(searchQuery.toLowerCase());
      
    if (filter === 'all') {
      return matchesSearch;
    } else {
      return matchesSearch && customer.status.toLowerCase() === filter.toLowerCase();
    }
  });
  
  const handleExportCSV = () => {
    // In a real app, this would create a CSV file with customer data
    console.log('Exporting customer data to CSV...');
  };

  return (
    <div className="p-6 bg-[#111014] text-white min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Leads</h1>
          <p className="text-gray-400">Manage and track your webinar leads</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline"
            className="border-gray-700 bg-[#18171c] hover:bg-[#23222a] text-white"
            onClick={handleExportCSV}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          
          <Button className="bg-violet-600 hover:bg-violet-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>
      
      {/* Filters and search */}
      <div className="bg-[#18171c] rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              className="w-full bg-[#23222a] border-none pl-10 text-white placeholder:text-gray-500"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3 items-center self-end">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-400">Status:</span>
              <div className="relative">
                <select 
                  className="appearance-none bg-[#23222a] border-none rounded px-3 py-2 pr-8 text-sm text-white cursor-pointer"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="new">New</option>
                  <option value="qualified">Qualified</option>
                  <option value="unqualified">Unqualified</option>
                  <option value="converted">Converted</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Customers table */}
      <Card className="bg-[#18171c] border-none overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#23222a]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  <div className="flex items-center gap-1 cursor-pointer">
                    Name <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  <div className="flex items-center gap-1 cursor-pointer">
                    Email <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  <div className="flex items-center gap-1 cursor-pointer">
                    Webinar <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  <div className="flex items-center gap-1 cursor-pointer">
                    Date <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  <div className="flex items-center gap-1 cursor-pointer">
                    Status <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Tags
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  <div className="flex items-center gap-1 cursor-pointer">
                    Source <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-3 text-center">Loading leads...</td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-3 text-center">No leads found</td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr 
                    key={customer.id}
                    className="border-b border-[#23222a] hover:bg-[#23222a] transition-colors"
                  >
                    <td className="px-4 py-4">
                      <div className="font-medium">{customer.name}</div>
                    </td>
                    <td className="px-4 py-4 text-gray-300">{customer.email}</td>
                    <td className="px-4 py-4 text-gray-300">{customer.webinarAttended}</td>
                    <td className="px-4 py-4 text-gray-300">
                      {new Date(customer.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      <span 
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          customer.status === 'New' ? 'bg-blue-900/30 text-blue-400' : 
                          customer.status === 'Qualified' ? 'bg-green-900/30 text-green-400' :
                          customer.status === 'Unqualified' ? 'bg-red-900/30 text-red-400' :
                          'bg-purple-900/30 text-purple-400'
                        }`}
                      >
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-1 flex-wrap">
                        {customer.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#23222a] text-gray-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-300">
                      {customer.source}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Button 
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}