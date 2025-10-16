import React, { useContext } from 'react';
import StatCard from './StatCard';
import DonutChartCard from './DonutChartCard';
import BarChartCard from './BarChartCard';
import { DonutChartData, ChartData } from '../types';
import { LanguageContext } from '../contexts/LanguageContext';

// Import icons for StatCards
import ArrowLeftOnRectangleIcon from './icons-redesign/ArrowLeftOnRectangleIcon';
import ArrowPathIcon from './icons-redesign/ArrowPathIcon';
import DesktopComputerIcon from './icons-redesign/DesktopComputerIcon';
import ArrowRightOnRectangleIcon from './icons-redesign/ArrowRightOnRectangleIcon';


const Dashboard: React.FC = () => {
    const { t } = useContext(LanguageContext);

    const statCardsData = [
        { title: t('dashboard.arrivals'), value: 0, color: 'green', icon: ArrowRightOnRectangleIcon },
        { title: t('dashboard.checkedIn'), value: 3, color: 'blue', icon: DesktopComputerIcon },
        { title: t('dashboard.departures'), value: 21, color: 'yellow', icon: ArrowPathIcon },
        { title: t('dashboard.checkedOut'), value: 21, color: 'orange', icon: ArrowLeftOnRectangleIcon },
    ] as const;

    const apartmentAvailabilityData: DonutChartData[] = [
        { name: t('dashboard.available'), value: 11, color: '#14b8a6' },
        { name: t('dashboard.booked'), value: 3, color: '#f43f5e' },
    ];
    const apartmentAvailabilityTotal = apartmentAvailabilityData.reduce((sum, item) => sum + item.value, 0);

    const checkoutLogData: DonutChartData[] = [
        { name: t('dashboard.checkout'), value: 19, color: '#38bdf8' },
        { name: t('dashboard.empty'), value: 4, color: '#f43f5e' },
    ];
    const checkoutLogTotal = checkoutLogData.reduce((sum, item) => sum + item.value, 0);


    const apartmentCleaningData: DonutChartData[] = [
        { name: t('dashboard.notClean'), value: 7, color: '#f59e0b' },
        { name: t('dashboard.clean'), value: 2, color: '#14b8a6' },
    ];
    const apartmentCleaningTotal = apartmentCleaningData.reduce((sum, item) => sum + item.value, 0);

    const weeklyStatsData: ChartData[] = [
      { name: t('dashboard.sunday'), value: 0 },
      { name: t('dashboard.monday'), value: 0 },
      { name: t('dashboard.tuesday'), value: 0 },
      { name: t('dashboard.wednesday'), value: 2 },
      { name: t('dashboard.thursday'), value: 6 },
      { name: t('dashboard.friday'), value: 0 },
      { name: t('dashboard.saturday'), value: 14 },
    ];

    const monthlyStatsData: ChartData[] = [
        { name: t('dashboard.january'), value: 0 },
        { name: t('dashboard.february'), value: 0 },
        { name: t('dashboard.march'), value: 1 },
        { name: t('dashboard.april'), value: 0 },
        { name: t('dashboard.may'), value: 0 },
        { name: t('dashboard.june'), value: 7 },
        { name: t('dashboard.july'), value: 7 },
        { name: t('dashboard.august'), value: 7 },
        { name: t('dashboard.september'), value: 1 },
        { name: t('dashboard.october'), value: 0 },
        { name: t('dashboard.november'), value: 0 },
        { name: t('dashboard.december'), value: 0 },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCardsData.map((card, index) => (
                <StatCard key={index} title={card.title} value={card.value} color={card.color} icon={card.icon} />
            ))}

            <div className="md:col-span-2 lg:col-span-2">
                <DonutChartCard 
                    title={t('dashboard.apartmentAvailability')}
                    data={apartmentAvailabilityData}
                    centerLabel={t('dashboard.available')}
                    centerValue={apartmentAvailabilityData.find(d => d.name === t('dashboard.available'))?.value || 0}
                    total={apartmentAvailabilityTotal}
                />
            </div>
            
            <div className="md:col-span-2 lg:col-span-2">
                 <BarChartCard 
                    title={t('dashboard.apartmentStats')}
                    data={weeklyStatsData}
                    barColor="#38bdf8"
                    stats={[
                        {label: t('dashboard.annualStats'), value: 14},
                        {label: t('dashboard.monthlyStats'), value: 6},
                        {label: t('dashboard.weeklyStats'), value: 2},
                    ]}
                />
            </div>

             <div className="md:col-span-2 lg:col-span-4">
                 <BarChartCard 
                    title={t('dashboard.bookingStats')}
                    data={monthlyStatsData}
                    barColor="#f43f5e"
                    stats={[
                        {label: t('dashboard.annualStats'), value: 22},
                        {label: t('dashboard.monthlyStats'), value: 7},
                        {label: t('dashboard.weeklyStats'), value: 1},
                    ]}
                />
            </div>

            <div className="md:col-span-2 lg:col-span-2">
                <DonutChartCard 
                    title={t('dashboard.bookingStatus')}
                    data={checkoutLogData}
                    centerLabel={t('dashboard.checkout')}
                    centerValue={checkoutLogData.find(d => d.name === t('dashboard.checkout'))?.value || 0}
                    total={checkoutLogTotal}
                    stats={[
                        {label: t('dashboard.checkout'), value: 2},
                        {label: t('dashboard.checkin'), value: 0},
                        {label: t('dashboard.dash'), value: 0},
                    ]}
                />
            </div>
            
            <div className="md:col-span-2 lg:col-span-2">
                 <DonutChartCard 
                    title={t('dashboard.apartmentCleaning')}
                    data={apartmentCleaningData}
                    centerLabel={t('dashboard.notClean')}
                    centerValue={apartmentCleaningData.find(d => d.name === t('dashboard.notClean'))?.value || 0}
                    total={apartmentCleaningTotal}
                     stats={[
                        {label: t('dashboard.notClean'), value: 1},
                        {label: t('dashboard.clean'), value: 1},
                        {label: t('dashboard.dash'), value: 0},
                    ]}
                />
            </div>
        </div>
    );
};

export default Dashboard;
