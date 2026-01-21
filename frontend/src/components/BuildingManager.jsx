import React, { useState, useEffect } from 'react';
import SurveyService from '../services/survey.service';
import { Plus, Home } from 'lucide-react';
import FloorManager from './FloorManager';

const BuildingManager = ({ propertyId }) => {
    const [buildings, setBuildings] = useState([]);
    const [newBuilding, setNewBuilding] = useState({ name: '', propertyId: propertyId });
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        loadBuildings();
    }, [propertyId]);

    const loadBuildings = async () => {
        try {
            const response = await SurveyService.getBuildings(propertyId);
            setBuildings(response.data);
        } catch (error) {
            console.error("Error loading buildings:", error);
        }
    };

    const handleCreateBuilding = async (e) => {
        e.preventDefault();
        try {
            await SurveyService.createBuilding({ ...newBuilding, propertyId });
            setNewBuilding({ name: '', propertyId: propertyId });
            setShowForm(false);
            loadBuildings();
        } catch (error) {
            console.error("Error creating building:", error);
        }
    };

    if (selectedBuilding) {
        return (
            <div>
                <button
                    onClick={() => setSelectedBuilding(null)}
                    className="mb-4 text-primary hover:underline flex items-center"
                >
                    &larr; Back to Buildings
                </button>
                <h3 className="text-xl font-bold mb-4">{selectedBuilding.name}</h3>
                <FloorManager buildingId={selectedBuilding.id} />
            </div>
        );
    }

    return (
        <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Buildings</h3>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn-primary text-sm flex items-center px-3 py-1"
                >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Building
                </button>
            </div>

            {showForm && (
                <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
                    <form onSubmit={handleCreateBuilding} className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Building Name"
                            className="input-field flex-1"
                            value={newBuilding.name}
                            onChange={(e) => setNewBuilding({ ...newBuilding, name: e.target.value })}
                            required
                        />
                        <button type="submit" className="btn-primary whitespace-nowrap">Save Building</button>
                    </form>
                </div>
            )}

            <div className="space-y-3">
                {buildings.map(building => (
                    <div
                        key={building.id}
                        className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-primary cursor-pointer flex items-center justify-between transition-colors"
                        onClick={() => setSelectedBuilding(building)}
                    >
                        <div className="flex items-center">
                            <Home className="h-5 w-5 text-gray-400 mr-3" />
                            <span className="font-medium text-gray-700">{building.name}</span>
                        </div>
                        <span className="text-sm text-primary font-medium">View Floors &rarr;</span>
                    </div>
                ))}
                {buildings.length === 0 && (
                    <p className="text-gray-500 italic">No buildings found. Add one to get started.</p>
                )}
            </div>
        </div>
    );
};

export default BuildingManager;
