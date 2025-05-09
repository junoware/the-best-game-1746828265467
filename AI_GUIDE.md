# HTML5 GAME FRAMEWORK - AI ASSISTANT GUIDE

## QUICK REFERENCE

- **Framework**: Lightweight HTML5 game engine with mobile support
- **Language**: TypeScript
- **Build System**: Vite
- **Architecture**: Entity-Component-System (ECS)
- **Main Files to Edit**: `src/examples/example.ts` (game logic)
- **Build Command**: `npm run build`
- **Development Command**: `npm run dev`
- **Entry Point**: `index.html`

## REPOSITORY STRUCTURE

```
├── src/
│   ├── core/              # Core engine components
│   │   ├── engine.ts      # Main game engine
│   │   ├── entity.ts      # Entity class for game objects
│   │   ├── component.ts   # Base component class
│   │   ├── scene.ts       # Scene management
│   │   ├── input-manager.ts # Input handling (keyboard/touch)
│   │   ├── event-emitter.ts # Custom event system
│   │   ├── asset-manager.ts # Asset loading and management
│   │   └── system.ts      # Systems for game logic
│   ├── render/            # Rendering system
│   │   └── renderer.ts    # Canvas-based renderer
│   ├── physics/           # Physics components (if needed)
│   ├── audio/             # Audio components (if needed)
│   ├── animation/         # Animation systems (if needed)
│   └── examples/          # Example games
│       └── example.ts     # Main example game (EDIT THIS)
├── dist/                  # Build output
├── index.html             # HTML entry point
├── vite.config.ts         # Build configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Project dependencies
```

## HOW TO EDIT THE GAME

1. **Primary File**: `src/examples/example.ts` contains the game logic and is the main file to edit based on user prompts.

2. **Game Components**:

   - Create custom components by extending the `Component` class
   - Add methods for `update(deltaTime)` and `render(renderer)`
   - Components handle game object behavior and appearance

3. **Scenes**:

   - Scenes contain entities and manage the game state
   - Create a custom scene by extending the `Scene` class
   - Initialize entities in the `initialize` method

4. **Main Game Logic**:
   - The game is initialized in the window load event
   - Engine is created with configuration parameters
   - Scene is created and added to the engine
   - Engine's `start()` method begins the game loop

## CODE PATTERNS

### Creating a Game Object

```typescript
// Create a component
class MyComponent extends Component {
  // Properties
  private x: number = 0
  private y: number = 0
  private speed: number = 100

  constructor(x: number, y: number) {
    super()
    this.x = x
    this.y = y
  }

  // Update method called every frame
  public update(deltaTime: number): void {
    // Move the object
    this.x += this.speed * deltaTime

    // Get renderer for bounds checking
    const renderer = this.entity?.getScene()?.getEngine()?.getRenderer()
    if (!renderer) return

    // Handle bounds
    if (this.x > renderer.getWidth()) {
      this.x = 0
    }
  }

  // Render method to draw the object
  public render(renderer: Renderer): void {
    renderer.drawCircle(this.x, this.y, 20, '#ff0000')
  }
}

// In your scene initialization:
const entity = new Entity('myEntity')
entity.addComponent(new MyComponent(100, 100))
this.addEntity(entity)
```

### Handling Input

```typescript
// In a component's update method:
public update(deltaTime: number): void {
  const input = this.entity?.getScene()?.getEngine()?.getInputManager();
  if (!input) return;

  // Keyboard input
  if (input.isKeyPressed('ArrowRight')) {
    this.x += this.speed * deltaTime;
  }

  // Touch/mouse input
  if (input.isMobileDevice()) {
    const touchPoints = input.getTouchPoints();
    if (touchPoints.length > 0) {
      // Move toward touch point
      const touch = touchPoints[0];
      // Logic to move toward touch.x, touch.y
    }
  }
}

// Register for tap events
public onAddedToEntity(entity: Entity): void {
  super.onAddedToEntity(entity);

  const input = entity.getScene()?.getEngine()?.getInputManager();
  if (input) {
    input.onTap(() => {
      // Handle tap event
    });
  }
}
```

### Loading and Using Assets

