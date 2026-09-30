export default function CloudsBackground() {
  return (
    <div style={{ 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '300px', 
      overflow: 'hidden', 
      zIndex: 1, 
      pointerEvents: 'none' 
    }}>
      <style>{`
        @keyframes floatCloud {
          0% { transform: translateX(100vw); opacity: 0.5; }
          100% { transform: translateX(-300px); opacity: 0.5; }
        }
        @keyframes floatCloudSlow {
          0% { transform: translateX(100vw); opacity: 0.3; }
          100% { transform: translateX(-400px); opacity: 0.3; }
        }
        .cloud {
          position: absolute;
          background: white;
          border-radius: 50px;
          filter: blur(15px); /* Soften the clouds to look magical */
        }
        .cloud::before, .cloud::after {
          content: '';
          position: absolute;
          background: white;
          border-radius: 50%;
        }
        .cloud1 {
          top: 30px;
          width: 150px;
          height: 40px;
          animation: floatCloud 30s linear infinite;
        }
        .cloud1::before { width: 70px; height: 70px; top: -30px; left: 20px; }
        .cloud1::after { width: 50px; height: 50px; top: -20px; right: 20px; }
        
        .cloud2 {
          top: 80px;
          width: 200px;
          height: 60px;
          animation: floatCloudSlow 45s linear infinite;
          animation-delay: -15s;
        }
        .cloud2::before { width: 90px; height: 90px; top: -40px; left: 30px; }
        .cloud2::after { width: 70px; height: 70px; top: -30px; right: 30px; }
      `}</style>
      <div className="cloud cloud1"></div>
      <div className="cloud cloud2"></div>
      <div className="cloud cloud1" style={{ top: '120px', animationDelay: '-22s', animationDuration: '40s', transform: 'scale(1.2)' }}></div>
    </div>
  );
}
