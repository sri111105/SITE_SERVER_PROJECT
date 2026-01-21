import React, { useState, useEffect } from 'react';
import SurveyService from '../services/survey.service';
import { ClipboardCheck, CheckSquare, Camera } from 'lucide-react';

const SurveyExecution = () => {
    const [surveys, setSurveys] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [activeSurvey, setActiveSurvey] = useState(null);
    const [responses, setResponses] = useState({});

    useEffect(() => {
        loadMySurveys();
        loadTemplates();
    }, []);

    const loadMySurveys = async () => {
        try {
            const res = await SurveyService.getMySurveys();
            setSurveys(res.data);
        } catch (e) { console.error(e); }
    };

    const loadTemplates = async () => {
        try {
            const res = await SurveyService.getTemplates();
            setTemplates(res.data);
        } catch (e) { console.error(e); }
    };

    const handleStartSurvey = (survey) => {
        setActiveSurvey(survey);
        // Reset responses or load existing ones (simplified here)
        setResponses({});
    };

    const handleAnswerChange = (itemId, value) => {
        setResponses(prev => ({
            ...prev,
            [itemId]: value
        }));
    };

    const handleSubmitResponse = async (item, value) => {
        try {
            await SurveyService.submitResponse(activeSurvey.id, {
                item: { id: item.id },
                responseValue: value
            });
            alert("Response saved!");
        } catch (e) {
            console.error(e);
            alert("Failed to save response");
        }
    };

    if (activeSurvey) {
        // Assuming we use the first template for demo
        const template = templates.length > 0 ? templates[0] : null;

        return (
            <div className="p-6 bg-white rounded-xl shadow-lg m-4">
                <button
                    onClick={() => setActiveSurvey(null)}
                    className="mb-4 text-primary hover:underline"
                >
                    &larr; Back to My Surveys
                </button>
                <h2 className="text-2xl font-bold mb-2">Surveying: {activeSurvey.name}</h2>
                <p className="text-gray-500 mb-6">Property: {activeSurvey.property?.name}</p>

                {template ? (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold">{template.name}</h3>
                        {template.items.map(item => (
                            <div key={item.id} className="p-4 border rounded-lg bg-gray-50">
                                <label className="block text-sm font-medium text-gray-700 mb-2">{item.question}</label>
                                {item.type === 'YES_NO' && (
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => handleAnswerChange(item.id, 'YES')}
                                            className={`px-4 py-2 rounded ${responses[item.id] === 'YES' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                                        >
                                            Yes
                                        </button>
                                        <button
                                            onClick={() => handleAnswerChange(item.id, 'NO')}
                                            className={`px-4 py-2 rounded ${responses[item.id] === 'NO' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                                        >
                                            No
                                        </button>
                                        <button
                                            onClick={() => handleSubmitResponse(item, responses[item.id])}
                                            className="ml-auto text-sm text-primary underline"
                                        >
                                            Save
                                        </button>
                                    </div>
                                )}
                                {item.type === 'NUMBER' && (
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            className="input-field"
                                            onChange={(e) => handleAnswerChange(item.id, e.target.value)}
                                        />
                                        <button
                                            onClick={() => handleSubmitResponse(item, responses[item.id])}
                                            className="btn-primary"
                                        >
                                            Save
                                        </button>
                                    </div>
                                )}
                                {item.type === 'PHOTO' && (
                                    <div className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg bg-white">
                                        <div className="text-center">
                                            <Camera className="mx-auto h-12 w-12 text-gray-400" />
                                            <p className="mt-1 text-sm text-gray-500">Tap to take photo (Simulated)</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No checklist template available.</p>
                )}
            </div>
        );
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Assigned Surveys</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {surveys.map(survey => (
                    <div
                        key={survey.id}
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
                        onClick={() => handleStartSurvey(survey)}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{survey.name}</h3>
                                <p className="text-sm text-gray-500 mt-1">Status: <span className="text-blue-600 font-medium">{survey.status}</span></p>
                                <p className="text-sm text-gray-500">Property: {survey.property?.name}</p>
                            </div>
                            <div className="p-2 bg-green-50 rounded-lg">
                                <ClipboardCheck className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                ))}

                {surveys.length === 0 && (
                    <div className="col-span-1 md:col-span-2 text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                        <CheckSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500">No active surveys assigned to you.</p>
                        <p className="text-sm text-gray-400">Ask an admin to assign a survey.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SurveyExecution;
