import { useState } from 'react';
import client from '../api/client';
import { Search, Brain } from 'lucide-react';

export default function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!resumeText) return;
    setLoading(true);
    setResult(null);
    try {
      // API call to mock gateway
      const res = await client.post('/api/aiops/resume/analyze', { resume: resumeText });
      
      // Simulate rich UI data returning from the mock backend
      setResult({
        summary: res.data.analysis,
        recommendation: "Proceed to Technical Interview",
        score: 85,
        skills: ["Docker", "Kubernetes", "Node.js", "React", "AWS"]
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center space-x-3">
        <Brain className="text-blue-500" size={28} />
        <h2 className="text-2xl font-bold text-white">AI Resume Analyzer</h2>
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">Paste Resume Text</label>
        <textarea
          rows={8}
          className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Paste the candidate's resume content here..."
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
        ></textarea>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={loading || !resumeText}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors font-medium"
          >
            <Search size={18} />
            <span>{loading ? 'Analyzing...' : 'Analyze Resume'}</span>
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 space-y-6 animate-fade-in">
          <h3 className="text-xl font-semibold text-white border-b border-gray-700 pb-3">Analysis Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div>
                <h4 className="text-sm text-gray-400 font-medium uppercase tracking-wider mb-1">AI Summary</h4>
                <p className="text-gray-200">{result.summary}</p>
              </div>
              <div>
                <h4 className="text-sm text-gray-400 font-medium uppercase tracking-wider mb-1">Recommendation</h4>
                <p className="text-green-400 font-medium">{result.recommendation}</p>
              </div>
            </div>
            
            <div className="bg-gray-900 p-4 rounded-lg flex flex-col items-center justify-center border border-gray-700">
              <span className="text-sm text-gray-400 uppercase tracking-wider mb-2">Match Score</span>
              <div className="relative w-24 h-24 flex items-center justify-center rounded-full border-4 border-blue-500">
                <span className="text-3xl font-bold text-white">{result.score}%</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm text-gray-400 font-medium uppercase tracking-wider mb-2">Detected Skills</h4>
            <div className="flex flex-wrap gap-2">
              {result.skills.map(skill => (
                <span key={skill} className="px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full text-sm font-medium border border-blue-800">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
