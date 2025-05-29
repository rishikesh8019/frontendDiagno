import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
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

        try {
            const response = await axios.post('https://drug-design-99q9.onrender.com/predict/vit', { SMILES: smiles });
            setResult(response.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main-container d-flex justify-content-center align-items-center min-vh-100">
            <div className="card p-4 shadow-lg custom-card">
                <h1 className="text-center mb-4 gradient-text">Drug Design ViT Predictor</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="smilesInput" className="form-label">Enter SMILES:</label>
                        <input
                            type="text"
                            id="smilesInput"
                            className="form-control input-custom"
                            value={smiles}
                            onChange={(e) => setSmiles(e.target.value)}
                            placeholder="e.g., CCO"
                            required
                        />
                    </div>
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                            {loading ? 'Predicting...' : 'Predict'}
                        </button>
                    </div>
                </form>

                {error && <div className="alert alert-danger mt-3">{error}</div>}

                {result && (
                    <div className="result-card mt-4 p-3 border rounded">
                        <h5 className="mb-3">Prediction Result</h5>
                        <p><strong>SMILES:</strong> {result.smiles}</p>
                        <p><strong>Activity:</strong> {result.activity}</p>
                        {result.image && (
                            <div>
                                <strong>Structure:</strong>
                                <img
                                    src={`data:image/png;base64,${result.image}`}
                                    alt="Molecular Structure"
                                    className="img-fluid mt-2 result-image"
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
