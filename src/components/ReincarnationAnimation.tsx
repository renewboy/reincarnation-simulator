import React from 'react';

// 定义粒子动画的辅助CSS样式
const particleAnimationStyle = document.createElement('style');
particleAnimationStyle.textContent = `
  @keyframes particle {
    0% {
      transform: translate(-50%, -50%) scale(0);
      opacity: 0;
    }
    30% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1) rotate(0deg);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0) rotate(360deg);
    }
  }
  
  @keyframes twinkle {
    0% { opacity: 0.2; }
    50% { opacity: 1; }
    100% { opacity: 0.2; }
  }
  
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-particle {
    animation-name: particle;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
  }
  
  .animate-twinkle {
    animation-name: twinkle;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
  }
  
  .animate-fade-in {
    animation: fade-in 1s ease-out;
  }
`;
document.head.appendChild(particleAnimationStyle);

const ReincarnationAnimation: React.FC = () => {
  // 生成粒子数据
  const generateParticles = () => {
    const particles = [];
    for (let i = 0; i < 20; i++) {
      const delay = i * 0.1;
      particles.push(
        <div
          key={`particle-${i}`}
          className="absolute w-1.5 h-1.5 rounded-full bg-white/80 animate-particle"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            animationDelay: `${delay}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        />
      );
    }
    return particles;
  };

  // 生成星光
  const generateStars = () => {
    const stars = [];
    for (let i = 0; i < 50; i++) {
      stars.push(
        <div
          key={`star-${i}`}
          className="absolute w-0.5 h-0.5 rounded-full bg-white animate-twinkle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        />
      );
    }
    return stars;
  };

  // 生成装饰光线
  const generateRays = () => {
    const rays = [];
    for (let i = 0; i < 8; i++) {
      rays.push(
        <div
          key={`ray-${i}`}
          className="absolute left-1/2 top-0 w-[1px] h-1/2 origin-bottom bg-gradient-to-t from-transparent via-white/40 to-transparent animate-pulse"
          style={{
            transform: `translateX(-50%) rotate(${i * 45}deg)`,
            animationDelay: `${i * 0.1}s`,
            animationDuration: '2s',
          }}
        />
      );
    }
    return rays;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85">
      {/* 背景星光效果 */}
      <div className="absolute inset-0 overflow-hidden">
        {generateStars()}
      </div>

      {/* 动画容器 */}
      <div className="relative w-[280px] h-[280px] md:w-[350px] md:h-[350px] lg:w-[400px] lg:h-[400px]">
        {/* 背景光环效果 */}
        <div className="absolute inset-0 rounded-full animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, rgba(236,72,153,0.3) 50%, rgba(236,72,153,0) 70%)',
            animationDuration: '3s',
          }}
        />
        
        {/* 第二层光环 */}
        <div className="absolute inset-[20%] rounded-full animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(236,72,153,0.3) 0%, rgba(59,130,246,0.2) 50%, rgba(59,130,246,0) 70%)',
            animationDuration: '3.5s',
            animationDelay: '0.5s',
          }}
        />

        {/* 粒子效果 */}
        <div className="absolute inset-0">
          {generateParticles()}
        </div>

        {/* 中心光芒 */}
        <div className="absolute left-1/2 top-1/2 w-10 h-10 rounded-full bg-white/60 animate-ping"
          style={{
            transform: 'translate(-50%, -50%)',
            animationDuration: '2s',
          }}
        />

        {/* 文字提示 */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-white text-xl md:text-2xl font-bold text-center px-4 text-glow-purple animate-fade-in">
            正在生成新生命...
          </div>
        </div>

        {/* 装饰光线 */}
        {generateRays()}
      </div>
    </div>
  );
};

export default ReincarnationAnimation;