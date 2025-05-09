# HTML5 Game Framework

A robust, modular HTML5 game framework designed for both mobile and web platforms. This framework provides a solid foundation for building 2D games with TypeScript, featuring a component-based architecture and built-in support for mobile devices.

## Features

- **Component-Based Architecture**: Flexible and reusable game object system
- **Mobile Support**: Built-in touch input handling and mobile optimizations
- **Cross-Platform**: Works seamlessly on both desktop and mobile browsers
- **TypeScript**: Written in TypeScript for better type safety and developer experience
- **Modern Development**: Uses Vite for fast development and building

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/game-framework.git
cd game-framework
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

### Building

To build the project:

```bash
npm run build
```

## Project Structure

```
src/
├── core/           # Core framework classes
│   ├── engine.ts   # Game engine
│   ├── scene.ts    # Scene management
│   ├── entity.ts   # Entity system
│   └── component.ts # Component system
├── render/         # Rendering system
├── physics/        # Physics system (coming soon)
├── audio/          # Audio system (coming soon)
├── network/        # Networking system (coming soon)
└── examples/       # Example games
```

## Core Concepts

### Game Engine

The `GameEngine` class is the main entry point for your game. It manages the game loop, scenes, and core systems.

```typescript
const engine = new GameEngine({
  targetFPS: 60,
  width: 800,
  height: 600,
  backgroundColor: '#000000',
  isMobile: false,
})
```

### Scenes

Scenes are containers for game objects and logic. They can be used to organize different parts of your game (menu, gameplay, etc.).

```typescript
class GameScene extends Scene {
  constructor(engine: GameEngine) {
    super('GameScene')
    // Initialize scene
  }
}
```

### Entities and Components

Entities are game objects that can have multiple components attached to them. Components provide specific functionality to entities.

```typescript
class PlayerComponent extends Component {
  update(deltaTime: number) {
    // Update logic
  }

  render(renderer: Renderer) {
    // Rendering logic
  }
}
```

## Mobile Support

The framework includes built-in support for mobile devices:

- Touch input handling
- Mobile-optimized rendering
- Responsive canvas sizing
- Device detection

## Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run test`: Run tests
- `npm run lint`: Run linter
- `npm run format`: Format code

### Adding New Features

1. Create a new module in the appropriate directory
2. Implement the feature following the framework's architecture
3. Add tests for the new feature
4. Update documentation

## Contributing

Before contributing to this project, please note that this is a proprietary codebase. All pull requests, if accepted, will be subject to the same licensing terms.

## License

This project is proprietary software. All rights reserved. Use of this software is prohibited without express written permission from the copyright holder. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by various game engines and frameworks
- Built with modern web technologies
- Designed for performance and ease of use
