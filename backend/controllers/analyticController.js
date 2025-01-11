const showAnalytics = async (req, res, next) => {
  try {
    const { fieldName, cropType, latitude, longitude, areaSize } = req.body;

    const soilHealth = ["Good", "Average", "Poor"];
    const cropHealth = ["Healthy", "Moderate", "Unhealthy"];

    const randomSoilHealth = soilHealth[Math.floor(Math.random() * soilHealth.length)];
    const randomCropHealth = cropHealth[Math.floor(Math.random() * cropHealth.length)];

    const insights = {
      fieldName,
      cropType,
      latitude, 
      longitude,
      areaSize,
      soilHealth: randomSoilHealth,
      cropHealth: randomCropHealth,
      recommendations: randomSoilHealth === "Poor"
      ? "Consider soil fertilization and testing for pH levels."
      : randomCropHealth === "Unhealthy"
      ? "Apply pest control measures and monitor irrigation."
      : "No immediate action required. Keep monitoring.",
    };
    
    return res.status(200).json({ message: "Insights Generated", insights });
  } 
  catch(err){
    return next(err)
  }
}

module.exports = {showAnalytics}

