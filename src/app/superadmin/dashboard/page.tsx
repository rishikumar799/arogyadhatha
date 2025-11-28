import AnalyticsCard from '@/app/superadmin/components/dashboard/analytics-card';
import TrackingMap from '@/app/superadmin/components/dashboard/tracking-map';
import ProcessesList from '@/app/superadmin/components/dashboard/processes-list';

const cardData = [
    {
        title: 'Users',
        value: '25,000',
        chartType: 'line',
        description: 'Total registered users on the platform.',
        timeRange: 'Year'
    },
    {
        title: 'Hospitals',
        value: '1,250',
        chartType: 'bar',
        description: 'Total partner hospitals integrated.',
        timeRange: 'All Time'
    },
    {
        title: 'Revenue',
        value: '₹88,000',
        chartType: 'line',
        description: 'Revenue generated in the current cycle.',
        timeRange: 'Week'
    },
    {
        title: 'Appointments',
        value: '15,600',
        chartType: 'line',
        description: 'Total appointments booked via the platform.',
        timeRange: 'Month'
    }
];

export default function SuperadminDashboard() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cardData.map((card, index) => (
                <AnalyticsCard
                    key={index}
                    title={card.title}
                    value={card.value}
                    chartType={card.chartType}
                    description={card.description}
                    timeRange={card.timeRange}
                />
            ))}
      </div>
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
            <div className="xl:col-span-3">
                <TrackingMap />
            </div>
            <div className="xl:col-span-2">
                <ProcessesList />
            </div>
        </div>
    </div>
  );
}
