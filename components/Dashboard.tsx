import React, { useContext, useState, useEffect } from 'react';
import StatCard from './StatCard';
import DonutChartCard from './DonutChartCard';
import BarChartCard from './BarChartCard';
import { DonutChartData, ChartData } from '../types';
import { LanguageContext } from '../contexts/LanguageContext';
import { apiClient } from '../apiClient';

// Import icons for StatCards
import ArrowLeftOnRectangleIcon from './icons-redesign/ArrowLeftOnRectangleIcon';
import ArrowPathIcon from './icons-redesign/ArrowPathIcon';
import DesktopComputerIcon from './icons-redesign/DesktopComputerIcon';
import ArrowRightOnRectangleIcon from './icons-redesign/ArrowRightOnRectangleIcon';

// API Response Interfaces
interface NumericStatsResponse {
    reservations: number;
    arrivals: number;
    occupied: number;
    departures: number;
    departed: number;
}

interface LabelValueResponse {
    label: string;
    value: number;
}

interface TimeSeriesResponse {
    [key: string]: number[];
}


const Dashboard: React.FC = () => {
    const { t } = useContext(LanguageContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // States for API data
    const [numericStats, setNumericStats] = useState<NumericStatsResponse | null>(null);
    const [apartmentAvailability, setApartmentAvailability] = useState<DonutChartData[]>([]);
    const [apartmentTimeSeries, setApartmentTimeSeries] = useState<TimeSeriesResponse | null>(null);
    const [reservationTimeSeries, setReservationTimeSeries] = useState<TimeSeriesResponse | null>(null);
    const [apartmentCleanliness, setApartmentCleanliness] = useState<DonutChartData[]>([]);
    const [reservationStatus, setReservationStatus] = useState<DonutChartData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [
                    numericStatsData,
                    availabilitiesData,
                    apartmentsData,
                    reservationsData,
                    cleanlinessData,
                    statusCountData
                ] = await Promise.all([
                    apiClient<NumericStatsResponse>('/ar/reservation/api/index/numeric-stats/'),
                    apiClient<LabelValueResponse[]>('/ar/apartment/api/index/availabilities/'),
                    apiClient<TimeSeriesResponse>('/ar/apartment/api/index/apartments/'),
                    apiClient<TimeSeriesResponse>('/ar/reservation/api/index/reservations/'),
                    apiClient<LabelValueResponse[]>('/ar/apartment/api/index/cleanliness/'),
                    apiClient<LabelValueResponse[]>('/ar/reservation/api/index/status-count/'),
                ]);

                // Set raw data states
                setNumericStats(numericStatsData);
                setApartmentTimeSeries(apartmentsData);
                setReservationTimeSeries(reservationsData);

                // Process and set chart data states
                const availabilityChartData: DonutChartData[] = availabilitiesData.map(item => ({
                    name: item.label === 'متاحة' ? t('dashboard.available') : t('dashboard.booked'),
                    value: item.value,
                    color: item.label === 'متاحة' ? '#14b8a6' : '#f43f5e',
                }));
                setApartmentAvailability(availabilityChartData);

                const cleanlinessChartData: DonutChartData[] = cleanlinessData.map(item => ({
                    name: item.label === 'نظيفة' ? t('dashboard.clean') : t('dashboard.notClean'),
                    value: item.value,
                    color: item.label === 'نظيفة' ? '#14b8a6' : '#f59e0b',
                }));
                setApartmentCleanliness(cleanlinessChartData);

                const statusCountChartData: DonutChartData[] = statusCountData.map(item => ({
                    name: item.label === 'تسجيل الدخول' ? t('dashboard.checkin') : t('dashboard.checkout'),
                    value: item.value,
                    color: item.label === 'تسجيل الدخول' ? '#38bdf8' : '#f59e0b', // checkin: blue, checkout: amber
                }));
                setReservationStatus(statusCountChartData);

            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unexpected error occurred.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [t]);

    // Derived data for rendering
    const statCardsData = numericStats ? [
        { title: t('dashboard.arrivals'), value: numericStats.arrivals, color: 'green', icon: ArrowRightOnRectangleIcon },
        { title: t('dashboard.checkedIn'), value: numericStats.occupied, color: 'blue', icon: DesktopComputerIcon },
        { title: t('dashboard.departures'), value: numericStats.departures, color: 'yellow', icon: ArrowPathIcon },
        { title: t('dashboard.checkedOut'), value: numericStats.departed, color: 'orange', icon: ArrowLeftOnRectangleIcon },
    ] as const : [];

    const apartmentAvailabilityTotal = apartmentAvailability.reduce((sum, item) => sum + item.value, 0);

    const weeklyDays = [t('dashboard.sunday'), t('dashboard.monday'), t('dashboard.tuesday'), t('dashboard.wednesday'), t('dashboard.thursday'), t('dashboard.friday'), t('dashboard.saturday')];
    const weeklyStatsData: ChartData[] = apartmentTimeSeries?.apartment_this_week
        ? apartmentTimeSeries.apartment_this_week.map((value, index) => ({ name: weeklyDays[index], value }))
        : [];

    const apartmentAnnualTotal = apartmentTimeSeries?.apartment_this_year?.reduce((a, b) => a + b, 0) || 0;
    const apartmentMonthlyTotal = apartmentTimeSeries?.apartment_this_month?.reduce((a, b) => a + b, 0) || 0;
    const apartmentWeeklyTotal = apartmentTimeSeries?.apartment_this_week?.reduce((a, b) => a + b, 0) || 0;

    const yearlyMonths = [t('dashboard.january'), t('dashboard.february'), t('dashboard.march'), t('dashboard.april'), t('dashboard.may'), t('dashboard.june'), t('dashboard.july'), t('dashboard.august'), t('dashboard.september'), t('dashboard.october'), t('dashboard.november'), t('dashboard.december')];
    const monthlyStatsData: ChartData[] = reservationTimeSeries?.reservation_this_year
        ? reservationTimeSeries.reservation_this_year.map((value, index) => ({ name: yearlyMonths[index], value }))
        : [];

    const reservationAnnualTotal = reservationTimeSeries?.reservation_this_year?.reduce((a, b) => a + b, 0) || 0;
    const reservationMonthlyTotal = reservationTimeSeries?.reservation_this_month?.reduce((a, b) => a + b, 0) || 0;
    const reservationWeeklyTotal = reservationTimeSeries?.reservation_this_week?.reduce((a, b) => a + b, 0) || 0;

    const bookingStatusTotal = reservationStatus.reduce((sum, item) => sum + item.value, 0);
    const checkinValue = reservationStatus.find(d => d.name === t('dashboard.checkin'))?.value ?? 0;
    const checkoutValue = reservationStatus.find(d => d.name === t('dashboard.checkout'))?.value ?? 0;

    const apartmentCleaningTotal = apartmentCleanliness.reduce((sum, item) => sum + item.value, 0);
    const notCleanValue = apartmentCleanliness.find(d => d.name === t('dashboard.notClean'))?.value ?? 0;
    const cleanValue = apartmentCleanliness.find(d => d.name === t('dashboard.clean'))?.value ?? 0;


    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-full p-4">
                <div className="bg-red-100 dark:bg-red-900/50 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            </div>
        );
    }


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCardsData.map((card, index) => (
                <StatCard key={index} title={card.title} value={card.value} color={card.color} icon={card.icon} />
            ))}

            <div className="md:col-span-2 lg:col-span-2">
                <DonutChartCard
                    title={t('dashboard.apartmentAvailability')}
                    data={apartmentAvailability}
                    centerLabel={t('dashboard.available')}
                    centerValue={apartmentAvailability.find(d => d.name === t('dashboard.available'))?.value ?? 0}
                    total={apartmentAvailabilityTotal}
                />
            </div>

            <div className="md:col-span-2 lg:col-span-2">
                <BarChartCard
                    title={t('dashboard.apartmentStats')}
                    data={weeklyStatsData}
                    barColor="#38bdf8"
                    stats={[
                        { label: t('dashboard.annualStats'), value: apartmentAnnualTotal },
                        { label: t('dashboard.monthlyStats'), value: apartmentMonthlyTotal },
                        { label: t('dashboard.weeklyStats'), value: apartmentWeeklyTotal },
                    ]}
                />
            </div>

            <div className="md:col-span-2 lg:col-span-4">
                <BarChartCard
                    title={t('dashboard.bookingStats')}
                    data={monthlyStatsData}
                    barColor="#f43f5e"
                    stats={[
                        { label: t('dashboard.annualStats'), value: reservationAnnualTotal },
                        { label: t('dashboard.monthlyStats'), value: reservationMonthlyTotal },
                        { label: t('dashboard.weeklyStats'), value: reservationWeeklyTotal },
                    ]}
                />
            </div>

            <div className="md:col-span-2 lg:col-span-2">
                <DonutChartCard
                    title={t('dashboard.bookingStatus')}
                    data={reservationStatus}
                    centerLabel={t('dashboard.checkout')}
                    centerValue={checkoutValue}
                    total={bookingStatusTotal}
                    stats={[
                        { label: t('dashboard.checkout'), value: checkoutValue },
                        { label: t('dashboard.checkin'), value: checkinValue },
                        { label: t('dashboard.dash'), value: 0 },
                    ]}
                />
            </div>

            <div className="md:col-span-2 lg:col-span-2">
                <DonutChartCard
                    title={t('dashboard.apartmentCleaning')}
                    data={apartmentCleanliness}
                    centerLabel={t('dashboard.notClean')}
                    centerValue={notCleanValue}
                    total={apartmentCleaningTotal}
                    stats={[
                        { label: t('dashboard.notClean'), value: notCleanValue },
                        { label: t('dashboard.clean'), value: cleanValue },
                        { label: t('dashboard.dash'), value: 0 },
                    ]}
                />
            </div>
        </div>
    );
};

export default Dashboard;