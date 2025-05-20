"use client";

import { motion } from 'framer-motion';
import {
	ChevronRight,
	BarChart3,
	TrendingUp,
	Calendar,
	ArrowUpRight,
	Play,
	Clock,
	CalendarCheck,
	Bell,
	Users,
} from "lucide-react";

const stats = [
	{
		name: 'Total Webinars',
		value: '24',
		change: '+14%',
		increasing: true,
		icon: Calendar,
		color: 'from-violet-500 to-indigo-600',
	},
	{
		name: 'Total Attendees',
		value: '1,328',
		change: '+18%',
		increasing: true,
		icon: Users,
		color: 'from-cyan-500 to-blue-600',
	},
	{
		name: 'Conversion Rate',
		value: '24.3%',
		change: '+4.3%',
		increasing: true,
		icon: TrendingUp,
		color: 'from-emerald-500 to-green-600',
	},
	{
		name: 'Avg. Watch Time',
		value: '38m',
		change: '+12%',
		increasing: true,
		icon: Clock,
		color: 'from-rose-500 to-pink-600',
	},
];

const upcomingWebinars = [
	{
		id: 1,
		title: "Advanced AI Marketing Techniques",
		date: new Date(Date.now() + 86400000 * 2).toLocaleDateString(),
		time: "2:00 PM EST",
		attendees: 56,
		status: "Scheduled",
	},
	{
		id: 2,
		title: "Building Conversational AI Agents",
		date: new Date(Date.now() + 86400000 * 5).toLocaleDateString(),
		time: "1:00 PM EST",
		attendees: 112,
		status: "Draft",
	},
];

const notifications = [
	{
		id: 1,
		title: "New registration",
		message: "Sarah Johnson registered for 'Advanced AI Marketing'",
		time: "10 minutes ago",
	},
	{
		id: 2,
		title: "Webinar reminder",
		message: "'Building Conversational AI Agents' starts in 3 hours",
		time: "3 hours ago",
	},
	{
		id: 3,
		title: "Performance update",
		message: "Your last webinar had 32% higher engagement",
		time: "Yesterday",
	},
];

