import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  environmentalMetrics: null,
  socialMetrics: null,
  governanceMetrics: null,
  kpiMetrics: null,
  loading: false,
  error: null,
};

// Action types
const SIMULATION_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_ENVIRONMENTAL_METRICS: 'SET_ENVIRONMENTAL_METRICS',
  SET_SOCIAL_METRICS: 'SET_SOCIAL_METRICS',
  SET_GOVERNANCE_METRICS: 'SET_GOVERNANCE_METRICS',
  SET_KPI_METRICS: 'SET_KPI_METRICS',
  RESET_SIMULATION: 'RESET_SIMULATION',
  UPDATE_METRIC: 'UPDATE_METRIC',
};

// Reducer
const simulationReducer = (state, action) => {
  switch (action.type) {
    case SIMULATION_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case SIMULATION_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case SIMULATION_ACTIONS.SET_ENVIRONMENTAL_METRICS:
      return {
        ...state,
        environmentalMetrics: action.payload,
        loading: false,
        error: null,
      };
    case SIMULATION_ACTIONS.SET_SOCIAL_METRICS:
      return {
        ...state,
        socialMetrics: action.payload,
        loading: false,
        error: null,
      };
    case SIMULATION_ACTIONS.SET_GOVERNANCE_METRICS:
      return {
        ...state,
        governanceMetrics: action.payload,
        loading: false,
        error: null,
      };
    case SIMULATION_ACTIONS.SET_KPI_METRICS:
      return {
        ...state,
        kpiMetrics: action.payload,
        loading: false,
        error: null,
      };
    case SIMULATION_ACTIONS.UPDATE_METRIC:
      const { category, metric, value } = action.payload;
      return {
        ...state,
        [`${category}Metrics`]: {
          ...state[`${category}Metrics`],
          [metric]: value,
        },
      };
    case SIMULATION_ACTIONS.RESET_SIMULATION:
      return initialState;
    default:
      return state;
  }
};

// Create context
const SimulationContext = createContext();

// Provider component
export const LiveProvider = ({ children }) => {
  const [state, dispatch] = useReducer(simulationReducer, initialState);

  // Action creators
  const setLoading = (loading) => {
    dispatch({ type: SIMULATION_ACTIONS.SET_LOADING, payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: SIMULATION_ACTIONS.SET_ERROR, payload: error });
  };

  const setEnvironmentalMetrics = (metrics) => {
    dispatch({ type: SIMULATION_ACTIONS.SET_ENVIRONMENTAL_METRICS, payload: metrics });
  };

  const setSocialMetrics = (metrics) => {
    dispatch({ type: SIMULATION_ACTIONS.SET_SOCIAL_METRICS, payload: metrics });
  };

  const setGovernanceMetrics = (metrics) => {
    dispatch({ type: SIMULATION_ACTIONS.SET_GOVERNANCE_METRICS, payload: metrics });
  };

  const setKPIMetrics = (metrics) => {
    dispatch({ type: SIMULATION_ACTIONS.SET_KPI_METRICS, payload: metrics });
  };

  const updateMetric = (category, metric, value) => {
    dispatch({ type: SIMULATION_ACTIONS.UPDATE_METRIC, payload: { category, metric, value } });
  };

  const resetSimulation = () => {
    dispatch({ type: SIMULATION_ACTIONS.RESET_SIMULATION });
  };

  // Load saved data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('simulationData');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.environmentalMetrics) {
          setEnvironmentalMetrics(parsed.environmentalMetrics);
        }
        if (parsed.socialMetrics) {
          setSocialMetrics(parsed.socialMetrics);
        }
        if (parsed.governanceMetrics) {
          setGovernanceMetrics(parsed.governanceMetrics);
        }
        if (parsed.kpiMetrics) {
          setKPIMetrics(parsed.kpiMetrics);
        }
      }
    } catch (error) {
      console.warn('Failed to load simulation data from localStorage:', error);
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    try {
      const dataToSave = {
        environmentalMetrics: state.environmentalMetrics,
        socialMetrics: state.socialMetrics,
        governanceMetrics: state.governanceMetrics,
        kpiMetrics: state.kpiMetrics,
      };
      localStorage.setItem('simulationData', JSON.stringify(dataToSave));
    } catch (error) {
      console.warn('Failed to save simulation data to localStorage:', error);
    }
  }, [state]);

  const value = {
    ...state,
    setLoading,
    setError,
    setEnvironmentalMetrics,
    setSocialMetrics,
    setGovernanceMetrics,
    setKPIMetrics,
    updateMetric,
    resetSimulation,
  };

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
};

// Hook to use the context
export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};

export default SimulationContext;
