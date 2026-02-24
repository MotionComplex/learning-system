# Quiz Web App

Beautiful React-based quiz application for testing your knowledge.

## Quick Start

```bash
cd packages/quiz-app
npm install
npm run dev
```

Visit http://localhost:5173

## Features

- **Interactive Dashboard** - View stats and recent learnings
- **Category Quizzes** - Test knowledge by category
- **Difficulty Levels** - Beginner, intermediate, advanced quizzes
- **Progress Tracking** - See your score and review mistakes
- **Learning Browser** - Search and filter all entries
- **Responsive Design** - Works on desktop, tablet, mobile

## Usage

### Loading Data

The app can load data in three ways:

1. **File Picker** (Default)
   - Click "Choose file"
   - Select your `~/LEARNING.json`
   - Data loads instantly

2. **Sample Data**
   - Click "Use Sample Data"
   - Loads demo entries for testing

3. **Local API** (Advanced)
   - Set up a local server (see below)
   - App automatically connects

### Taking a Quiz

1. From dashboard, click a quiz button:
   - "Random Quiz" - Mix of all topics
   - Category buttons - Specific category
   - Difficulty buttons - Specific level

2. Answer questions:
   - Click an answer option
   - See immediate feedback
   - Read the explanation
   - Click "Next Question"

3. Review results:
   - See your score percentage
   - Review all questions
   - See correct answers and explanations
   - Take another quiz or return to dashboard

### Browsing Learnings

1. Click "View All" from dashboard
2. Use filters:
   - Search box - Full-text search
   - Category dropdown
   - Difficulty dropdown

3. Click entry to expand:
   - See full details
   - View quiz questions
   - See related concepts

## Local API Server (Optional)

For automatic data loading without file picker:

### Option 1: Simple Node Server

Create `server.js` in the project root:

```javascript
import { createServer } from 'http';
import { readFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

const server = createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.url === '/api/learning') {
    const data = readFileSync(
      join(homedir(), 'LEARNING.json'), 
      'utf-8'
    );
    res.setHeader('Content-Type', 'application/json');
    res.end(data);
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(3001);
console.log('API server running on http://localhost:3001');
```

Run it:

```bash
node server.js
```

### Option 2: Express Server

```bash
npm install express cors
```

Create `server.js`:

```javascript
import express from 'express';
import cors from 'cors';
import { readFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

const app = express();
app.use(cors());

app.get('/api/learning', (req, res) => {
  const data = readFileSync(
    join(homedir(), 'LEARNING.json'),
    'utf-8'
  );
  res.json(JSON.parse(data));
});

app.listen(3001, () => {
  console.log('API server on http://localhost:3001');
});
```

## Building for Production

```bash
cd packages/quiz-app
npm run build
```

Output in `dist/` folder. Deploy to:
- Vercel
- Netlify
- GitHub Pages
- Any static host

Note: You'll need to use file picker or deploy the API server too.

## Customization

### Tailwind Config

Edit `tailwind.config.js`:

```javascript
export default {
  theme: {
    extend: {
      colors: {
        primary: '#your-color',
      },
    },
  },
}
```

### Quiz Settings

Edit `src/lib/quizLogic.ts`:

```typescript
// Change default quiz count
const count = options.count || 10;  // Default to 10 instead of 5

// Change shuffle behavior
const shuffled = shuffleArray(questionsWithEntries);
```

### UI Components

All components in `src/components/`:
- `Dashboard.tsx` - Main dashboard
- `Quiz.tsx` - Quiz interface
- `LearningList.tsx` - Browse learnings

Customize as needed.

## Troubleshooting

### Blank Page

Check browser console for errors. Common issues:
- Missing dependencies: `npm install`
- Build errors: `npm run build`
- Port conflict: Change port in `vite.config.ts`

### Can't Load File

- Browser security prevents direct file access
- Use file picker or set up API server
- Or use sample data for testing

### Quiz Has No Questions

Your entries don't have quiz questions:

```bash
learning add  # Generates questions automatically
```

### Styling Issues

Clear cache and rebuild:

```bash
rm -rf node_modules dist
npm install
npm run dev
```

## Development

### Project Structure

```
quiz-app/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx      # Main dashboard
│   │   ├── Quiz.tsx           # Quiz interface
│   │   └── LearningList.tsx   # Browse entries
│   ├── lib/
│   │   ├── types.ts           # TypeScript types
│   │   ├── learningData.ts    # Data loading
│   │   └── quizLogic.ts       # Quiz generation
│   ├── App.tsx                # Main app
│   └── main.tsx               # Entry point
├── public/                    # Static assets
├── index.html                 # HTML template
├── vite.config.ts            # Vite config
└── package.json
```

### Adding Features

1. **New Quiz Type**: Edit `quizLogic.ts`
2. **New View**: Add component, update `App.tsx`
3. **New Filter**: Update `learningData.ts`
4. **Styling**: Use Tailwind classes

### Testing

```bash
npm run build  # Build for production
npm run preview  # Preview production build
```

## Performance

- Uses React for fast UI updates
- Vite for instant hot reload
- Tailwind for optimized CSS
- No backend required (file-based)

## Browser Support

- Chrome/Edge: ✓
- Firefox: ✓
- Safari: ✓
- Mobile browsers: ✓

Requires modern browser with ES6+ support.

## Keyboard Shortcuts

- `1-4` - Select answer option
- `Enter` - Submit answer
- `Escape` - Return to dashboard

(Future feature)

## Mobile Experience

Fully responsive:
- Touch-friendly buttons
- Readable font sizes
- Optimized layouts
- Works offline (after loading)

## Data Privacy

- All data stays local
- No analytics tracking
- No external requests (except API server if used)
- Your learning data never leaves your machine

## Future Enhancements

Planned features:
- [ ] Spaced repetition
- [ ] Performance charts
- [ ] Custom quiz creation
- [ ] Export quizzes
- [ ] Dark mode
- [ ] Keyboard shortcuts
- [ ] PWA support
- [ ] Offline mode
- [ ] Share quiz results

## Support

- Report bugs: GitHub Issues
- Request features: GitHub Discussions
- Ask questions: README discussions
