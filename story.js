document.addEventListener('DOMContentLoaded', () => {
  const slug = new URLSearchParams(location.search).get('slug');
  if (!slug) return;

  const script = document.createElement('script');
  script.src = `stories/${slug}.js`;
  script.defer = true;
  script.onload = renderStory;
  document.head.appendChild(script);
});

function applyCharacterColors() {
  document.querySelectorAll('.character-portrait').forEach(img => {
    const id = img.dataset.char;
    const char = characterData[id];
    if (!char || !char.color) return;

    img.style.background = char.color;
    img.style.borderRadius = '12px';
    img.style.padding = '6px';
  });
}

function renderStory() {
  const story = window.storyData;
  if (!story) {
    console.warn('No storyData found for this story.');
    return;
  }

  document.getElementById('story-title').textContent = story.title || 'Untitled Story';

  const container = document.getElementById('chapters');
  container.innerHTML = '';

  story.chapters.forEach((ch, chapterIndex) => {
    const sec = document.createElement('section');
    sec.className = 'chapter';

    const h2 = document.createElement('h2');
    h2.textContent = ch.title || `Chapter ${chapterIndex + 1}`;
    sec.appendChild(h2);

    ch.dialogue.forEach(line => {
      const div = document.createElement('div');
      div.className = 'dialogue-line';

      if (line.character && characterData[line.character]) {
        const char = characterData[line.character];

        const img = document.createElement('img');
        img.className = 'character-portrait';
        img.src = char.img;
        img.alt = char.name;
        img.dataset.char = line.character;

        const text = document.createElement('div');
        text.className = 'dialogue-text';
        text.textContent = line.text;

        div.appendChild(img);
        div.appendChild(text);

      } else {
        // Narration line
        div.classList.add('narration');
        div.textContent = line.text;
      }

      sec.appendChild(div);
    });

    container.appendChild(sec);
  });

  applyCharacterColors();
}
