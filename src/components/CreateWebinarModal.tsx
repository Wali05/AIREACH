import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ChevronRight, CheckCircle, Calendar, Clock, Info } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, parse } from 'date-fns';
import { prisma } from '@/lib/db';

const basicInfoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  topic: z.string().min(1, 'Topic is required'),
  hostName: z.string().optional()
});
const scheduleSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  minutes: z.string().min(1, 'Minutes are required'),
  duration: z.string().min(1, 'Duration is required')
});
type BasicInfoFormData = z.infer<typeof basicInfoSchema>;
type ScheduleFormData = z.infer<typeof scheduleSchema>;

const steps = [
  { id: 'basic-info', label: 'Basic Info' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'ai-agent', label: 'AI Agent' },
  { id: 'review', label: 'Review' }
];

const agents = [
  { id: '1', name: 'Webinar Host', description: 'Professionally hosts your webinar and guides attendees' },
  { id: '2', name: 'Lead Qualifier', description: 'Focuses on qualifying leads during and after the webinar' },
  { id: '3', name: 'Support Agent', description: 'Answers questions and provides technical support' }
];

export function CreateWebinarModal({ open, onOpenChange, onCreated }: { open: boolean, onOpenChange: (open: boolean) => void, onCreated?: (webinar: any) => void }) {
  const [currentStep, setCurrentStep] = React.useState(0);  const [formData, setFormData] = React.useState({
    basicInfo: { title: '', description: '', topic: '', hostName: '' },
    schedule: { date: '', time: '', minutes: '00', duration: '60' },
    aiAgent: null as string | null,
  });
  const [selectedAgent, setSelectedAgent] = React.useState<string | null>(null);
  const [webinarLink, setWebinarLink] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const basicInfoForm = useForm<BasicInfoFormData>({ resolver: zodResolver(basicInfoSchema), defaultValues: formData.basicInfo });
  const scheduleForm = useForm<ScheduleFormData>({ resolver: zodResolver(scheduleSchema), defaultValues: formData.schedule });
  React.useEffect(() => {
    if (!open) {
      setCurrentStep(0);
      setFormData({ basicInfo: { title: '', description: '', topic: '', hostName: '' }, schedule: { date: '', time: '', minutes: '00', duration: '60' }, aiAgent: null });
      setSelectedAgent(null);
      setWebinarLink('');
    }
  }, [open]);

  const handleNext = async () => {
    if (currentStep === 0) {
      const valid = await basicInfoForm.trigger();
      if (!valid) return;
      setFormData(prev => ({ ...prev, basicInfo: basicInfoForm.getValues() }));
    } else if (currentStep === 1) {
      const valid = await scheduleForm.trigger();
      if (!valid) return;
      setFormData(prev => ({ ...prev, schedule: scheduleForm.getValues() }));
      const baseUrl = window.location.origin;
      setWebinarLink(`${baseUrl}/webinar/${Math.random().toString(36).substring(2, 8)}`);
    } else if (currentStep === 2) {
      if (!selectedAgent) return;
      setFormData(prev => ({ ...prev, aiAgent: selectedAgent }));
    }
    setCurrentStep(prev => prev + 1);
  };
  const handleBack = () => setCurrentStep(prev => prev - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { date, time, duration } = formData.schedule;
      // Construct ISO string from date and time picker
      const scheduledAt = new Date(`${date}T${time}`).toISOString();      const response = await fetch('/api/webinars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.basicInfo.title,
          description: formData.basicInfo.description,
          scheduledAt,
          duration: parseInt(duration),
          hostName: formData.basicInfo.hostName || undefined
        })
      });
      if (!response.ok) throw new Error('Failed to create webinar');
      const result = await response.json();
      // Generate real webinar link using returned ID
      const link = `${window.location.origin}/webinar/${result.id}`;
      alert(`Webinar created! Access it at ${link}`);
      if (onCreated) onCreated(result);
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating webinar:', error);
      alert('Failed to create webinar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl glassy-modal p-0 border-none">
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold tracking-widest bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">Create Webinar</DialogTitle>
        </DialogHeader>
        <div className="px-8 py-6">
          {/* Progress steps */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`relative flex items-center justify-center w-8 h-8 rounded-full shadow-lg ${index < currentStep ? 'bg-gradient-to-r from-purple-500 to-cyan-400 text-white' : index === currentStep ? 'bg-gradient-to-r from-purple-500 to-cyan-400 text-white' : 'bg-[#23222a] text-gray-400'}`}>{index < currentStep ? (<CheckCircle className="w-5 h-5" />) : (<span>{index + 1}</span>)}</div>
                <div className="ml-2 flex flex-col"><span className={`text-sm font-medium ${index <= currentStep ? 'text-white' : 'text-gray-400'}`}>{step.label}</span></div>
                {index < steps.length - 1 && (<div className={`mx-3 h-0.5 w-10 ${index < currentStep ? 'bg-gradient-to-r from-purple-500 to-cyan-400' : 'bg-gray-700'}`} />)}
              </div>
            ))}
          </div>

          {/* Step content */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  className="glassy-input"
                  placeholder="Enter the title of your webinar"
                  {...basicInfoForm.register('title')}
                />
                {basicInfoForm.formState.errors.title && (<p className="text-red-400 mt-1 text-sm">{basicInfoForm.formState.errors.title.message}</p>)}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  className="glassy-input w-full h-32 p-4"
                  placeholder="Describe what your webinar is about"
                  {...basicInfoForm.register('description')}
                />
                {basicInfoForm.formState.errors.description && (<p className="text-red-400 mt-1 text-sm">{basicInfoForm.formState.errors.description.message}</p>)}
              </div>              <div>
                <label className="block text-sm font-medium mb-2">Topic</label>
                <Input
                  className="glassy-input"
                  placeholder="Enter the main topic"
                  {...basicInfoForm.register('topic')}
                />
                {basicInfoForm.formState.errors.topic && (<p className="text-red-400 mt-1 text-sm">{basicInfoForm.formState.errors.topic.message}</p>)}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Host Name</label>
                <Input
                  className="glassy-input"
                  placeholder="Enter the name of the webinar host"
                  {...basicInfoForm.register('hostName')}
                />
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-cyan-400" />
                    <Input
                      type="date"
                      className="glassy-input pl-9"
                      {...scheduleForm.register('date')}
                    />
                  </div>
                  {scheduleForm.formState.errors.date && (<p className="text-red-400 mt-1 text-sm">{scheduleForm.formState.errors.date.message}</p>)}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Time</label>
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <Clock className="absolute left-3 top-2.5 h-4 w-4 text-cyan-400" />
                      <Input
                        type="time"
                        className="glassy-input pl-9"
                        {...scheduleForm.register('time')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Minutes</label>
                      <select 
                        className="glassy-input w-20"
                        {...scheduleForm.register('minutes')}
                      >
                        <option value="00">:00</option>
                        <option value="05">:05</option>
                        <option value="10">:10</option>
                        <option value="15">:15</option>
                        <option value="20">:20</option>
                        <option value="25">:25</option>
                        <option value="30">:30</option>
                        <option value="35">:35</option>
                        <option value="40">:40</option>
                        <option value="45">:45</option>
                        <option value="50">:50</option>
                        <option value="55">:55</option>
                      </select>
                    </div>
                  </div>
                  {scheduleForm.formState.errors.time && (<p className="text-red-400 mt-1 text-sm">{scheduleForm.formState.errors.time.message}</p>)}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
                <select 
                  className="glassy-input w-full"
                  {...scheduleForm.register('duration')}
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="90">90 minutes</option>
                  <option value="120">120 minutes</option>
                </select>
                {scheduleForm.formState.errors.duration && (<p className="text-red-400 mt-1 text-sm">{scheduleForm.formState.errors.duration.message}</p>)}
              </div>
              <Card className="glassy-card p-4 mb-2">
                <div className="flex items-center space-x-3">
                  <Info className="text-cyan-400 h-4 w-4" />
                  <p className="text-sm text-gray-300">All times are shown in your local timezone.</p>
                </div>
              </Card>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Select an AI Agent</h3>
              <p className="text-sm text-gray-300 mb-4">Choose an AI agent to assist during your webinar</p>
              {agents.map((agent) => (
                <Card 
                  key={agent.id}
                  className={`glassy-card p-4 cursor-pointer border transition-all ${selectedAgent === agent.id ? 'border-cyan-500 shadow-glow' : 'border-transparent hover:border-gray-500'}`}
                  onClick={() => setSelectedAgent(agent.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{agent.name}</h4>
                      <p className="text-sm text-gray-300">{agent.description}</p>
                    </div>
                    {selectedAgent === agent.id && <CheckCircle className="text-cyan-400 h-5 w-5" />}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium mb-4">Webinar Summary</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <Card className="glassy-card p-4">
                  <h4 className="text-sm text-gray-400 mb-1">Title</h4>
                  <p className="text-white">{formData.basicInfo.title}</p>
                </Card>
                <Card className="glassy-card p-4">
                  <h4 className="text-sm text-gray-400 mb-1">Topic</h4>
                  <p className="text-white">{formData.basicInfo.topic}</p>
                </Card>
              </div>
                <Card className="glassy-card p-4">
                <h4 className="text-sm text-gray-400 mb-1">Description</h4>
                <p className="text-sm text-white">{formData.basicInfo.description}</p>
              </Card>
              
              {formData.basicInfo.hostName && (
                <Card className="glassy-card p-4">
                  <h4 className="text-sm text-gray-400 mb-1">Host Name</h4>
                  <p className="text-sm text-white">{formData.basicInfo.hostName}</p>
                </Card>
              )}
              
              <div className="grid grid-cols-3 gap-4">
                <Card className="glassy-card p-4">
                  <h4 className="text-sm text-gray-400 mb-1">Date</h4>
                  <p className="text-white">{formData.schedule.date}</p>
                </Card>
                <Card className="glassy-card p-4">
                  <h4 className="text-sm text-gray-400 mb-1">Time</h4>
                  <p className="text-white">{formData.schedule.time}:{formData.schedule.minutes || '00'}</p>
                </Card>
                <Card className="glassy-card p-4">
                  <h4 className="text-sm text-gray-400 mb-1">Duration</h4>
                  <p className="text-white">{formData.schedule.duration} minutes</p>
                </Card>
              </div>
              
              <Card className="glassy-card p-4">
                <h4 className="text-sm text-gray-400 mb-1">AI Agent</h4>
                <p className="text-white">{agents.find(a => a.id === selectedAgent)?.name || 'None selected'}</p>
              </Card>
              
              <Card className="glassy-card p-4">
                <h4 className="text-sm text-gray-400 mb-1">Webinar Link</h4>
                <div className="bg-[#1a1920] p-2 rounded flex items-center justify-between">
                  <p className="text-sm text-white truncate">{webinarLink}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs border-cyan-800 text-cyan-400 hover:bg-cyan-900/20"
                    onClick={() => navigator.clipboard.writeText(webinarLink)}
                  >
                    Copy
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-6">
            <Button variant="outline" className="border-cyan-400 bg-transparent text-white hover:bg-gray-800" onClick={handleBack} disabled={currentStep === 0}>Back</Button>
            {currentStep < steps.length - 1 ? (<Button className="bg-gradient-to-r from-purple-500 to-cyan-400 text-white shadow-lg" onClick={handleNext}>Continue <ChevronRight className="ml-2 h-4 w-4" /></Button>) : (<Button className="bg-gradient-to-r from-purple-500 to-cyan-400 text-white shadow-lg" onClick={handleSubmit} disabled={loading}>{loading ? 'Launching...' : 'Launch Webinar'}</Button>)}
          </div>
        </div>
        <DialogClose asChild>
          <button className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl">×</button>
        </DialogClose>
      </DialogContent>
      <style jsx>{`
        .glassy-modal { background: rgba(24, 23, 44, 0.95); backdrop-filter: blur(16px) saturate(180%); border-radius: 1.5rem; }
        .glassy-card { background: rgba(34, 33, 54, 0.85); box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37); border-radius: 1rem; }
        .glassy-input { background: rgba(35, 34, 42, 0.8); border: 1px solid rgba(79, 209, 197, 0.1); color: white; }
        .shadow-glow { box-shadow: 0 0 15px rgba(79, 209, 197, 0.5); }
      `}</style>
    </Dialog>
  );
}