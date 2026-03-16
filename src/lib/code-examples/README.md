# Code Examples Structure

Organized, scalable structure for annotated code examples.

## Directory Structure

```
src/lib/code-examples/
├── index.ts                    # Barrel exports (import from here)
├── python/
│   └── file-organizer.ts      # Python file organizer example
├── javascript/
│   └── react-hooks-todo.ts    # React hooks todo app
└── typescript/
    └── (add TypeScript examples here)
```

## How to Add New Examples

### Step 1: Create a New File

Create a file in the appropriate language folder:

```typescript
// src/lib/code-examples/python/web-scraper.ts

export const webScraperCode = {
  code: `import requests
from bs4 import BeautifulSoup

def scrape_articles(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    return soup.find_all('article')`,
  language: 'python',
  title: 'Web Scraper',
  description: 'Basic web scraping with BeautifulSoup',
  tags: ['python', 'web-scraping', 'beautifulsoup'],
};
```

### Step 2: Export from index.ts

Add your new example to the barrel export:

```typescript
// src/lib/code-examples/index.ts
export { fileOrganizerCode } from './python/file-organizer';
export { webScraperCode } from './python/web-scraper'; // ← Add this
export { reactHooksTodo } from './javascript/react-hooks-todo';
```

### Step 3: Use in MDX

Import and use in your blog post:

```mdx
---
title: "Web Scraping Guide"
---

import { webScraperCode } from '@/lib/code-examples';

<AnnotatedCode code={webScraperCode.code} language={webScraperCode.language}>
  <Annotation id="imports" lines="1-2" title="Required Libraries">
    We use requests for HTTP and BeautifulSoup for parsing.
  </Annotation>
</AnnotatedCode>
```

## Object Structure

Each code example exports an object with:

```typescript
{
  code: string;           // The actual code as a string
  language: string;       // 'python' | 'javascript' | 'typescript' | etc.
  title: string;          // Human-readable title
  description: string;    // Short description
  tags: string[];        // For future search/filtering
}
```

## Benefits of This Structure

✅ **Organized**: Examples grouped by language
✅ **Tree-shakeable**: Only imports what you use
✅ **Discoverable**: Easy to find specific examples
✅ **Maintainable**: One file per example
✅ **Scalable**: Can grow to hundreds of examples
✅ **Metadata**: Each example has title, description, tags
✅ **Simple imports**: `import { name } from '@/lib/code-examples'`

## Migration Guide

If you have old imports from `@/lib/codeExamples`, update them:

**Before:**
```mdx
import { myCode } from '@/lib/codeExamples';
<AnnotatedCode code={myCode} language="python">
```

**After:**
```mdx
import { myCode } from '@/lib/code-examples';
<AnnotatedCode code={myCode.code} language={myCode.language}>
```

The key change: Access `.code` property!

## Future Enhancements

You could add:
- **Search function**: Find examples by tag
- **Related examples**: Suggest similar code
- **Version history**: Track example updates
- **Live playground**: Run examples in-browser
- **Download snippets**: Export as files

---

**Current Examples:**
- `fileOrganizerCode` - Python file automation (106 lines)
- `reactHooksTodo` - React hooks todo app (94 lines)

Add more as you create content! 🚀
