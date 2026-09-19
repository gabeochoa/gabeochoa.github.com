const FEATURED = PROJECTS.filter(project => project.featured);
const REST = PROJECTS.filter(project => !project.featured);
const search = document.getElementById('search');
const sort = document.getElementById('sort');
const filters = [...document.querySelectorAll('[data-filter]')];
const gallery = document.getElementById('gallery');
let category = 'all';
let galleryProject;
let galleryIndex = 0;

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function link(text, href) {
  const node = element('a', '', text);
  node.href = href;
  return node;
}

function projectCard(project) {
  const card = element('article', 'project' + (project.screenshots.length ? '' : ' no-image'));
  card.dataset.project = project.name;
  const content = element('div', 'project-content');
  content.append(element('h3', '', project.title || project.name));
  const meta = element('div', 'project-meta');
  meta.append(element('span', '', project.lang.filter(language => language !== 'N/A').join(' · ')));
  if (project.visibility === 'private') meta.append(element('span', '', 'private project'));
  if (project.visibility === 'local') meta.append(element('span', '', 'prototype'));
  content.append(meta, element('p', 'description', project.desc));
  const links = element('div', 'project-links');
  if (project.link) links.append(link(project.visibility === 'private' ? 'private repository' : 'source on GitHub', project.link));
  if (project.demo) links.append(link('play in browser', project.demo));
  content.append(links);
  card.append(content);
  if (project.screenshots.length) {
    const preview = element('button', 'preview');
    preview.type = 'button';
    preview.setAttribute('aria-label', `View ${project.title || project.name} screenshots`);
    preview.setAttribute('aria-haspopup', 'dialog');
    const image = element('img');
    image.src = project.screenshots[0].src;
    image.alt = project.screenshots[0].caption;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.width = project.screenshots[0].width;
    image.height = project.screenshots[0].height;
    const caption = element('span', 'preview-caption');
    caption.append(element('span', '', 'view screenshots'), element('span', '', String(project.screenshots.length)));
    preview.append(image, caption);
    preview.addEventListener('click', () => openGallery(project));
    card.append(preview);
  }
  return card;
}

function render() {
  const query = search.value.trim().toLocaleLowerCase();
  const projects = REST.filter(project => {
    const matchesCategory = category === 'all' || project.tags.includes(category);
    return matchesCategory && `${project.name} ${project.title || ''} ${project.desc} ${project.lang.join(' ')}`.toLocaleLowerCase().includes(query);
  }).sort((a, b) => {
    if (sort.value === 'name') return a.name.localeCompare(b.name);
    const dateOrder = (a.updated || '').localeCompare(b.updated || '');
    return (sort.value === 'oldest' ? dateOrder : -dateOrder) || a.name.localeCompare(b.name);
  });
  document.getElementById('project-list').replaceChildren(...projects.map(projectCard));
  document.getElementById('projects-section').hidden = !projects.length;
  document.getElementById('empty').hidden = projects.length !== 0;
  document.getElementById('result-count').textContent = `${projects.length} of ${REST.length} projects`;
  filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
}

function showScreenshot() {
  const shot = galleryProject.screenshots[galleryIndex];
  const image = document.getElementById('gallery-image');
  image.src = shot.src;
  image.alt = shot.caption;
  document.getElementById('gallery-title').textContent = galleryProject.title || galleryProject.name;
  document.getElementById('gallery-caption').textContent = shot.caption + (shot.date ? ` · ${shot.date}` : '');
  document.getElementById('gallery-position').textContent = `${galleryIndex + 1} / ${galleryProject.screenshots.length}`;
  document.getElementById('gallery-previous').disabled = galleryIndex === 0;
  document.getElementById('gallery-next').disabled = galleryIndex === galleryProject.screenshots.length - 1;
}

function openGallery(project) {
  galleryProject = project;
  galleryIndex = 0;
  showScreenshot();
  gallery.showModal();
}

function moveScreenshot(direction) {
  galleryIndex = Math.max(0, Math.min(galleryProject.screenshots.length - 1, galleryIndex + direction));
  showScreenshot();
}

search.addEventListener('input', render);
sort.addEventListener('change', render);
filters.forEach(button => button.addEventListener('click', () => {
  category = button.dataset.filter;
  render();
}));
document.getElementById('reset').addEventListener('click', () => {
  search.value = '';
  category = 'all';
  sort.value = 'recent';
  render();
  search.focus();
});
document.getElementById('gallery-close').addEventListener('click', () => gallery.close());
document.getElementById('gallery-previous').addEventListener('click', () => moveScreenshot(-1));
document.getElementById('gallery-next').addEventListener('click', () => moveScreenshot(1));
gallery.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    moveScreenshot(event.key === 'ArrowLeft' ? -1 : 1);
  }
});
document.getElementById('featured-grid').replaceChildren(...FEATURED.map(projectCard));
render();
