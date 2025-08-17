import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// --- Helper Components for a cleaner UI ---

// Card component for selectable options
const OptionCard = ({ title, description, isSelected, onClick }) => (
  <div
    onClick={onClick}
    className={`p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 ${isSelected ? 'border-primary shadow-lg scale-105' : 'border-secondary hover:border-gray-400'
      }`}
  >
    <h3 className="font-bold text-lg">{title}</h3>
    <p className="text-sm text-gray-600 mt-1">{description}</p>
  </div>
);

// Progress bar component
const ProgressBar = ({ step }) => (
  <div className="w-full bg-secondary rounded-full h-2.5 mb-8">
    <div
      className="bg-primary h-2.5 rounded-full transition-all duration-500"
      style={{ width: `${(step / 4) * 100}%` }}
    ></div>
  </div>
);


const OnboardingPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    goal: 'Weight Loss',
    diet: 'No Restrictions',
    activityLevel: 'Lightly Active',
    healthNotes: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { goal, diet, activityLevel, healthNotes } = formData;

  const setFormValue = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    setIsLoading(true); // Show "Generating Plan..." on the button
    setError(null);
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

      // First, save the profile
      await axios.post('http://localhost:5001/api/profile', formData, config);

      // THEN, generate the plan
      await axios.post('http://localhost:5001/api/plan/generate', {}, config);

      navigate('/dashboard'); // Now navigate to the dashboard
    } catch (err) {
      setError('Failed to create your plan. Please try again.');
      setIsLoading(false);
    }
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto bg-white p-8 md:p-12 border border-secondary rounded-lg shadow-2xl">
        <ProgressBar step={step} />

        {error && <p className="text-center text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}

        {/* Step 1: Goal */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-center mb-6">What's Your Primary Goal?</h2>
            <div className="grid grid-cols-1 gap-4">
              <OptionCard title="Weight Loss" description="Create a calorie deficit plan." isSelected={goal === 'Weight Loss'} onClick={() => setFormValue('goal', 'Weight Loss')} />
              <OptionCard title="Muscle Gain" description="Focus on protein and strength." isSelected={goal === 'Muscle Gain'} onClick={() => setFormValue('goal', 'Muscle Gain')} />
              <OptionCard title="Maintain Health" description="Balance nutrients for wellness." isSelected={goal === 'Maintain Health'} onClick={() => setFormValue('goal', 'Maintain Health')} />
            </div>
          </div>
        )}

        {/* Step 2: Diet */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-center mb-6">Any Dietary Preferences?</h2>
            <div className="grid grid-cols-1 gap-4">
              <OptionCard title="No Restrictions" description="I eat everything." isSelected={diet === 'No Restrictions'} onClick={() => setFormValue('diet', 'No Restrictions')} />
              <OptionCard title="Vegetarian" description="No meat or fish." isSelected={diet === 'Vegetarian'} onClick={() => setFormValue('diet', 'Vegetarian')} />
              <OptionCard title="Vegan" description="No animal products at all." isSelected={diet === 'Vegan'} onClick={() => setFormValue('diet', 'Vegan')} />
            </div>
          </div>
        )}

        {/* Step 3: Activity Level */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-center mb-6">How Active Are You?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <OptionCard title="Sedentary" description="Little to no exercise." isSelected={activityLevel === 'Sedentary'} onClick={() => setFormValue('activityLevel', 'Sedentary')} />
              <OptionCard title="Lightly Active" description="1-3 days/week." isSelected={activityLevel === 'Lightly Active'} onClick={() => setFormValue('activityLevel', 'Lightly Active')} />
              <OptionCard title="Moderately Active" description="3-5 days/week." isSelected={activityLevel === 'Moderately Active'} onClick={() => setFormValue('activityLevel', 'Moderately Active')} />
              <OptionCard title="Very Active" description="6-7 days/week." isSelected={activityLevel === 'Very Active'} onClick={() => setFormValue('activityLevel', 'Very Active')} />
            </div>
          </div>
        )}

        {/* Step 4: Health Notes */}
        {step === 4 && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-center mb-6">Any Health Notes?</h2>
            <p className="text-center text-gray-600 mb-4">List any allergies, conditions, or things to avoid. (Optional)</p>
            <textarea
              name="healthNotes"
              value={healthNotes}
              onChange={(e) => setFormValue('healthNotes', e.target.value)}
              placeholder="e.g., Allergic to peanuts, lactose intolerant, avoid spicy food..."
              className="w-full h-32 p-3 border border-secondary rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between items-center">
          <button onClick={prevStep} disabled={step === 1} className="font-semibold text-gray-600 disabled:opacity-50">
            Back
          </button>
          {step < 4 ? (
            <button onClick={nextStep} className="bg-primary text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:opacity-90 transition-all">
              Next
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={isLoading} className="bg-primary text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:opacity-90 transition-all disabled:opacity-50">
              {isLoading ? 'Generating Plan...' : 'Create My Plan'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
