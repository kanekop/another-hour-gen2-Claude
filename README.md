# Another Hour Clock

Another Hour Clock is a unique web-based application that redefines your perception of time. This application allows you to personalize your day by defining the length of your **"Designed 24"** period—the duration you wish your conceptual 'day' to last in real time. The remaining time within a standard 24-hour real day becomes the **"Another Hour" (AH)** period.

## ✨ Key Concepts

- **Designed 24 Period**: Your customizable conceptual 24-hour day that can last anywhere from 0 to 24 real hours
- **Another Hour (AH) Period**: The remaining real time in a 24-hour day, running at normal speed
- **Time Scaling**: During the "Designed 24" period, time runs at a customized pace to fit 24 conceptual hours into your chosen real-time duration

## 🚀 Features

### 🎯 **Main Clock** (Customizable Time Experience)
- **Custom Duration Control**: Set your "Designed 24" period anywhere from 0 to 24 real hours using an intuitive slider
- **Visual Feedback**: Integrated comparison graph showing your personalized time distribution vs. standard time
- **Dynamic Time Scaling**: Time runs faster or slower during your "Designed 24" period based on your settings
- **Another Hour Visualization**: Visual AH sector on the analog clock during AH periods
- **Theme Switching**: Automatically switches to dark theme during AH periods
- **Timezone Support**: Full timezone selection with major world cities

### ⏱️ **Stopwatch & Timer** (Scaled Time Tools)
- **Adaptive Speed**: Operates based on your Main Clock's current scaling settings
- **Real-time Sync**: Speed changes automatically when switching between Designed 24 and AH periods
- **Intuitive Interface**: Clean, easy-to-use controls for all timing functions

### 📊 **Graph Demo** (Time Visualization)
- **Dual Bar Graphs**: Side-by-side comparison of real time vs. your personalized time
- **Interactive Controls**: Real-time updates as you adjust your "Designed 24" duration
- **Visual Learning**: Helps understand how time allocation changes with different settings

## 🏗️ Architecture

```
another-hour/
├── 🌐 Frontend (Vanilla JS + ES6 Modules)
│   ├── public/
│   │   ├── 📄 HTML Pages (Main Clock, Stopwatch, Timer, etc.)
│   │   ├── 🎨 CSS (Component-based styling with theme support)
│   │   └── ⚡ JavaScript (Modular time calculations & UI)
│   └── 🔧 Core Logic
│       ├── clock-core.js (Time calculation algorithms)
│       └── timezone-manager.js (Timezone handling)
├── 🔙 Backend (Node.js + Express)
│   ├── 🛣️ API Routes (Settings, Stopwatch, Timer)
│   └── 📁 Static File Serving
└── ⚙️ Configuration
    ├── 📋 Package management (npm)
    └── 🔧 Environment setup
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **npm** (included with Node.js)
- **Modern browser** with SVG support

### Installation

1. **Clone & Navigate**
   ```bash
   git clone https://github.com/kanekop/another-hour.git
   cd another-hour
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy example environment file (if exists)
   cp .env.example .env
   
   # Or create new .env file with:
   echo "SESSION_SECRET=your-long-random-string-here" > .env
   ```

4. **Start the Server**
   ```bash
   npm start
   ```

5. **Open Your Browser**
   ```
   http://localhost:3000
   ```

## 🎮 Usage Guide

### Main Clock (Personalized Experience)
1. **Access**: Click "Main Clock" from the landing page
2. **Configure**: Use "Show Settings" to access configuration
   - Adjust the slider to set your "Designed 24" duration
   - Select your preferred timezone
   - View the real-time graph comparison
3. **Experience**: Switch to "Show Clock" to see your personalized time in action
   - Watch time scale during your "Designed 24" period
   - Experience normal-speed time during "Another Hour" periods
   - Observe automatic theme changes

### Stopwatch & Timer
- **Adaptive Behavior**: Speed automatically matches your Main Clock's current scaling
- **Easy Controls**: Standard start/stop/reset functionality
- **Scaled Duration**: Set timer durations in "perceived" time units

### Graph Demo
- **Interactive Learning**: Experiment with different "Designed 24" durations
- **Visual Understanding**: See how your choices affect time distribution
- **Real-time Updates**: All changes reflected immediately

## 🧮 Technical Deep Dive

### Time Calculation System

The application uses sophisticated time scaling algorithms:

```javascript
// Core scaling formula
scaleFactor = 24 / scaled24Hours

