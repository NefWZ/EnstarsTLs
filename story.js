document.addEventListener('DOMContentLoaded', () => {
  const slug = new URLSearchParams(location.search).get('slug');
  if (!slug) return;

  const script = document.createElement('script');
  script.src = `stories/${slug}.js`;
  script.defer = true;
  script.onload = renderStory;
  document.head.appendChild(script);
});

function renderStory() {
  const story = window.storyData;
  if (!story) return;

  document.getElementById('story-title').textContent = story.title;

  const container = document.getElementById('chapters');

  story.chapters.forEach(ch => {
    const sec = document.createElement('section');
    sec.innerHTML = `<h2>${ch.title}</h2>`;

    ch.dialogue.forEach(line => {
      const div = document.createElement('div');
      div.className = 'dialogue-line';
      const char = characterData[line.character];
      div.innerHTML = `
        <img class="character-portrait" src="${char.img}" data-char="${line.character}">
        <div class="dialogue-text">${line.text}</div>
      `;
      sec.appendChild(div);
    });

    container.appendChild(sec);
  });

  applyCharacterColors();
}

