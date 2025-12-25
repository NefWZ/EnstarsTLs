document.addEventListener('DOMContentLoaded', () => {

const storiesData = {
  story1: {
    title: 'Sweets',          // Story title
    category: 'Scout',                        // Main / Event / Scout / Unit
    date: '2015-05-31',                      // Release date
    author: 'Akira',                       // Author name
    translator: 'NefWZ',              // Translator name
    description: 'TO DO',  // Story overview
    characters: ['EichiTenshouin','char2'],           // Character IDs from characterData
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
      },
      {
        title: 'Chapter 2: Middle',
        dialogue: 'Translation text for chapter 2'
      },
      {
        title: 'Chapter 3: Ending',
        dialogue: 'Translation text for chapter 3',
        img: 'https://via.placeholder.com/400x200'
      }
    ]
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


const characterData = {
  EichiTenshouin: {
    name: 'Eichi',                     // Display name
    unit: 'fine',                       // Their unit (optional)
    img: 'https://github.com/NefWZ/img/blob/main/headshots/eichi.png',  // Profile image
    thumbnail: 'https://via.placeholder.com/30', // Optional smaller icon
     hue: 320,        // Hue Angle
    color: '#FF6EC7' // Optional custom color
  },

  char2: {
    name: 'Character 2',
    unit: 'Scouting Team',
    img: 'https://via.placeholder.com/50',
    thumbnail: 'https://via.placeholder.com/30'
  },

  char3: {
    name: 'Character 3',
    unit: 'Star Knights',
    img: 'https://via.placeholder.com/50',
    thumbnail: 'https://via.placeholder.com/30'
  }

  // Add more characters here...
};


const timeline = document.getElementById('timeline');
const tabs = document.querySelectorAll('.tab');
const searchInput = document.getElementById('search');
const sortSelect = document.getElementById('sort');

function renderTimeline(category='All', searchText='', sortBy='release'){
  timeline.innerHTML='';
  let filtered = Object.keys(storiesData)
    .map(slug => ({slug, ...storiesData[slug]}))
    .filter(s => (category==='All'||s.category===category) &&
                 s.title.toLowerCase().includes(searchText.toLowerCase()));

  if(sortBy==='chronological'){
    filtered.sort((a,b)=> new Date(a.date)-new Date(b.date));
  } else {
    filtered.sort((a,b)=> a.slug.localeCompare(b.slug));
  }

  filtered.forEach((story,index)=>{
    const card = document.createElement('div');
    card.className='story-card ' + (index%2===0?'story-left':'story-right');

    let charIcons = '';
    if(story.characters){
      charIcons = story.characters.map(c => `<img class="character-icon" src="${characterData[c].img}" title="${characterData[c].name}">`).join('');
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
    renderTimeline(tab.dataset.category, searchInput.value, sortSelect.value);
  });
});

// Search
searchInput.addEventListener('input',()=>{
  const activeCategory = document.querySelector('.tab.active').dataset.category;
  renderTimeline(activeCategory, searchInput.value, sortSelect.value);
});

// Sort
sortSelect.addEventListener('change',()=>{
  const activeCategory = document.querySelector('.tab.active').dataset.category;
  renderTimeline(activeCategory, searchInput.value, sortSelect.value);
});

// Initial render
renderTimeline('All', '', sortSelect.value || 'release');

});
