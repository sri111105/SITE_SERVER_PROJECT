import React, { useState, useEffect } from 'react';
import SurveyService from '../services/survey.service';
import { Plus, Layers, Upload, FileText } from 'lucide-react';

const FloorManager = ({ buildingId }) => {
    const [floors, setFloors] = useState([]);
    const [newFloor, setNewFloor] = useState({ name: '', level: 0, buildingId: buildingId });
    const [showForm, setShowForm] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [previewImages, setPreviewImages] = useState({});

    useEffect(() => {
        loadFloors();
    }, [buildingId]);

    const loadFloors = async () => {
        try {
            const response = await SurveyService.getFloors(buildingId);
            setFloors(response.data);
            // Ideally check if floor plans exist and load previews or indicators
        } catch (error) {
            console.error("Error loading floors:", error);
        }
    };

    const handleCreateFloor = async (e) => {
        e.preventDefault();
        try {
            await SurveyService.createFloor({ ...newFloor, buildingId });
            setNewFloor({ name: '', level: 0, buildingId: buildingId });
            setShowForm(false);
            loadFloors();
        } catch (error) {
            console.error("Error creating floor:", error);
        }
    };

    const handleFileUpload = async (floorId, file) => {
        if (!file) return;
        setUploading(true);
        try {
            await SurveyService.uploadFloorPlan(floorId, file);
            alert("Floor plan uploaded successfully!");
            // Refresh logic if needed
        } catch (error) {
            console.error("Error uploading floor plan:", error);
            alert("Upload failed.");
        } finally {
            setUploading(false);
        }
    };

    const handleViewPlan = async (floorId) => {
        try {
            const response = await SurveyService.getFloorPlan(floorId);
            const imageUrl = URL.createObjectURL(response.data);
            setPreviewImages(prev => ({ ...prev, [floorId]: imageUrl }));
        } catch (error) {
            alert("No floor plan found or error loading it.");
        }
    }

    return (
        <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-bold text-gray-800">Floors</h4>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn-primary text-xs flex items-center px-3 py-1"
                >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Floor
                </button>
            </div>

            {showForm && (
                <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
                    <form onSubmit={handleCreateFloor} className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-700 mb-1">Floor Name</label>
                            <input
                                type="text"
                                placeholder="Floor Name (e.g. 1st Floor)"
                                className="input-field"
                                value={newFloor.name}
                                onChange={(e) => setNewFloor({ ...newFloor, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="w-24">
                            <label className="block text-xs font-medium text-gray-700 mb-1">Level</label>
                            <input
                                type="number"
                                placeholder="0"
                                className="input-field"
                                value={newFloor.level}
                                onChange={(e) => setNewFloor({ ...newFloor, level: parseInt(e.target.value) })}
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary whitespace-nowrap h-10">Save</button>
                    </form>
                </div>
            )}

            <div className="space-y-4">
                {floors.map(floor => (
                    <div
                        key={floor.id}
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <Layers className="h-5 w-5 text-primary mr-3" />
                                <div>
                                    <h5 className="font-bold text-gray-900">{floor.name}</h5>
                                    <span className="text-xs text-gray-500">Level {floor.level}</span>
                                </div>
                            </div>
                            <label className="cursor-pointer btn-primary text-xs px-3 py-1 flex items-center">
                                <Upload className="h-3 w-3 mr-2" />
                                {uploading ? 'Uploading...' : 'Upload Plan'}
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*,application/pdf"
                                    onChange={(e) => handleFileUpload(floor.id, e.target.files[0])}
                                    disabled={uploading}
                                />
                            </label>
                        </div>

                        <div className="mt-4 border-t border-gray-100 pt-4">
                            <button
                                onClick={() => handleViewPlan(floor.id)}
                                className="text-sm text-primary hover:underline flex items-center"
                            >
                                <FileText className="h-4 w-4 mr-2" />
                                View Current Floor Plan
                            </button>

                            {previewImages[floor.id] && (
                                <div className="mt-4 p-2 bg-gray-100 rounded border border-gray-300">
                                    <img src={previewImages[floor.id]} alt="Floor Plan" className="max-w-full h-auto rounded" />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {floors.length === 0 && (
                    <p className="text-gray-500 italic">No floors found.</p>
                )}
            </div>
        </div>
    );
};

export default FloorManager;
