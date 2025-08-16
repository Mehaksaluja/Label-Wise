const TaskItem = ({ task, type, isCompleted, onToggle }) => {
  const isExercise = type === 'Exercise';
  const title = isExercise ? task.activity : task.name;
  const details = isExercise
    ? `Duration: ${task.duration} | Est. Burn: ${task.caloriesBurned} kcal`
    : `Est: ${task.calories} kcal | P:${task.protein}g C:${task.carbs}g F:${task.fat}g`;

  return (
    <div className="flex items-start p-4 bg-white rounded-lg shadow-sm border border-secondary">
      <input
        type="checkbox"
        checked={isCompleted}
        onChange={onToggle}
        className="h-6 w-6 mt-1 rounded-md border-gray-300 text-primary focus:ring-primary flex-shrink-0"
      />
      <div className="ml-4">
        <p className="font-semibold text-gray-500 text-sm">{type}</p>
        <p className={`font-bold transition-colors ${isCompleted ? 'text-gray-400 line-through' : 'text-text'}`}>
          {title}
        </p>
        <p className={`text-sm transition-colors ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-600'}`}>
          {details}
        </p>
      </div>
    </div>
  );
};

export default TaskItem;