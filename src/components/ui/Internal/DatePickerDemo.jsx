import { useState } from 'react';
import { DatePicker } from './DatePicker';
import { DateRangePicker } from './DateRangePicker';
import { format, subDays } from 'date-fns';

export const DatePickerDemo = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(format(new Date(), 'dd-MM-yyyy'));
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [reportRange, setReportRange] = useState({
    start: format(subDays(new Date(), 7), 'dd-MM-yyyy'),
    end: format(new Date(), 'dd-MM-yyyy'),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">Modern Date Pickers</span>
          </div>
          
          <h1 className="text-5xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
            Beautiful Date Selection
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Elegant, accessible date pickers with smooth animations and dark mode support
          </p>
        </div>

        {/* Single Date Picker Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Single Date Picker
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Select individual dates with style
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Usage */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl shadow-gray-900/5 dark:shadow-black/20 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Basic Date Picker</h3>
              </div>
              <DatePicker
                label="Select Date"
                value={selectedDate}
                onChange={setSelectedDate}
                placeholder="Choose any date"
              />
              {selectedDate && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    <span className="font-semibold">Backend receives:</span> {selectedDate}
                  </p>
                </div>
              )}
            </div>

            {/* Birth Date */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl shadow-gray-900/5 dark:shadow-black/20 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Birth Date</h3>
              </div>
              <DatePicker
                label="Date of Birth"
                value={birthDate}
                onChange={setBirthDate}
                placeholder="Select your birth date"
                maxDate={new Date()}
              />
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                ⚡ Only past dates are selectable
              </p>
            </div>

            {/* Future Dates */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl shadow-gray-900/5 dark:shadow-black/20 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Appointment Date</h3>
              </div>
              <DatePicker
                label="Schedule Appointment"
                value={appointmentDate}
                onChange={setAppointmentDate}
                placeholder="Pick a future date"
                minDate={new Date()}
              />
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                📅 Only future dates are selectable
              </p>
            </div>

            {/* With Error */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl shadow-gray-900/5 dark:shadow-black/20 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Error State</h3>
              </div>
              <DatePicker
                label="Required Field"
                value={null}
                onChange={() => {}}
                placeholder="This field is required"
                error="Please select a date"
              />
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                ⚠️ Shows validation errors
              </p>
            </div>
          </div>
        </section>

        {/* Date Range Picker Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Date Range Picker
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Select date ranges with visual feedback
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Basic Range */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl shadow-gray-900/5 dark:shadow-black/20 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Date Range Selection</h3>
              </div>
              <DateRangePicker
                label="Select Date Range"
                value={dateRange}
                onChange={setDateRange}
                placeholder="Choose start and end dates"
              />
              {dateRange.start && dateRange.end && (
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    <span className="font-bold">Backend receives:</span>
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Start: {dateRange.start} | End: {dateRange.end}
                  </p>
                </div>
              )}
            </div>

            {/* Report Period */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl shadow-gray-900/5 dark:shadow-black/20 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Report Period (Pre-filled)</h3>
              </div>
              <DateRangePicker
                label="Report Period"
                value={reportRange}
                onChange={setReportRange}
                placeholder="Select report period"
              />
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                📊 Default: Last 7 days
              </p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl shadow-gray-900/5 dark:shadow-black/20 border border-gray-100 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            ✨ Features
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: '🎨', title: 'Modern Design', desc: 'Beautiful gradients and shadows' },
              { icon: '🌙', title: 'Dark Mode', desc: 'Seamless theme switching' },
              { icon: '⚡', title: 'Smooth Animations', desc: 'Buttery transitions' },
              { icon: '📱', title: 'Responsive', desc: 'Works on all devices' },
              { icon: '♿', title: 'Accessible', desc: 'Keyboard navigation' },
              { icon: '🎯', title: 'Range Selection', desc: 'Visual range highlighting' },
              { icon: '📅', title: 'Month Picker', desc: 'Switch to month mode' },
              { icon: '🔒', title: 'Date Constraints', desc: 'Min/max date limits' },
              { icon: '✅', title: 'Validation', desc: 'Error state handling' },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all hover:scale-105"
              >
                <div className="text-2xl mb-2">{feature.icon}</div>
                <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-1">
                  {feature.title}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Code Example */}
        <section className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 shadow-xl">
          <h3 className="text-2xl font-bold text-white mb-4">
            💻 Quick Start
          </h3>
          
          <div className="space-y-4">
            <div className="bg-black/30 rounded-xl p-4 font-mono text-sm">
              <div className="text-gray-400 mb-2">// Import components</div>
              <div className="text-blue-400">import</div>
              <div className="text-gray-300"> {'{ DatePicker, DateRangePicker }'} </div>
              <div className="text-blue-400">from</div>
              <div className="text-green-400"> '@/components/ui/Internal/DatePicker'</div>
              <div className="text-gray-300">;</div>
            </div>

            <div className="bg-black/30 rounded-xl p-4 font-mono text-sm">
              <div className="text-gray-400 mb-2">// Component returns dd-MM-yyyy format</div>
              <div className="text-green-400">onChange={(date) => console.log(date)}</div>
              <div className="text-gray-400 mt-2">// Output: "17-05-2026"</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
