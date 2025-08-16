import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import NutritionChart from '../components/NutritionChart';
import TaskItem from '../components/TaskItem';
import WeightLogModal from '../components/WeightLogModal'; // 1. Import the new modal

const DashboardPage = () => {
  const [plan, setPlan] = useState(null);
  const [progress, setProgress] = useState(null);
  const [todaysPlan, setTodaysPlan] = useState(null);
  const [todaysProgress, setTodaysProgress] = useState({ completedMeals: [], completedExercise: false });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // 2. State for the modal

  const fetchData = async () => {
    // ... (fetchData function remains the same)
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
      setError('You must be logged in.');
      setIsLoading(false);
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

      const [planResponse, progressResponse] = await Promise.all([
        axios.post('http://localhost:5001/api/plan/generate', {}, config),
        axios.get('http://localhost:5001/api/progress/dashboard', config)
      ]);

      const planData = planResponse.data.planData;
      setPlan(planData);
      setProgress(progressResponse.data);

      const today = planData.weeklyPlan[0].dailyPlan[0];
      setTodaysPlan(today);

      const todayStr = new Date().toISOString().split('T')[0];
      const foundProgress = progressResponse.data.progress.find(p => p.date.startsWith(todayStr));
      if (foundProgress) {
        setTodaysProgress(foundProgress);
      }

    } catch (err) {
      setError('Could not fetch your dashboard data. Please complete onboarding.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 3. Implement the API call for toggling tasks
  const handleTaskToggle = async (taskType, taskName) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

    let updatedProgress;

    if (taskType === 'meal') {
      const isCompleted = todaysProgress.completedMeals.includes(taskName);
      // Immediately update UI for better user experience
      updatedProgress = {
        ...todaysProgress,
        completedMeals: isCompleted
          ? todaysProgress.completedMeals.filter(m => m !== taskName)
          : [...todaysProgress.completedMeals, taskName]
      };
      setTodaysProgress(updatedProgress);
      // Send API request
      await axios.post('http://localhost:5001/api/progress/log', { completedMeal: taskName }, config);
    } else if (taskType === 'exercise') {
      updatedProgress = { ...todaysProgress, completedExercise: !todaysProgress.completedExercise };
      setTodaysProgress(updatedProgress);
      // Send API request
      await axios.post('http://localhost:5001/api/progress/log', { completedExercise: !todaysProgress.completedExercise }, config);
    }
  };


  if (isLoading) return <div className="text-center py-20"><p>Loading Dashboard...</p></div>;
  if (error) return <div className="text-center py-20"><p className="text-red-500">{error}</p><Link to="/onboarding" className="text-primary font-semibold hover:underline mt-2 inline-block">Go to Onboarding</Link></div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold">Your Dashboard</h1>
        {/* 4. Add the "Log Weight" button */}
        <button onClick={() => setIsModalOpen(true)} className="bg-primary text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:opacity-90 transition-all">
          Log Weight
        </button>
      </div>

      {todaysPlan && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ... (Left and Right columns remain the same) ... */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Today's Plan (Day {todaysPlan.day.split(' ')[1]} of 28)</h2>
              <div className="space-y-3">
                <TaskItem task={todaysPlan.meals.breakfast} type="Breakfast" isCompleted={todaysProgress.completedMeals.includes('breakfast')} onToggle={() => handleTaskToggle('meal', 'breakfast')} />
                <TaskItem task={todaysPlan.meals.lunch} type="Lunch" isCompleted={todaysProgress.completedMeals.includes('lunch')} onToggle={() => handleTaskToggle('meal', 'lunch')} />
                <TaskItem task={todaysPlan.meals.dinner} type="Dinner" isCompleted={todaysProgress.completedMeals.includes('dinner')} onToggle={() => handleTaskToggle('meal', 'dinner')} />
                <TaskItem task={todaysPlan.meals.snack} type="Snack" isCompleted={todaysProgress.completedMeals.includes('snack')} onToggle={() => handleTaskToggle('meal', 'snack')} />
                <TaskItem task={todaysPlan.exercise} type="Exercise" isCompleted={todaysProgress.completedExercise} onToggle={() => handleTaskToggle('exercise')} />
              </div>
            </div>
          </div>
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Today's Nutrition</h2>
              <div className="grid grid-cols-2 gap-4">
                <StatCard label="Calories" value={todaysPlan.dailyTotals.totalCalories} unit="kcal" />
                <StatCard label="Protein" value={todaysPlan.dailyTotals.totalProtein} unit="g" />
                <StatCard label="Carbs" value={todaysPlan.dailyTotals.totalCarbs} unit="g" />
                <StatCard label="Fat" value={todaysPlan.dailyTotals.totalFat} unit="g" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">Macro Distribution</h2>
              <NutritionChart data={todaysPlan.dailyTotals} />
            </div>
          </div>
        </div>
      )}
      {/* 5. Render the modal */}
      <WeightLogModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onLogSuccess={fetchData} />
    </div>
  );
};

export default DashboardPage;