```typescript
// In your scene initialization:
const assetManager = this.getEngine().getAssetManager();

// Load an image
assetManager.loadImage('player', 'assets/player.png')
  .then(() => {
    console.log('Player image loaded');
  });

// Get and use the image in a component's render method
public render(renderer: Renderer): void {
  const assetManager = this.entity?.getScene()?.getEngine()?.getAssetManager();
  if (!assetManager) return;

  const playerImage = assetManager.getImage('player');
  if (playerImage) {
    renderer.drawImage(playerImage, this.x, this.y, 64, 64);
  }
}
```

## RENDERING API

The `Renderer` class provides these main methods:

- `drawCircle(x, y, radius, color)`: Draw a circle
- `drawRect(x, y, width, height, color)`: Draw a rectangle
- `drawText(text, x, y, color, font?)`: Draw text
- `drawLine(x1, y1, x2, y2, color, width?)`: Draw a line
- `drawImage(image, x, y, width, height)`: Draw an image
- `clear()`: Clear the canvas (called automatically each frame)
- `getWidth()` and `getHeight()`: Get canvas dimensions

## MOBILE SUPPORT

The framework automatically detects mobile devices and provides:

- Touch input handling via `InputManager`
- High DPI screen support with proper pixel ratio scaling
- Responsive canvas sizing that adapts to screen size
- Touch event optimization with touch-action: none
- Prevent unwanted behaviors like pinch-zoom and text selection
- iOS-specific optimizations with apple-mobile-web-app-capable

The index.html includes specific mobile optimizations:

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
/>
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta
  name="apple-mobile-web-app-status-bar-style"
  content="black-translucent"
/>
```

And CSS optimizations:

```css
* {
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}
canvas {
  touch-action: none;
}
```

## BUILD PROCESS

The project uses Vite for fast development and optimized builds. Available scripts in package.json:

- `npm run dev`: Start development server with hot-reload at http://localhost:3000
- `npm run build`: Build production-ready files to dist/ directory
- `npm run preview`: Preview the production build locally
- `npm run lint`: Run ESLint to check code quality
- `npm run format`: Format code using Prettier
- `npm run test`: Run Jest tests
- `npm run docs`: Generate TypeDoc documentation

The Vite configuration in vite.config.ts includes:

- Development server settings (port 3000, mobile device access)
- Build output settings (dist directory, sourcemaps)
- Path aliases (@/ for src directory)

To build the game after making changes:

```bash
npm run build
```

This will:

1. Compile TypeScript to JavaScript
2. Bundle all files with Vite
3. Output to the `dist/` directory

The resulting files in `dist/` can be hosted on any web server.

## TESTING THE GAME

To test the game during development:

```bash
npm run dev
```

This starts a development server at http://localhost:3000

## COMMON PITFALLS

- **Import paths** should use relative references (`../core/engine`)
- **Canvas sizing** uses `window.innerWidth/Height` by default but can be customized
- **Component lifecycle** methods should call their `super` versions (e.g., `super.onAddedToEntity(entity)`)
- **Event handlers** should be removed when components are removed from entities
- **Asset loading** should be done during scene initialization, not in component constructors
- **Mobile testing** requires proper viewport settings (already in index.html)
- **Touch events** need special handling compared to mouse events (use InputManager)

## EXAMPLE MODIFICATIONS

1. **Change ball color**:

   - Find `private color: string = '#ff0000'` in the component
   - Change to desired color (e.g., `'#00ff00'`)

2. **Add gravity**:

   - Add `private gravity: number = 500` to component properties
   - In update method: `this.speedY += this.gravity * deltaTime`

3. **Change controls**:
   - Modify input handling in the component's update method
   - Add new input mappings like `input.isKeyPressed('Space')`

## OPTIMIZING PERFORMANCE

- Keep the number of entities low for mobile devices
- Use simple shapes where possible
- Implement a simple culling system for off-screen objects
- Batch similar drawing operations
- Use requestAnimationFrame for smooth animation (already handled by engine)
- Properly dispose of assets and event listeners when not needed

---

**Note**: This guide was created to help AI assistants quickly understand and modify the game framework. When editing based on user prompts, focus on changing the game logic in `src/examples/example.ts` while keeping the core engine intact.
