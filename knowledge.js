import { renderTable } from './utils.js';

export function initKnowledgePage(data) {
    updateKnowledgeTable(data);
    document.getElementById('add-article')?.addEventListener('click', () => addArticle(data));
    document.getElementById('search-knowledge')?.addEventListener('input', (e) => searchKnowledge(e, data));
}

function addArticle(data) {
    const title = document.getElementById('article-title')?.value;
    const content = document.getElementById('article-content')?.value;
    const tags = document.getElementById('article-tags')?.value;

    if (!title || !content) {
        alert('Titel und Inhalt sind erforderlich');
        return;
    }

    data.knowledgeBase.push({
        id: data.knowledgeBase.length + 1,
        title,
        content,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        created_at: new Date().toISOString(),
        views: 0,
        last_accessed: null
    });

    updateKnowledgeTable(data);
    alert('Artikel hinzugefügt!');
    
    // Formular zurücksetzen
    document.getElementById('article-title').value = '';
    document.getElementById('article-tags').value = '';
    document.getElementById('article-content').value = '';
}

function updateKnowledgeTable(data) {
    renderTable('knowledge-table', ['ID', 'Titel', 'Tags', 'Aufrufe', 'Zuletzt gesehen'], data.knowledgeBase, article => {
        const tagsHtml = article.tags.map(tag => 
            `<span class="tag-badge bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">${tag}</span>`
        ).join(' ');

        return `
        <tr>
            <td>${article.id}</td>
            <td><a href="#" class="text-blue-600 hover:underline view-article" data-id="${article.id}">${article.title}</a></td>
            <td>${tagsHtml}</td>
            <td>${article.views}</td>
            <td>${article.last_accessed ? new Date(article.last_accessed).toLocaleString('de-DE') : 'Nie'}</td>
        </tr>
        `;
    });

    // Event-Listener für Artikelansicht hinzufügen
    document.querySelectorAll('.view-article').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const articleId = parseInt(link.getAttribute('data-id'));
            viewArticle(articleId, data);
        });
    });
}

function viewArticle(articleId, data) {
    const article = data.knowledgeBase.find(a => a.id === articleId);
    if (article) {
        article.views++;
        article.last_accessed = new Date().toISOString();
        
        const titleEl = document.getElementById('article-view-title');
        const contentEl = document.getElementById('article-view-content');
        const tagsEl = document.getElementById('article-view-tags');
        const modalEl = document.getElementById('article-view-modal');

        if (!titleEl || !contentEl || !tagsEl || !modalEl) {
            console.warn('One or more article view elements are missing');
            return;
        }

        titleEl.textContent = article.title;
        contentEl.textContent = article.content;
        tagsEl.innerHTML = article.tags.map(tag => 
            `<span class="tag-badge bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">${tag}</span>`
        ).join(' ');
        modalEl.classList.remove('hidden');
    }
}

function searchKnowledge(e, data) {
    const searchTerm = e.target.value.toLowerCase();
    
    const filtered = searchTerm 
        ? data.knowledgeBase.filter(article => {
            return (
                article.title.toLowerCase().includes(searchTerm) || 
                article.content.toLowerCase().includes(searchTerm) || 
                (article.tags && article.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
            );
        }) 
        : data.knowledgeBase;
    
    renderTable('knowledge-table', ['ID', 'Titel', 'Tags', 'Aufrufe', 'Zuletzt gesehen'], filtered, article => {
        const tagsHtml = article.tags.map(tag => 
            `<span class="tag-badge bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">${tag}</span>`
        ).join(' ');

        return `
        <tr>
            <td>${article.id}</td>
            <td><a href="#" class="text-blue-600 hover:underline view-article" data-id="${article.id}">${article.title}</a></td>
            <td>${tagsHtml}</td>
            <td>${article.views}</td>
            <td>${article.last_accessed ? new Date(article.last_accessed).toLocaleString('de-DE') : 'Nie'}</td>
        </tr>
        `;
    });
}