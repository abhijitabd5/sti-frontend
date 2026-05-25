# Date Picker Components

Two reusable, attractive date picker components with rich UI, dark mode support, and comprehensive features.

## Components

### 1. DatePicker (Single Date Selection)
### 2. DateRangePicker (Date Range & Month Range Selection)

---

## DatePicker

A single date selection component with calendar interface.

### Import

```javascript
import { DatePicker } from '@/components/ui/Internal/DatePicker';
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `Date \| null` | - | Selected date |
| `onChange` | `(date: Date \| null) => void` | - | Callback when date changes |
| `placeholder` | `string` | `'Select date'` | Placeholder text |
| `minDate` | `Date` | - | Minimum selectable date |
| `maxDate` | `Date` | - | Maximum selectable date |
| `disabled` | `boolean` | `false` | Disable the picker |
| `className` | `string` | `''` | Additional CSS classes |
| `error` | `string` | `''` | Error message to display |

### Basic Usage

```javascript
import { useState } from 'react';
import { DatePicker } from '@/components/ui/Internal/DatePicker';

function MyComponent() {
  const [date, setDate] = useState(null);

  return (
    <DatePicker
      value={date}
      onChange={setDate}
      placeholder="Select a date"
    />
  );
}
```

### Advanced Examples

#### Birth Date (Past Dates Only)

```javascript
<DatePicker
  value={birthDate}
  onChange={setBirthDate}
  placeholder="Select birth date"
  maxDate={new Date()}
/>
```

#### Appointment Date (Future Dates Only)

```javascript
<DatePicker
  value={appointmentDate}
  onChange={setAppointmentDate}
  placeholder="Select appointment"
  minDate={new Date()}
/>
```

#### With Date Range Constraint

```javascript
import { addDays } from 'date-fns';

<DatePicker
  value={date}
  onChange={setDate}
  minDate={new Date()}
  maxDate={addDays(new Date(), 30)}
  placeholder="Next 30 days only"
/>
```

#### With Error State

```javascript
<DatePicker
  value={date}
  onChange={setDate}
  error={!date ? 'This field is required' : ''}
/>
```

### Features

- ✅ Calendar grid with month navigation
- ✅ Today button for quick selection
- ✅ Clear button to reset selection
- ✅ Min/max date constraints
- ✅ Current day indicator (ring highlight)
- ✅ Keyboard navigation support
- ✅ Dark mode support
- ✅ Error state styling
- ✅ Disabled state
- ✅ Smooth animations
- ✅ Accessible (focus management, ARIA)

---

## DateRangePicker

A date range selection component with support for both date ranges and month ranges.

### Import

```javascript
import { DateRangePicker } from '@/components/ui/Internal/DateRangePicker';
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `{ start: Date \| null, end: Date \| null }` | `{ start: null, end: null }` | Selected date range |
| `onChange` | `(range: { start: Date \| null, end: Date \| null }) => void` | - | Callback when range changes |
| `placeholder` | `string` | `'Select date range'` | Placeholder text |
| `minDate` | `Date` | - | Minimum selectable date |
| `maxDate` | `Date` | - | Maximum selectable date |
| `disabled` | `boolean` | `false` | Disable the picker |
| `className` | `string` | `''` | Additional CSS classes |
| `error` | `string` | `''` | Error message to display |
| `mode` | `'date' \| 'month'` | `'date'` | Initial mode (date or month range) |

### Basic Usage

```javascript
import { useState } from 'react';
import { DateRangePicker } from '@/components/ui/Internal/DateRangePicker';

function MyComponent() {
  const [range, setRange] = useState({ start: null, end: null });

  return (
    <DateRangePicker
      value={range}
      onChange={setRange}
      placeholder="Select date range"
    />
  );
}
```

### Advanced Examples

#### Report Period (Last 7 Days Default)

```javascript
import { subDays } from 'date-fns';

const [reportRange, setReportRange] = useState({
  start: subDays(new Date(), 7),
  end: new Date(),
});

<DateRangePicker
  value={reportRange}
  onChange={setReportRange}
  placeholder="Select report period"
/>
```

#### Month Range Picker

```javascript
<DateRangePicker
  value={monthRange}
  onChange={setMonthRange}
  placeholder="Select month range"
  mode="month"
/>
```

#### With Date Constraints

```javascript
import { subMonths, addMonths } from 'date-fns';

<DateRangePicker
  value={range}
  onChange={setRange}
  minDate={subMonths(new Date(), 6)}
  maxDate={addMonths(new Date(), 3)}
  placeholder="Last 6 months to next 3 months"
/>
```

