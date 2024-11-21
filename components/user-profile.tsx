'use client'

import { useState, useEffect } from 'react'
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Shield, Bell, Key, Lock, Smartphone, ChevronDown, Home, Brain } from 'lucide-react'
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  company: string;
  joinDate: string;
  avatar: string;
  role: string;
  timezone: string;
}


interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  isExpandable?: boolean;
  isActive?: boolean;
  isCollapsed?: boolean;
  children?: React.ReactNode;
}

interface SubMenuItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  isCollapsed?: boolean;
}


export default function UserProfilePage() {
  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    bio: 'Experienced cybersecurity professional with a passion for NIST compliance and AI-powered security solutions.',
    company: 'SecureTech Solutions',
    joinDate: 'January 15, 2022',
    avatar: 'https://i.pravatar.cc/150?img=68',
    role: 'Security Analyst',
    timezone: 'America/New_York'
  })

  function MenuItem({ icon, label, isExpandable = false, isActive = false, isCollapsed = false, children }: MenuItemProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const router = useRouter()
  
    const handleClick = () => {
      if (isExpandable) {
        setIsExpanded(!isExpanded)
      } else {
        switch (label) {
          case 'Dashboard':
            router.push('/dashboard')
            break
          case 'Support':
            router.push('/')
            break
        }
      }
    }
  
    return (
      <div>
        <button 
          className={cn(
            "w-full flex items-center px-4 py-2 hover:bg-gray-100 transition-colors",
            isActive && "bg-blue-50 text-blue-600"
          )}
          onClick={handleClick}
          title={isCollapsed ? label : undefined}
        >
          <span className="mr-3">{icon}</span>
          {!isCollapsed && (
            <>
              <span className="flex-grow text-left">{label}</span>
              {isExpandable && (
                <ChevronDown 
                  size={16} 
                  className={cn("transition-transform", isExpanded && "transform rotate-180")} 
                />
              )}
            </>
          )}
        </button>
        {isExpandable && isExpanded && !isCollapsed && (
          <div className="ml-6 mt-1">
            {children}
          </div>
        )}
      </div>
    )
  }
  
  function SubMenuItem({ icon, label, isActive = false, isCollapsed = false }: SubMenuItemProps) {
    const router = useRouter()
  
    const handleClick = () => {
      switch (label) {
        case 'NISTAI':
          router.push('/nistai')
          break
      }
    }
  
    return (
      <button 
        className={cn(
          "w-full flex items-center px-4 py-2 hover:bg-gray-100 transition-colors",
          isActive && "bg-blue-50 text-blue-600"
        )}
        title={isCollapsed ? label : undefined}
        onClick={handleClick}
      >
        {icon && <span className="mr-3">{icon}</span>}
        {!isCollapsed && <span>{label}</span>}
      </button>
    )
  }
  
  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarCollapsed(true)
      }
    }
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setUserProfile(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setUserProfile(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    console.log('Saving profile:', userProfile)
    alert('Profile updated successfully!')
  }

  const router = useRouter()

  return (
    <div className="flex h-screen bg-gray-100">
       {/* Sidebar */}
       <aside className={cn(
        "bg-white border-r border-[#E5E7EB] transition-all duration-200 ease-in-out flex flex-col",
        isSidebarCollapsed ? "w-16" : "w-[280px]"
      )}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center px-4 border-b border-[#E5E7EB]">
          <div className={isSidebarCollapsed ? "w-8" : "w-32"}>
            <img
              src="https://cdn.prod.website-files.com/6459501a1911cd7b5655f077/646a2f2db39363e2e38e31f4_logo-white-goldi.svg"
              alt="Goldilock"
              className={`h-8 w-full object-contain invert`}
            />
          </div>
        </div>

         {/* Sidebar Menu */}
         <nav className="flex-grow py-4">
          <MenuItem 
            icon={<Home size={20} />} 
            label="Dashboard" 
            isActive 
            isCollapsed={isSidebarCollapsed}
          />
          <MenuItem 
            icon={<Shield size={20} />} 
            label="Products" 
            isExpandable 
            isCollapsed={isSidebarCollapsed}
          >
            <SubMenuItem 
              icon={<Brain size={20} />}
              label="NISTAI" 
              isActive 
              isCollapsed={isSidebarCollapsed}
            />
          </MenuItem>
          <MenuItem 
            icon={<User size={20} />} 
            label="Support" 
            isCollapsed={isSidebarCollapsed}
          />
        </nav>

        {/* User Profile and Collapse Button */}
        <div className="h-16 border-t border-[#E5E7EB] flex items-center px-4">
          {!isSidebarCollapsed && (
            <>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
              <span className="ml-3 font-medium" onClick={()=>{router.push("/profile")}}>John Doe</span>
              <Button variant="ghost" size="icon" onClick={toggleSidebar} className="ml-auto">
                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Button>
            </>
          )}
          {isSidebarCollapsed && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <svg className="w-4 h-4 transform rotate-180" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Button>
          )}
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-8 space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg overflow-hidden">
            <div className="p-8 relative">
              <div className="relative z-10 flex justify-between items-center">
                <div>
                  <h2 className="text-4xl font-bold mb-2">User Profile</h2>
                  <p className="text-xl opacity-80">Manage your account information</p>
                </div>
                <div className="h-24 w-24 rounded-full border-4 border-white overflow-hidden">
                  <img src={userProfile.avatar} alt={userProfile.name} className="h-full w-full object-cover" />
                </div>
              </div>
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-repeat opacity-20" />
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              {/* Tabs */}
              <div className="flex mb-6 border-b">
                {['general', 'security', 'preferences'].map((tab) => (
                  <button
                    key={tab}
                    className={`px-4 py-2 font-medium ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                      <div className="relative">
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={userProfile.name}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 pl-10"
                        />
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                      <div className="relative">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={userProfile.email}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 pl-10"
                        />
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                      <div className="relative">
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={userProfile.phone}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 pl-10"
                        />
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                      <div className="relative">
                        <input
                          id="location"
                          name="location"
                          type="text"
                          value={userProfile.location}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 pl-10"
                        />
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
                      <div className="relative">
                        <input
                          id="company"
                          name="company"
                          type="text"
                          value={userProfile.company}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 pl-10"
                        />
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                      <div className="relative">
                        <input
                          id="role"
                          name="role"
                          type="text"
                          value={userProfile.role}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 pl-10"
                        />
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
                      <textarea
                        id="bio"
                        name="bio"
                        rows={4}
                        value={userProfile.bio}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow">
                      <h3 className="text-lg font-medium flex items-center mb-4">
                        <Key className="h-5 w-5 mr-2" />
                        Password
                      </h3>
                      <button className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Change Password
                      </button>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                      <h3 className="text-lg font-medium flex items-center mb-4">
                        <Smartphone className="h-5 w-5 mr-2" />
                        Two-Factor Authentication
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Enable 2FA</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" value="" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
                      <h3 className="text-lg font-medium flex items-center mb-4">
                        <Lock className="h-5 w-5 mr-2" />
                        Login History
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex justify-between items-center">
                          <span>New York, USA</span>
                          <span className="text-sm text-gray-500">2 days ago</span>
                        </li>
                        <li className="flex justify-between items-center">
                          <span>London, UK</span>
                          <span className="text-sm text-gray-500">1 week ago</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">Timezone</label>
                      <div className="relative">
                        <select
                          id="timezone"
                          name="timezone"
                          value={userProfile.timezone}
                          onChange={handleSelectChange}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        >
                          <option value="America/New_York">Eastern Time (ET)</option>
                          <option value="America/Chicago">Central Time (CT)</option>
                          <option value="America/Denver">Mountain Time (MT)</option>
                          <option value="America/Los_Angeles">Pacific Time (PT)</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="language" className="block text-sm font-medium text-gray-700">Language</label>
                      <div className="relative">
                        <select
                          id="language"
                          name="language"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        >
                          <option value="en">English</option>
                          <option value="es">Español</option>
                          <option value="fr">Français</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-medium flex items-center mb-4">
                      <Bell className="h-5 w-5 mr-2" />
                      Notification Preferences
                    </h3>
                    <div className="space-y-4">
                      {['Email', 'Push', 'SMS'].map((type) => (
                        <div key={type} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{type} Notifications</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" value="" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h3 className="text-lg font-medium mb-2">Account Overview</h3>
              <p className="text-sm text-gray-600 mb-4">A summary of your account details and activity</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Briefcase className="h-5 w-5 text-gray-500" />
                  <span className="text-sm">{userProfile.company}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <span className="text-sm">Joined on {userProfile.joinDate}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-gray-500" />
                  <span className="text-sm">Last security check: 2 weeks ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}