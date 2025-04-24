
// Array of textures that need to be preloaded
const EARTH_TEXTURES = {
  dayMap: "/textures/earth_daymap.jpg",
  normalMap: "/textures/earth_normal_map.jpg",
  specularMap: "/textures/earth_specular_map.jpg",
  clouds: "/textures/earth_clouds.jpg"
};

// Fallback textures (simple colors) if the original textures can't be loaded
const FALLBACK_TEXTURES = {
  dayMap: "blue",
  normalMap: "#444444",
  specularMap: "#333333", 
  clouds: "white"
};

export const preloadTextures = () => {
  // Preload all textures and set up error handling
  Object.values(EARTH_TEXTURES).forEach(url => {
    const img = new Image();
    img.onerror = () => {
      console.warn(`Failed to preload texture: ${url}. Will use fallback.`);
    };
    img.src = url;
  });
};

// Export texture paths for easy access
export const getTexturePaths = () => {
  return {
    ...EARTH_TEXTURES,
    fallbacks: FALLBACK_TEXTURES
  };
};
