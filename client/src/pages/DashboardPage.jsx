import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import NutritionChart from '../components/NutritionChart';
import TaskItem from '../components/TaskItem';
import WeightLogModal from '../components/WeightLogModal';
import ReportModal from '../components/ReportModal';
import WeightChart from '../components/WeightChart';

// Helper function to calculate the current day of the plan
const getCurrentDayIndex = (planStartDate) => {
  if (!planStartDate) return 0;
  const start = new Date(planStartDate);
  const today = new Date();
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffTime = Math.abs(today - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 27 ? 27 : diffDays;
};

const DashboardPage = () => {
  const [plan, setPlan] = useState(null);
  const [planCreatedAt, setPlanCreatedAt] = useState(null);
  const [progressData, setProgressData] = useState({ progress: [], weight: [] });
  const [todaysPlan, setTodaysPlan] = useState(null);
  const [todaysProgress, setTodaysProgress] = useState({ completedMeals: [], completedExercise: false });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [userName, setUserName] = useState('');

  const fetchData = async () => {
    setIsLoading(true);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
      setError('You must be logged in.');
      setIsLoading(false);
      return;
    }
    setUserName(userInfo.name);

    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const [planResponse, progressResponse] = await Promise.all([
        axios.get('http://localhost:5001/api/plan', config),
        axios.get('http://localhost:5001/api/progress/dashboard', config)
      ]);

      const planData = planResponse.data.planData;
      const createdAt = planResponse.data.createdAt;
      setPlan(planData);
      setPlanCreatedAt(createdAt);
      setProgressData(progressResponse.data);

      const dayIndex = getCurrentDayIndex(createdAt);
      const weekIndex = Math.floor(dayIndex / 7);
      const dayOfWeekIndex = dayIndex % 7;
      setTodaysPlan(planData?.weeklyPlan[weekIndex]?.dailyPlan[dayOfWeekIndex]);

      const todayStr = new Date().toISOString().split('T')[0];
      const foundProgress = progressResponse.data.progress.find(p => p.date.startsWith(todayStr));
      if (foundProgress) setTodaysProgress(foundProgress);

    } catch (err) {
      setError('Could not fetch your dashboard data. Please complete onboarding.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTaskToggle = async (taskType, taskName) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

    let updatedProgress;
    if (taskType === 'meal') {
      const isCompleted = todaysProgress.completedMeals.includes(taskName);
      updatedProgress = {
        ...todaysProgress,
        completedMeals: isCompleted
          ? todaysProgress.completedMeals.filter(m => m !== taskName)
          : [...todaysProgress.completedMeals, taskName]
      };
      setTodaysProgress(updatedProgress);
      await axios.post('http://localhost:5001/api/progress/log', { completedMeal: taskName }, config);
    } else if (taskType === 'exercise') {
      updatedProgress = { ...todaysProgress, completedExercise: !todaysProgress.completedExercise };
      setTodaysProgress(updatedProgress);
      await axios.post('http://localhost:5001/api/progress/log', { completedExercise: !todaysProgress.completedExercise }, config);
    }
  };

  const dayIndex = getCurrentDayIndex(planCreatedAt);

  if (isLoading) return <div className="text-center py-20"><p>Loading Your Personalized Dashboard...</p></div>;
  if (error || !todaysPlan) return <div className="text-center py-20"><p className="text-red-500">{error || 'Could not load today\'s plan.'}</p><Link to="/onboarding" className="text-primary font-semibold hover:underline mt-2 inline-block">Go to Onboarding</Link></div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold">Welcome back, {userName}!</h1>
          <p className="text-gray-600">Here's your plan for today, {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-secondary">
              <h2 className="text-2xl font-bold mb-4">Today's Plan (Day {dayIndex + 1} of 28)</h2>
              <div className="space-y-3">
                <TaskItem task={todaysPlan.meals.breakfast} type="Breakfast" isCompleted={todaysProgress.completedMeals.includes('breakfast')} onToggle={() => handleTaskToggle('meal', 'breakfast')} />
                <TaskItem task={todaysPlan.meals.lunch} type="Lunch" isCompleted={todaysProgress.completedMeals.includes('lunch')} onToggle={() => handleTaskToggle('meal', 'lunch')} />
                <TaskItem task={todaysPlan.meals.dinner} type="Dinner" isCompleted={todaysProgress.completedMeals.includes('dinner')} onToggle={() => handleTaskToggle('meal', 'dinner')} />
                <TaskItem task={todaysPlan.meals.snack} type="Snack" isCompleted={todaysProgress.completedMeals.includes('snack')} onToggle={() => handleTaskToggle('meal', 'snack')} />
                <TaskItem task={todaysPlan.exercise} type="Exercise" isCompleted={todaysProgress.completedExercise} onToggle={() => handleTaskToggle('exercise')} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-secondary">
              <h2 className="text-2xl font-bold mb-4">Weight Progress</h2>
              <WeightChart data={progressData.weight} />
            </div>
          </div>
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-secondary">
              <h2 className="text-2xl font-bold mb-4">Today's Nutrition Summary</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <StatCard label="Calories" value={todaysPlan?.dailyTotals?.totalCalories} unit="kcal" />
                <StatCard label="Protein" value={todaysPlan?.dailyTotals?.totalProtein} unit="g" />
                <StatCard label="Carbs" value={todaysPlan?.dailyTotals?.totalCarbs} unit="g" />
                <StatCard label="Fat" value={todaysPlan?.dailyTotals?.totalFat} unit="g" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-center">Macro Distribution</h3>
              {todaysPlan?.dailyTotals && <NutritionChart data={todaysPlan.dailyTotals} />}
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-secondary">
              <h2 className="text-2xl font-bold mb-4">Actions</h2>
              <div className="space-y-3">
                <button onClick={() => setIsWeightModalOpen(true)} className="w-full text-left flex items-center gap-3 bg-gray-100 font-semibold py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                  <span>⚖️</span> Log Your Weight
                </button>
                <button onClick={() => setIsReportModalOpen(true)} className="w-full text-left flex items-center gap-3 bg-gray-100 font-semibold py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                  <span>📊</span> Generate Weekly Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <WeightLogModal isOpen={isWeightModalOpen} onClose={() => setIsWeightModalOpen(false)} onLogSuccess={fetchData} />
      <ReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} />
    </div>
  );
};

export default DashboardPage;