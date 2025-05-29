import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [smiles, setSmiles] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setResult(null);
        setLoading(true);

        // Basic SMILES validation
        if (!smiles || !/^[A-Za-z0-9@+\-\[\]\(\)\\\/=#+$%*]*$/.test(smiles)) {
            setError('Please enter a valid SMILES string');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('https://drug-design-99q9.onrender.com/predict/vit/predict/vit', { SMILES: smiles });
            setResult(response.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'An error occurred while fetching the prediction');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg">
                <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">Drug Design ViT Predictor</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="smilesInput" className="block text-sm font-medium text-gray-700 mb-1">
                            Enter SMILES String
                        </label>
                        <input
                            type="text"
                            id="smilesInput"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={smiles}
                            onChange={(e) => setSmiles(e.target.value)}
                            placeholder="e.g., CCO"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className={`w-full py-2 px-4 rounded-lg text-white font-semibold transition-all duration-300 ${
                            loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'
                        }`}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg
                                    className="animate-spin h-5 w-5 mr-2 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8H4z"
                                    ></path>
                                </svg>
                                Predicting...
                            </span>
                        ) : (
                            'Predict'
                        )}
                    </button>
                </form>

                {error && (
                    <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
                        {error}
                    </div>
                )}

                {result && (
                    <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Prediction Result</h2>
                        <p className="text-gray-700">
                            <strong>SMILES:</strong> {result.smiles}
                        </p>
                        <p className="text-gray-700 mt-2">
                            <strong>Activity:</strong>{' '}
                            <span
                                className={`inline-block px-2 py-1 rounded ${
                                    result.activity === 'active'
                                        ? 'bg-green-100 text-green-700'
                                        : result.activity === 'inactive'
                                        ? 'bg-red-100 text-red-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                }`}
                            >
                                {result.activity}
                            </span>
                        </p>
                        {result.image && (
                            <div className="mt-4">
                                <p className="text-gray-700 font-medium">Structure:</p>
                                <img
                                    src={`data:image/png;base64,${result.image}`}
                                    alt="Molecular Structure"
                                    className="mt-2 mx-auto rounded-lg shadow-md max-w-xs"
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