export default function DashboardPage() {
	return (
		<div className="max-w-7xl mx-auto">
			{/* Header with greeting */}
			<section className="mb-10">
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
						Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-cyan-500">User</span>
					</h1>
					<p className="text-gray-600 dark:text-gray-300 mt-2">
						Here&apos;s what&apos;s happening with your webinars today
					</p>
				</motion.div>
			</section>

			{/* Stats Grid */}
			<section className="mb-10">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{stats.map((stat, index) => (
						<motion.div
							key={stat.name}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							whileHover={{ y: -5, transition: { duration: 0.2 } }}
							className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 backdrop-blur-sm"
						>
							<div className="flex justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.name}</p>
									<p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
								</div>
								<div className={`bg-gradient-to-br ${stat.color} h-10 w-10 rounded-md flex items-center justify-center text-white shadow-lg`}>
									<stat.icon className="h-5 w-5" />
								</div>
							</div>
							<div className="mt-4 flex items-center">
								<div className={`text-xs font-medium ${stat.increasing ? 'text-green-500' : 'text-red-500'} flex items-center`}>
									{stat.change}
									<TrendingUp className={`ml-1 h-3 w-3 ${stat.increasing ? 'text-green-500' : 'text-red-500'}`} />
								</div>
								<span className="text-xs font-medium text-gray-500 dark:text-gray-400 ml-2">vs. last month</span>
							</div>
						</motion.div>
					))}
				</div>
			</section>

			{/* Two column layout */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Main content - 2/3 width */}
				<div className="lg:col-span-2 space-y-8">
					{/* Chart section */}
					<motion.section
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 backdrop-blur-sm"
					>
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
								<BarChart3 className="h-5 w-5 text-violet-500" />
								Webinar Performance
							</h2>
							<div className="flex gap-2">
								<button className="text-xs bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400 px-2 py-1 rounded font-medium">
									Week
								</button>
								<button className="text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 px-2 py-1 rounded font-medium">
									Month
								</button>
								<button className="text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 px-2 py-1 rounded font-medium">
									Year
								</button>
							</div>
						</div>
						<div className="h-64 w-full bg-gray-50 dark:bg-gray-900/30 rounded-lg flex items-center justify-center">
							{/* File upload demo removed */}
						</div>
					</motion.section>

					{/* Upcoming Webinars */}
					<motion.section
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.6, delay: 0.3 }}
						className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 backdrop-blur-sm"
					>
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
								<CalendarCheck className="h-5 w-5 text-violet-500" />
								Upcoming Webinars
							</h2>
							<button className="text-sm text-violet-500 dark:text-violet-400 hover:underline flex items-center">
								View all <ChevronRight className="h-4 w-4" />
							</button>
						</div>
						<div className="divide-y divide-gray-200 dark:divide-gray-700">
							{upcomingWebinars.map((webinar) => (
								<motion.div
									key={webinar.id}
									className="py-4 first:pt-0 last:pb-0"
									whileHover={{ x: 5 }}
								>
									<div className="flex items-center justify-between">
										<div>
											<h3 className="font-medium text-gray-900 dark:text-white">{webinar.title}</h3>
											<div className="flex items-center gap-4 mt-1 text-sm">
												<div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
													<Calendar className="h-4 w-4" />
													<span>{webinar.date}</span>
												</div>
												<div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
													<Clock className="h-4 w-4" />
													<span>{webinar.time}</span>
												</div>
												<div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
													<Users className="h-4 w-4" />
													<span>{webinar.attendees}</span>
												</div>
											</div>
										</div>
										<div className="flex items-center gap-2">
											<span className={`text-xs px-2 py-1 rounded ${
												webinar.status === 'Scheduled'
													? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
													: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
											}`}>
												{webinar.status}
											</span>
											<motion.button
												whileHover={{ scale: 1.1 }}
												whileTap={{ scale: 0.9 }}
												className="p-2 rounded-full bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400"
											>
												<Play className="h-4 w-4" />
											</motion.button>
										</div>
									</div>
								</motion.div>
							))}
						</div>
					</motion.section>
				</div>

				{/* Side content - 1/3 width */}
				<div className="space-y-8">
					{/* Notifications */}
					<motion.section
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6, delay: 0.4 }}
						className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 backdrop-blur-sm"
					>
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
								<Bell className="h-5 w-5 text-violet-500" />
								Notifications
							</h2>
							<div className="bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400 rounded-full px-2 py-0.5 text-xs font-medium">
								{notifications.length} new
							</div>
						</div>
						<div className="space-y-4">
							{notifications.map((notification) => (
								<motion.div
									key={notification.id}
									whileHover={{ x: 5 }}
									className="bg-gray-50 dark:bg-gray-900/30 p-3 rounded-lg"
								>
									<div className="flex justify-between items-start">
										<h3 className="font-medium text-gray-900 dark:text-white">{notification.title}</h3>
										<span className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</span>
									</div>
									<p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{notification.message}</p>
								</motion.div>
							))}
						</div>
						<button className="w-full mt-4 text-center text-violet-500 dark:text-violet-400 text-sm hover:underline">
							View all notifications
						</button>
					</motion.section>

					{/* Quick Actions */}
					<motion.section
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6, delay: 0.5 }}
						className="bg-gradient-to-br from-violet-500 to-indigo-600 p-6 rounded-xl shadow-lg text-white"
					>
						<h2 className="text-lg font-bold mb-4">Quick Actions</h2>
						<div className="space-y-2">
							{['Create a webinar', 'Send invites', 'View analytics', 'Update profile'].map((action, i) => (
								<motion.button
									key={i}
									whileHover={{ x: 5 }}
									whileTap={{ scale: 0.98 }}
									className="flex items-center justify-between w-full bg-white/10 p-3 rounded-lg hover:bg-white/20 transition-colors"
								>
									<span>{action}</span>
									<ArrowUpRight className="h-4 w-4" />
								</motion.button>
							))}
						</div>
					</motion.section>
				</div>
			</div>
		</div>
	);
}