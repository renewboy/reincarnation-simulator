/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			// 保留您现有的游戏主题颜色
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#2B5D3A',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: '#4A90E2',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				accent: {
					DEFAULT: '#F5A623',
					foreground: 'hsl(var(--accent-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
				// 您现有的游戏主题颜色
				'game-bg-start': '#1e1b4b',
				'game-bg-end': '#1e3a8a',
				'glass-bg': 'rgba(30, 27, 75, 0.6)',
				'glass-border': 'rgba(255, 255, 255, 0.2)',
				
				// 🚀 新增：宇宙星空主题色彩
				cosmic: {
					50: '#f0f9ff',
					100: '#e0f2fe',
					200: '#bae6fd',
					300: '#7dd3fc',
					400: '#38bdf8',
					500: '#0ea5e9',
					600: '#0284c7',
					700: '#0369a1',
					800: '#075985',
					900: '#0c4a6e',
				},
				nebula: {
					50: '#faf5ff',
					100: '#f3e8ff',
					200: '#e9d5ff',
					300: '#d8b4fe',
					400: '#c084fc',
					500: '#a855f7',
					600: '#9333ea',
					700: '#7c3aed',
					800: '#6b21a8',
					900: '#581c87',
				},
				stellar: {
					50: '#f0fdfa',
					100: '#ccfbf1',
					200: '#99f6e4',
					300: '#5eead4',
					400: '#2dd4bf',
					500: '#14b8a6',
					600: '#0d9488',
					700: '#0f766e',
					800: '#115e59',
					900: '#134e4a',
				},
			},
			
			// 保留您现有的边框半径配置
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			
			// 保留您现有的背景图片，添加新的宇宙主题背景
			backgroundImage: {
				'gradient-game': 'linear-gradient(135deg, #1e1b4b 0%, #1e3a8a 100%)',
				'gradient-primary-btn': 'linear-gradient(90deg, #ec4899 0%, #a855f7 100%)',
				'gradient-secondary-btn': 'linear-gradient(90deg, #f59e0b 0%, #f97316 100%)',
				
				// 🌟 新增：宇宙主题渐变背景
				'cosmic-gradient': 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)',
				'nebula-gradient': 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
				'stellar-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
			},
			
			// 保留您现有的模糊效果，添加更多
			backdropBlur: {
				'glass': '10px',
				xs: '2px',
			},
			
			// 🔥 保留您现有的动画，添加新的宇宙动画
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
				// 保留您现有的动画
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				'pulse-glow': {
					'0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(236, 72, 153, 0.5)' },
					'50%': { opacity: '0.8', boxShadow: '0 0 30px rgba(236, 72, 153, 0.8)' },
				},
				
				// 🌌 新增：宇宙主题动画
				'twinkle': {
					'0%, 100%': { 
						opacity: '0.3', 
						transform: 'scale(1)' 
					},
					'50%': { 
						opacity: '1', 
						transform: 'scale(1.2)' 
					},
				},
				'fade-in-up': {
					'from': {
						opacity: '0',
						transform: 'translate(-50%, -10px)',
					},
					'to': {
						opacity: '1',
						transform: 'translate(-50%, 0)',
					},
				},
				'cosmic-float': {
					'0%, 100%': { 
						transform: 'translateY(0px) rotate(0deg)' 
					},
					'33%': { 
						transform: 'translateY(-10px) rotate(120deg)' 
					},
					'66%': { 
						transform: 'translateY(5px) rotate(240deg)' 
					},
				},
				'spin-slow': {
					'from': { 
						transform: 'rotate(0deg)' 
					},
					'to': { 
						transform: 'rotate(360deg)' 
					},
				},
				'cosmic-pulse': {
					'0%, 100%': { 
						opacity: '0.4', 
						transform: 'scale(1)' 
					},
					'50%': { 
						opacity: '0.8', 
						transform: 'scale(1.05)' 
					},
				},
				'nebula-flow': {
					'0%': { 
						transform: 'translateX(-100%) translateY(-100%) rotate(0deg)' 
					},
					'25%': { 
						transform: 'translateX(100%) translateY(-50%) rotate(90deg)' 
					},
					'50%': { 
						transform: 'translateX(100%) translateY(100%) rotate(180deg)' 
					},
					'75%': { 
						transform: 'translateX(-100%) translateY(50%) rotate(270deg)' 
					},
					'100%': { 
						transform: 'translateX(-100%) translateY(-100%) rotate(360deg)' 
					},
				},
			},
			animation: {
				// 保留您现有的动画
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 3s ease-in-out infinite',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				
				// 🌌 新增：宇宙主题动画
				'twinkle': 'twinkle 3s ease-in-out infinite',
				'fade-in-up': 'fade-in-up 0.3s ease-out',
				'cosmic-float': 'cosmic-float 6s ease-in-out infinite',
				'spin-slow': 'spin-slow 20s linear infinite',
				'cosmic-pulse': 'cosmic-pulse 4s ease-in-out infinite',
				'nebula-flow': 'nebula-flow 30s linear infinite',
				'bounce-slow': 'bounce 3s infinite',
				'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
			},
			
			// 🎨 新增：宇宙主题扩展配置
			fontFamily: {
				'cosmic': ['Inter', 'system-ui', 'sans-serif'],
				'space': ['Orbitron', 'monospace'],
			},
			spacing: {
				'18': '4.5rem',
				'88': '22rem',
				'128': '32rem',
			},
			boxShadow: {
				// 保留现有的阴影
				'cosmic': '0 8px 32px rgba(0, 0, 0, 0.3)',
				'nebula': '0 20px 60px rgba(168, 85, 247, 0.4)',
				'stellar': '0 25px 80px rgba(59, 130, 246, 0.3)',
				'glow': '0 0 20px rgba(34, 211, 238, 0.5)',
				'glow-purple': '0 0 20px rgba(168, 85, 247, 0.5)',
				'glow-pink': '0 0 20px rgba(236, 72, 153, 0.5)',
				'inner-glow': 'inset 0 0 20px rgba(255, 255, 255, 0.1)',
			},
			blur: {
				xs: '2px',
			},
		},
	},
	plugins: [
		require('tailwindcss-animate'),
		
		// 🌟 自定义插件：添加宇宙主题工具类
		function({ addUtilities, addComponents, theme }) {
			const cosmicUtilities = {
				// 文字光晕效果
				'.text-glow-cyan': {
					textShadow: '0 0 10px rgba(34, 211, 238, 0.5), 0 0 20px rgba(34, 211, 238, 0.3), 0 0 30px rgba(34, 211, 238, 0.2)',
				},
				'.text-glow-purple': {
					textShadow: '0 0 10px rgba(168, 85, 247, 0.5), 0 0 20px rgba(168, 85, 247, 0.3), 0 0 30px rgba(168, 85, 247, 0.2)',
				},
				'.text-glow-pink': {
					textShadow: '0 0 10px rgba(236, 72, 153, 0.5), 0 0 20px rgba(236, 72, 153, 0.3), 0 0 30px rgba(236, 72, 153, 0.2)',
				},
				'.border-glow': {
					boxShadow: '0 0 15px rgba(168, 85, 247, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
				},
				
				// 玻璃态效果（基于您现有的配置）
				'.glass-cosmic': {
					background: 'rgba(15, 15, 35, 0.1)',
					backdropFilter: 'blur(20px)',
					border: '1px solid rgba(168, 85, 247, 0.2)',
					boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
				},
				
				// 宇宙背景
				'.cosmic-bg': {
					background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)',
					position: 'relative',
					overflow: 'hidden',
				},
				
				// 粒子效果
				'.cosmic-particle': {
					willChange: 'transform',
					transform: 'translateZ(0)',
				},
			};

			const cosmicComponents = {
				'.cosmic-card': {
					background: 'rgba(15, 15, 35, 0.1)',
					backdropFilter: 'blur(20px)',
					border: '1px solid rgba(168, 85, 247, 0.2)',
					borderRadius: '1rem',
					boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
				},
				
				'.cosmic-button': {
					background: 'linear-gradient(45deg, #8b5cf6, #06b6d4)',
					border: 'none',
					borderRadius: '0.5rem',
					color: 'white',
					fontWeight: '600',
					padding: '0.75rem 1.5rem',
					transition: 'all 0.3s ease',
					'&:hover': {
						background: 'linear-gradient(45deg, #a78bfa, #22d3ee)',
						transform: 'translateY(-2px)',
						boxShadow: '0 10px 25px rgba(168, 85, 247, 0.4)',
					},
				},
				
				'.cosmic-scrollbar': {
					'&::-webkit-scrollbar': {
						width: '8px',
					},
					'&::-webkit-scrollbar-track': {
						background: 'rgba(15, 15, 35, 0.1)',
						borderRadius: '4px',
					},
					'&::-webkit-scrollbar-thumb': {
						background: 'linear-gradient(45deg, #8b5cf6, #06b6d4)',
						borderRadius: '4px',
					},
					'&::-webkit-scrollbar-thumb:hover': {
						background: 'linear-gradient(45deg, #a78bfa, #22d3ee)',
					},
				},
			};

			addUtilities(cosmicUtilities);
			addComponents(cosmicComponents);
		},
	],
	
	// 支持深色模式
	darkMode: 'class',
	
	// 确保 purge 不会移除动态生成的类
	safelist: [
		// 您现有的游戏主题颜色
		'text-[#2B5D3A]',
		'text-[#4A90E2]',
		'text-[#F5A623]',
		'bg-[#1e1b4b]',
		'bg-[#1e3a8a]',
		
		// 🌌 新增：宇宙主题颜色
		'text-[#ff6b6b]',
		'text-[#4ecdc4]',
		'text-[#45b7d1]',
		'text-[#f9ca24]',
		'text-[#6c5ce7]',
		'text-[#fd79a8]',
		'text-[#00b894]',
		'text-[#e17055]',
		'text-[#74b9ff]',
		'text-[#b2bec3]',
		'hover:text-[#ff8a80]',
		'hover:text-[#7fdbda]',
		'hover:text-[#87ceeb]',
		'hover:text-[#f0932b]',
		'hover:text-[#a29bfe]',
		'hover:text-[#fdcb6e]',
		'hover:text-[#55efc4]',
		'hover:text-[#fab1a0]',
		'hover:text-[#a29bfe]',
		'hover:text-[#e84393]',
	],
};