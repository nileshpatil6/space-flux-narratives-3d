
# Tell Us a Climate Story

An interactive web application that visualizes climate data and greenhouse gas emissions using 3D graphics, animations, and data visualization.

## Overview

This project creates an immersive storytelling experience about climate change through:

- Interactive 3D globe visualization with Three.js
- Data-driven charts and graphs
- Scroll-triggered animations
- Responsive design for all devices

## Features

- **3D Earth Visualization**: Interactive globe with texture mapping
- **Data Dashboard**: Charts for CO₂, methane, and temperature trends
- **Scroll Animations**: Content that reveals as you scroll through the narrative
- **Region Selection**: Compare climate data across different geographical areas
- **Responsive Design**: Optimized for both desktop and mobile experiences

## Project Structure

```
├── public/
│   ├── earth_daymap.jpg        # Earth texture (replace with actual texture)
│   ├── earth_normal_map.jpg    # Normal map (replace with actual texture)
│   ├── earth_specular_map.jpg  # Specular map (replace with actual texture)
│   └── earth_clouds.jpg        # Clouds texture (replace with actual texture)
├── src/
│   ├── components/
│   │   ├── data/               # Data visualization components
│   │   ├── globe/              # 3D globe components
│   │   ├── layout/             # Layout components
│   │   ├── sections/           # Page sections
│   │   └── ui/                 # UI components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility functions
│   └── pages/                  # Page components
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/climate-story.git
   cd climate-story
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:8080`

## Replacing Placeholder Assets

Replace the placeholder Earth textures in the `/public` directory with actual textures:

- `earth_daymap.jpg` - Earth's surface texture
- `earth_normal_map.jpg` - Normal map for 3D lighting
- `earth_specular_map.jpg` - Specular map for reflections
- `earth_clouds.jpg` - Cloud layer texture

You can find free Earth textures at:
- [NASA Visible Earth](https://visibleearth.nasa.gov/)
- [Solar System Scope](https://www.solarsystemscope.com/textures/)

## Connecting to Real Climate Data

Currently, the application uses mock data. To connect to real climate data APIs:

1. Replace the API endpoint in `src/hooks/useGlobeData.tsx`
2. Update the data transformation logic as needed

Recommended climate data APIs:
- [NOAA Climate Data API](https://www.ncdc.noaa.gov/cdo-web/webservices/v2)
- [NASA GISS Surface Temperature Analysis](https://data.giss.nasa.gov/gistemp/)

## Deployment

This project can be deployed to any static site hosting service:

### Vercel
```bash
npm run build
vercel deploy --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod
```

## Built With

- [React](https://reactjs.org/) - UI framework
- [Three.js](https://threejs.org/) - 3D graphics
- [React Three Fiber](https://github.com/pmndrs/react-three-fiber) - React renderer for Three.js
- [GSAP](https://greensock.com/gsap/) - Animation library
- [Chart.js](https://www.chartjs.org/) - Data visualization
- [Tailwind CSS](https://tailwindcss.com/) - Styling

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Climate data sources: NOAA, NASA, US Greenhouse Gas Center
- Earth textures: NASA Visible Earth
- Three.js and React Three Fiber communities for documentation and examples