// During Designed 24 period: time runs at scaleFactor speed
// During AH period: time runs at normal speed (scaleFactor = 1)
```

### Key Technologies
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6 modules)
- **Time Library**: Moment.js with Moment Timezone
- **Graphics**: SVG for analog clock rendering
- **Backend**: Node.js, Express.js
- **State Management**: localStorage + server-side sessions

## 🎨 Theme System

- **Light Theme**: Default elegant interface
- **Dark Theme**: Automatically activates during AH periods
- **Smooth Transitions**: CSS-based theme switching
- **Consistent Design**: Unified component library

## 🌍 Browser Support

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

## 📱 Responsive Design

- 📱 Mobile-first approach
- 💻 Desktop optimized
- 📐 Flexible layouts
- 🔄 Orientation support

## 🛠️ Development

### Project Structure
```
public/
├── css/           # Modular stylesheets
├── js/            # Client-side modules
├── pages/         # HTML page templates
└── clock-core.js  # Core time calculation logic

src/
├── routes/        # Express API routes
└── shared/        # Shared utilities
```

### Key Files
- `clock-core.js`: Main time calculation algorithms
- `personalized-ah-clock-ui.js`: Main clock interface logic
- `timezone-manager.js`: Timezone handling and city data
- `aph-graph-demo.js`: Graph rendering and updates

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow existing code style and patterns
- Test across multiple browsers
- Update documentation for new features
- Ensure responsive design compatibility

## 🚦 Roadmap

### ✅ Completed
- [x] Customizable Main Clock with full scaling support
- [x] Integrated graph visualization in settings
- [x] Stopwatch & Timer with adaptive scaling
- [x] Comprehensive timezone support
- [x] Dark/light theme system
- [x] Responsive design implementation

### 🔄 In Progress
- [ ] Enhanced UI/UX improvements
- [ ] Performance optimizations
- [ ] Additional visualization options

### 🎯 Future Plans
- [ ] **Mobile App**: Native iOS/Android applications
- [ ] **Watch Integration**: Apple Watch companion app
- [ ] **Customization**: Additional themes and visual options
- [ ] **Sharing**: Export and share time configurations
- [ ] **Analytics**: Personal time usage insights
- [ ] **Internationalization**: Multi-language support
- [ ] **PWA Features**: Offline functionality and notifications

## 🐛 Known Issues

- Timer accuracy may vary slightly during rapid scaling changes
- Very short "Designed 24" periods (< 1 hour) may cause display precision issues
- Graph rendering may need refresh on some mobile browsers after orientation change

## 🆘 Troubleshooting

### Common Issues

**Clock not updating?**
- Check browser console for JavaScript errors
- Ensure Moment.js libraries are loaded
- Try refreshing the page

**Settings not saving?**
- Check localStorage is enabled in your browser
- Ensure cookies are allowed for the site

**Graph not displaying?**
- Verify SVG support in your browser
- Check CSS is loading correctly

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Moment.js Team** for excellent date/time handling
- **Open Source Community** for inspiration and tools
- **Beta Testers** for valuable feedback and suggestions

## 📬 Contact

- **Project Repository**: [GitHub](https://github.com/kanekop/another-hour-gen2-Claude)
- **Issues & Feature Requests**: [GitHub Issues](https://github.com/kanekop/another-hour-gen2-Claude/issues)

---

**Experience time differently. Make every hour count. ⏰**

*© 2025 Another Hour Project. All Rights Reserved.*