#### With Error State

```javascript
<DateRangePicker
  value={range}
  onChange={setRange}
  error={!range.start || !range.end ? 'Please select a date range' : ''}
/>
```

### Features

- ✅ Date range selection with visual highlighting
- ✅ Month range selection mode
- ✅ Tab switching between date/month modes
- ✅ Hover preview of range
- ✅ Auto-swap if end date is before start date
- ✅ Clear button to reset selection
- ✅ Status indicator (selecting start/end)
- ✅ Min/max date constraints
- ✅ Dark mode support
- ✅ Error state styling
- ✅ Smooth animations
- ✅ Accessible (focus management, ARIA)

### Selection Behavior

1. **First click**: Selects start date
2. **Second click**: Selects end date
3. **Auto-swap**: If end date is before start date, they are automatically swapped
4. **Hover preview**: Shows potential range while hovering over dates

---

## Styling

Both components use:
- **Tailwind CSS** for styling
- **Dark mode** support via `dark:` variants
- **Radix UI Popover** for dropdown positioning
- **Heroicons** for icons
- **date-fns** for date manipulation

### Theme Integration

The components automatically adapt to your theme:
- Light mode: Clean white backgrounds with subtle shadows
- Dark mode: Dark gray backgrounds with blue accents
- Consistent with your existing UI components

---

## Dependencies

Required packages (already in your project):

```json
{
  "date-fns": "^4.1.0",
  "@radix-ui/react-popover": "^1.1.2",
  "@radix-ui/react-tabs": "^1.1.1",
  "@heroicons/react": "^2.2.0",
  "clsx": "^2.1.1"
}
```

---

## Demo Component

A demo component is available at `src/components/ui/Internal/DatePickerDemo.jsx` showing all features and usage examples.

To view the demo:

```javascript
import { DatePickerDemo } from '@/components/ui/Internal/DatePickerDemo';

// In your route or page
<DatePickerDemo />
```

---

## Common Use Cases

### 1. Form Date Input

```javascript
import { useForm, Controller } from 'react-hook-form';
import { DatePicker } from '@/components/ui/Internal/DatePicker';

function MyForm() {
  const { control, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="birthDate"
        control={control}
        rules={{ required: 'Birth date is required' }}
        render={({ field, fieldState }) => (
          <DatePicker
            value={field.value}
            onChange={field.onChange}
            error={fieldState.error?.message}
            maxDate={new Date()}
          />
        )}
      />
    </form>
  );
}
```

### 2. Filter by Date Range

```javascript
function TransactionFilter() {
  const [dateRange, setDateRange] = useState({ start: null, end: null });

  useEffect(() => {
    if (dateRange.start && dateRange.end) {
      fetchTransactions(dateRange);
    }
  }, [dateRange]);

  return (
    <DateRangePicker
      value={dateRange}
      onChange={setDateRange}
      placeholder="Filter by date"
    />
  );
}
```

### 3. Report Period Selection

```javascript
function ReportGenerator() {
  const [period, setPeriod] = useState({ start: null, end: null });

  const generateReport = () => {
    if (period.start && period.end) {
      // Generate report for selected period
    }
  };

  return (
    <div>
      <DateRangePicker
        value={period}
        onChange={setPeriod}
        mode="month"
        placeholder="Select report period"
      />
      <button onClick={generateReport}>Generate Report</button>
    </div>
  );
}
```

---

## Accessibility

Both components follow accessibility best practices:

- ✅ Keyboard navigation (Tab, Enter, Escape)
- ✅ Focus management
- ✅ ARIA labels and roles
- ✅ Screen reader friendly
- ✅ High contrast support
- ✅ Focus visible indicators

---

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## Troubleshooting

### Date not updating

Make sure you're passing the `onChange` callback:

```javascript
// ❌ Wrong
<DatePicker value={date} />

// ✅ Correct
<DatePicker value={date} onChange={setDate} />
```

### Popover not showing

Ensure Radix UI Popover is installed:

```bash
npm install @radix-ui/react-popover
```

### Styling issues

Make sure Tailwind CSS is configured with the dark mode class strategy:

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  // ...
};
```

---

## Future Enhancements

Potential improvements for future versions:

- [ ] Time picker integration
- [ ] Preset ranges (Last 7 days, Last month, etc.)
- [ ] Custom date format
- [ ] Multiple date selection
- [ ] Week picker mode
- [ ] Quarter picker mode
- [ ] Internationalization (i18n)
- [ ] Custom first day of week

---

## License

Part of the Earth Movers Training Academy project.
