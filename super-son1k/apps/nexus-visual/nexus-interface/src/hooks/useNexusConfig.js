import { useState, useEffect } from 'react';
import config from '../config/nexus-config.json';

export const useNexusConfig = () => {
  const [nexusConfig, setNexusConfig] = useState(config);

  const updateConfig = (section, key, value) => {
    setNexusConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const resetConfig = () => {
    setNexusConfig(config);
  };

  return {
    config: nexusConfig,
    updateConfig,
    resetConfig
  };
};