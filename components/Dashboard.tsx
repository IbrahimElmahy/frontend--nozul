import React from 'react';
import StatCard from './StatCard';
import DonutChartCard from './DonutChartCard';
import BarChartCard from './BarChartCard';

import { DonutChartData, ChartData } from '../types';

// FIX: Use 'as const' to ensure color properties are inferred as literal types
// instead of the general 'string' type, which resolves the type mismatch with StatCardProps.
const statCardsData = [
    { title: 'مسجلين الخروج', value: 19, color: 'orange' },
    { title: 'المغادرين', value: 19, color: 'cyan' },
    { title: 'مسجلين الدخول', value: 3, color: 'teal' },
    { title: 'الواصلين', value: 0, color: 'purple' },
] as const;

const apartmentAvailabilityData: DonutChartData[] = [
    { name: 'متاحة', value: 11, color: '#14b8a6' },
    { name: 'محجوزة', value: 3, color: '#f43f5e' },
];
const apartmentAvailabilityTotal = apartmentAvailabilityData.reduce((sum, item) => sum + item.value, 0);

const checkoutLogData: DonutChartData[] = [
    { name: 'تسجيل الخروج', value: 19, color: '#38bdf8' },
    { name: 'فارغ', value: 4, color: '#f43f5e' },
];
const checkoutLogTotal = checkoutLogData.reduce((sum, item) => sum + item.value, 0);


const apartmentCleaningData: DonutChartData[] = [
    { name: 'غير نظيفة', value: 7, color: '#f59e0b' },
    { name: 'نظيفة', value: 2, color: '#14b8a6' },
];
const apartmentCleaningTotal = apartmentCleaningData.reduce((sum, item) => sum + item.value, 0);

const weeklyStatsData: ChartData[] = [
  { name: 'الأحد', value: 0 },
  { name: 'الاثنين', value: 0 },
  { name: 'الثلاثاء', value: 0 },
  { name: 'الأربعاء', value: 2 },
  { name: 'الخميس', value: 6 },
  { name: 'الجمعة', value: 0 },
  { name: 'السبت', value: 14 },
];

const monthlyStatsData: ChartData[] = [
    { name: 'يناير', value: 0 },
    { name: 'فبراير', value: 0 },
    { name: 'مارس', value: 1 },
    { name: 'أبريل', value: 0 },
    { name: 'مايو', value: 0 },
    { name: 'يونيو', value: 7 },
    { name: 'يوليو', value: 7 },
    { name: 'أغسطس', value: 7 },
    { name: 'سبتمبر', value: 1 },
    { name: 'أكتوبر', value: 0 },
    { name: 'نوفمبر', value: 0 },
    { name: 'ديسمبر', value: 0 },
];

const Dashboard: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCardsData.map((card, index) => (
                <StatCard key={index} title={card.title} value={card.value} color={card.color} />
            ))}

            <div className="md:col-span-2 lg:col-span-2">
                <DonutChartCard 
                    title="إتاحة الشقق" 
                    data={apartmentAvailabilityData}
                    centerLabel="متاحة"
                    centerValue={apartmentAvailabilityData.find(d => d.name === 'متاحة')?.value || 0}
                    total={apartmentAvailabilityTotal}
                />
            </div>
            
            <div className="md:col-span-2 lg:col-span-2">
                 <BarChartCard 
                    title="إحصائيات الشقق" 
                    data={weeklyStatsData}
                    barColor="#38bdf8"
                    stats={[
                        {label: "إحصائيات سنوية", value: 14},
                        {label: "إحصائيات شهرية", value: 6},
                        {label: "إحصائيات أسبوعية", value: 2},
                    ]}
                />
            </div>

             <div className="md:col-span-2 lg:col-span-4">
                 <BarChartCard 
                    title="إحصائيات الحجوزات" 
                    data={monthlyStatsData}
                    barColor="#f43f5e"
                    stats={[
                        {label: "إحصائيات سنوية", value: 22},
                        {label: "إحصائيات شهرية", value: 7},
                        {label: "إحصائيات أسبوعية", value: 1},
                    ]}
                />
            </div>

            <div className="md:col-span-2 lg:col-span-2">
                <DonutChartCard 
                    title="حالة الحجوزات" 
                    data={checkoutLogData}
                    centerLabel="تسجيل الخروج"
                    centerValue={checkoutLogData.find(d => d.name === 'تسجيل الخروج')?.value || 0}
                    total={checkoutLogTotal}
                    stats={[
                        {label: "تسجيل الخروج", value: 2},
                        {label: "تسجيل الدخول", value: 0},
                        {label: "-", value: 0},
                    ]}
                />
            </div>
            
            <div className="md:col-span-2 lg:col-span-2">
                 <DonutChartCard 
                    title="نظافة الشقق" 
                    data={apartmentCleaningData}
                    centerLabel="غير نظيفة"
                    centerValue={apartmentCleaningData.find(d => d.name === 'غير نظيفة')?.value || 0}
                    total={apartmentCleaningTotal}
                     stats={[
                        {label: "غير نظيفة", value: 1},
                        {label: "نظيفة", value: 1},
                        {label: "-", value: 0},
                    ]}
                />
            </div>
        </div>
    );
};

export default Dashboard;