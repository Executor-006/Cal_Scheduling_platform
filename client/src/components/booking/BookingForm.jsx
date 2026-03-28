import { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

export default function BookingForm({ onSubmit, loading, customQuestions = [] }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [answers, setAnswers] = useState(
    customQuestions.map(q => ({ question: q.label, answer: '' }))
  );
  const [error, setError] = useState('');

  const updateAnswer = (index, value) => {
    setAnswers(prev => prev.map((a, i) => i === index ? { ...a, answer: value } : a));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await onSubmit({ name, email, answers: answers.filter(a => a.answer.trim()) });
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.errors?.join(', ') || 'Failed to book. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}
      <Input
        label="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="John Smith"
        required
      />
      <Input
        label="Email Address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="john@example.com"
        required
      />

      {/* Custom questions */}
      {customQuestions.map((q, i) => (
        <div key={i}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {q.label}{q.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {q.type === 'textarea' ? (
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              rows={3}
              value={answers[i]?.answer || ''}
              onChange={(e) => updateAnswer(i, e.target.value)}
              required={q.required}
            />
          ) : (
            <input
              type={q.type === 'phone' ? 'tel' : 'text'}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              value={answers[i]?.answer || ''}
              onChange={(e) => updateAnswer(i, e.target.value)}
              required={q.required}
            />
          )}
        </div>
      ))}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Booking...' : 'Confirm Booking'}
      </Button>
    </form>
  );
}
