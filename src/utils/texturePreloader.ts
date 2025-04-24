// Array of textures that need to be preloaded
const EARTH_TEXTURES = {
  dayMap: "/textures/earth_daymap.jpg",
  normalMap: "/textures/earth_normal_map.jpg",
  specularMap: "/textures/earth_specular_map.jpg",
  clouds: "/textures/earth_clouds.jpg"
};

// Fallback textures (simple colors) if the original textures can't be loaded
const FALLBACK_TEXTURES = {
  dayMap: "#0077be", // Deep blue
  normalMap: "#444444",
  specularMap: "#333333", 
  clouds: "white"
};

// Keep track of loaded textures and errors
const textureStatus = {
  loaded: [] as string[],
  failed: [] as string[]
};

/**
 * Preload all textures with robust error handling
 */
export const preloadTextures = () => {
  // Log texture preloading start
  console.log('Starting texture preloading process...');
  
  // Create promises for all texture loading operations
  const loadPromises = Object.entries(EARTH_TEXTURES).map(([key, url]) => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      
      img.onload = () => {
        console.log(`✓ Successfully preloaded texture: ${key} (${url})`);
        textureStatus.loaded.push(key);
        resolve();
      };
      
      img.onerror = () => {
        console.warn(`✗ Failed to preload texture: ${key} (${url}). Will use fallback.`);
        textureStatus.failed.push(key);
        resolve(); // Resolve anyway to continue the flow
      };
      
      // Start loading the image
      img.src = url;
    });
  });
  
  // When all textures are attempted to be loaded
  Promise.all(loadPromises)
    .then(() => {
      console.log('Texture preloading complete.');
      console.log(`Successfully loaded: ${textureStatus.loaded.length}/${Object.keys(EARTH_TEXTURES).length} textures`);
      
      if (textureStatus.failed.length > 0) {
        console.warn(`Failed textures: ${textureStatus.failed.join(', ')}`);
        console.warn('Using fallback colors for failed textures');
      }
    })
    .catch(error => {
      console.error('Unexpected error during texture preloading:', error);
    });
};

// Export texture paths for easy access
export const getTexturePaths = () => {
  return {
    ...EARTH_TEXTURES,
    fallbacks: FALLBACK_TEXTURES
  };
};

/**
 * Check if a specific texture has been successfully loaded
 * @param textureName Name of the texture to check
 */
export const isTextureLoaded = (textureName: string) => {
  return textureStatus.loaded.includes(textureName);
};

/**
 * Get the appropriate texture path or fallback
 * @param textureName Name of the texture to get
 */
export const getTexture = (textureName: keyof typeof EARTH_TEXTURES) => {
  if (textureStatus.failed.includes(textureName)) {
    return FALLBACK_TEXTURES[textureName];
  }
  return EARTH_TEXTURES[textureName];
};
