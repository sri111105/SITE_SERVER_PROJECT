import api from './api';

const getAllProperties = () => {
    return api.get('/survey/properties');
};

const createProperty = (property) => {
    return api.post('/survey/properties', property);
};

const getBuildings = (propertyId) => {
    return api.get(`/survey/properties/${propertyId}/buildings`);
};

const createBuilding = (building) => {
    return api.post('/survey/buildings', building);
};

const getFloors = (buildingId) => {
    return api.get(`/survey/buildings/${buildingId}/floors`);
};

const createFloor = (floor) => {
    return api.post('/survey/floors', floor);
};

const uploadFloorPlan = (floorId, file) => {
    let formData = new FormData();
    formData.append("file", file);

    return api.post(`/floor-plans/upload/${floorId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

const getFloorPlan = (floorId) => {
    return api.get(`/floor-plans/view/${floorId}`, { responseType: 'blob' });
}

const getTemplates = () => {
    return api.get('/checklists');
}

const createSurvey = (propertyId, name) => {
    return api.post(`/survey/create?propertyId=${propertyId}&name=${name}`);
}

const getMySurveys = () => {
    return api.get('/survey/my-surveys');
}

const submitResponse = (surveyId, response) => {
    return api.post(`/survey/${surveyId}/responses`, response);
}

const SurveyService = {
    getAllProperties,
    createProperty,
    getBuildings,
    createBuilding,
    getFloors,
    createFloor,
    uploadFloorPlan,
    getFloorPlan,
    getTemplates,
    createSurvey,
    getMySurveys,
    submitResponse
};

export default SurveyService;
