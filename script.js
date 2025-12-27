document.addEventListener('DOMContentLoaded', () => {
document.getElementById('toggle-filters').addEventListener('click', () => {
  document.getElementById('filters').classList.toggle('collapsed');
});

const storiesData = {
  story1: {
    title: 'Sweets',          // Story title
    category: 'Scout',                        // Main / Event / Scout / Unit
    date: '2015-05-31',                      // Release date
    author: 'Akira',                       // Author name
    translator: 'NefWZ',              // Translator name
    description: 'TO DO',  // Story overview
    characters: ['EichiTenshouin','char2'],           // Character IDs from characterData
    
  },

  story2: {
    title: 'Placeholder Event',
    category: 'Event',
    date: '2025-02-14',
    author: 'Author B',
    translator: 'NefWZ',
    description: 'Overview of Placeholder Event.',
    characters: ['char2','char3'],
  events: [
      {
        title: 'Chapter 1: Beginning',       // Chapter title
        dialogue:[
      { character: 'EichiTenshouin', text: 'Hey, are you ready for the festival?' },
      { character: 'char2', text: 'Yeah! I can’t wait to see everyone there.' },
      { character: null, text: 'The sun shone brightly over the academy courtyard.' },
      { character: 'char1', text: 'Let’s go then!' }
    ], // Translation text
        img: 'https://via.placeholder.com/400x200' // Optional image URL
      }
    ]
  },
};

// Tags and filters
const activeFilters = {
  characters: new Set(),
  units: new Set(),
  authors: new Set()
};

function buildFilterTags() {
  const chars = new Map();
  const units = new Set();
  const authors = new Set();

  Object.values(storiesData).forEach(story => {
    if (story.characters) {
      story.characters.forEach(c => {
        const char = characterData[c];
        if (char) {
          chars.set(c, char.name);
          if (char.unit) units.add(char.unit);
        }
      });
    }
    if (story.author) authors.add(story.author);
  });

  populateTags('character-tags', chars, 'characters');
  populateTags('unit-tags', units, 'units');
  populateTags('author-tags', authors, 'authors');
}

function populateTags(containerId, items, type) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  if (items instanceof Map) {
    items.forEach((label, id) => createTag(container, label, id, type));
  } else {
    items.forEach(label => createTag(container, label, label, type));
  }
}

function createTag(container, label, value, type) {
  const tag = document.createElement('div');
  tag.className = 'tag';
  tag.textContent = label;

  tag.addEventListener('click', () => {
    tag.classList.toggle('active');

    if (activeFilters[type].has(value)) {
      activeFilters[type].delete(value);
    } else {
      activeFilters[type].add(value);
    }

    refreshTimeline();
  });

  container.appendChild(tag);
}



const timeline = document.getElementById('timeline');
const tabs = document.querySelectorAll('.tab');
const searchInput = document.getElementById('search');
const sortSelect = document.getElementById('sort');
  
function storyMatchesSearch(story, searchText) {
  if (!searchText) return true;
  const q = searchText.toLowerCase();

  // Title match
  if (story.title.toLowerCase().includes(q)) return true;

  // Character name match
  if (story.characters && Array.isArray(story.characters)) {
    return story.characters.some(charId => {
      const char = characterData[charId];
      return char && char.name.toLowerCase().includes(q);
    });
  }

  return false;
}

function renderTimeline(category='All', searchText='', sortBy='release'){
  timeline.innerHTML='';
  let filtered = Object.keys(storiesData)
    .map(slug => ({slug, ...storiesData[slug]}))
  .filter(story => storyMatchesFilters(story) && storyMatchesSearch(story, searchText));
  
function storyMatchesFilters(story) {
  if (activeFilters.characters.size) {
    if (!story.characters || ![...activeFilters.characters].every(c => story.characters.includes(c))) {
      return false;
    }
  }
function refreshTimeline() {
  const activeCategory = document.querySelector('.tab.active')?.dataset.category || 'All';
  renderTimeline(activeCategory, searchInput.value, sortSelect.value);
}

  if (activeFilters.units.size) {
    const storyUnits = (story.characters || [])
      .map(c => characterData[c]?.unit)
      .filter(Boolean);

    if (![...activeFilters.units].every(u => storyUnits.includes(u))) return false;
  }

  if (activeFilters.authors.size && !activeFilters.authors.has(story.author)) return false;

  return true;
}
function storyMatchesSearch(story, q) {
  if (!q) return true;
  q = q.toLowerCase();

  if (story.title.toLowerCase().includes(q)) return true;
  if (story.author?.toLowerCase().includes(q)) return true;

  if (story.characters) {
    return story.characters.some(id => {
      const char = characterData[id];
      return (
        char?.name.toLowerCase().includes(q) ||
        char?.unit?.toLowerCase().includes(q)
      );
    });
  }

  return false;
}


  if(sortBy==='chronological'){
    filtered.sort((a,b)=> new Date(a.date)-new Date(b.date));
  } else {
    filtered.sort((a,b)=> a.slug.localeCompare(b.slug));
  }

  filtered.forEach((story,index)=>{
    const card = document.createElement('div');
    card.className='story-card ' + (index%2===0?'story-left':'story-right');

    let charIcons = '';
    if (story.characters) {
  charIcons = story.characters.map(c => {
    const char = characterData[c];
    if (!char) return '';
    const iconSrc = char.thumbnail || char.img;
    return `<img class="character-icon"
                src="${iconSrc}"
                title="${char.name}"
                alt="${char.name}">`;
  }).join('');
}


    card.innerHTML = `
      <div class="story-title">${story.title}</div>
      <div class="story-meta">${story.category} | ${story.date} | ${charIcons}</div>
      <div style="margin-top:5px;"><a href="pages/story.html?slug=${story.slug}">View Story</a></div>
    `;

    timeline.appendChild(card);
  });
}


// Tabs
tabs.forEach(tab=>{
  tab.addEventListener('click',()=>{
    tabs.forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');
    refreshTimeline();
  });
});


// Search
searchInput.addEventListener('input',()=>{
  refreshTimeline();
});


// Sort
sortSelect.addEventListener('change',()=>{
  refreshTimeline();
});


// Initial render
refreshTimeline();
  
buildFilterTags();
refreshTimeline();

});
