
export const preloadTextures = () => {
  const textureURLs = [
    "/textures/earth_daymap.jpg",
    "/textures/earth_normal_map.jpg",
    "/textures/earth_specular_map.jpg",
    "/textures/earth_clouds.jpg"
  ];

  textureURLs.forEach(url => {
    const img = new Image();
    img.src = url;
  });
};
