/**
 * Sidebar Topic Filters for Sphinx Documentation
 * Provides topic-based filtering for navigation sidebar
 */

(function() {
    'use strict';
    
    // Topic definitions
    const topics = {
        'all': 'All Topics',
        'getting-started': 'Getting Started',
        'hardware': 'Hardware',
        'software': 'Software',
        'development': 'Development'
    };

    // Map document names to topics (normalized to lowercase)
    const docTopicMap = {
        'index': ['all'],
        'introduction': ['all', 'getting-started'],
        'getting-started': ['all', 'getting-started', 'software'],
        'hardware-specs': ['all', 'hardware'],
        'hardware-specs copy': ['all', 'hardware'],
        'green tea studio': ['all', 'software', 'development'],
        'green tea studio key features': ['all', 'software', 'development']
    };

    // Initialize filters when DOM is ready
    function init() {
        // Wait for the menu to be available
        const menu = document.querySelector('.wy-menu');
        if (!menu) {
            console.warn('[sidebar-filters] Menu not found');
            return;
        }

        console.log('[sidebar-filters] Initializing...');

        // Create and insert filter UI
        const filterContainer = createFilterContainer();
        menu.insertBefore(filterContainer, menu.firstChild);

        // Tag all TOC items
        tagTocItems();

        // Setup event listeners
        setupFilterListeners();

        // Apply saved filter
        applySavedFilter();
        
        console.log('[sidebar-filters] Initialized successfully');
    }

    // Create filter UI container
    function createFilterContainer() {
        const container = document.createElement('div');
        container.className = 'sidebar-filters';
        
        const title = document.createElement('span');
        title.className = 'sidebar-filters-title';
        title.textContent = 'Filter Topics';
        container.appendChild(title);

        const tabs = document.createElement('ul');
        tabs.className = 'filter-tabs';

        // Add all topic buttons
        Object.entries(topics).forEach(([key, label], index) => {
            const li = document.createElement('li');
            li.className = 'filter-tab';
            
            const button = document.createElement('button');
            button.type = 'button';
            button.dataset.topic = key;
            button.textContent = label;
            if (index === 0) button.classList.add('active');
            
            li.appendChild(button);
            tabs.appendChild(li);
        });

        container.appendChild(tabs);
        return container;
    }

    // Tag TOC items with topics
    function tagTocItems() {
        const menu = document.querySelector('.wy-menu');
        if (!menu) {
            console.warn('[sidebar-filters] wy-menu not found');
            return;
        }

        // Find all level-1 toctree items (direct links in sidebar)
        const topLevelItems = menu.querySelectorAll('ul > li.toctree-l1');
        console.log('[sidebar-filters] Found ' + topLevelItems.length + ' top-level menu items');
        
        topLevelItems.forEach(item => {
            const link = item.querySelector(':scope > a[href]');
            if (!link) {
                // No direct link
                item.classList.add('toc-item');
                item.dataset.topic = 'all';
                return;
            }

            const href = link.getAttribute('href');
            const docName = extractDocName(href);
            const itemTopics = docTopicMap[docName] || ['all'];

            item.classList.add('toc-item');
            item.dataset.topic = itemTopics.join(' ');
            
            console.log('[sidebar-filters] "' + href + '" -> docName: "' + docName + '" -> topics: [' + itemTopics.join(', ') + ']');
        });
    }

    // Extract document name from URL
    function extractDocName(href) {
        if (!href) return null;

        // Decode URL encoding first
        try {
            href = decodeURIComponent(href);
        } catch (e) {
            // Continue with original if decoding fails
        }

        // Remove fragment and query
        href = href.split('?')[0].split('#')[0];

        // Get last part of path
        let name = href.split('/').pop().replace(/\.html$/, '');
        
        // Normalize to lowercase for comparison
        return name.toLowerCase() || null;
    }

    // Setup filter button listeners
    function setupFilterListeners() {
        const buttons = document.querySelectorAll('.filter-tab button');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const topic = this.dataset.topic;
                
                console.log('[sidebar-filters] Filter clicked: ' + topic);
                
                // Update active button
                buttons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Filter items
                filterByTopic(topic);
                
                // Save preference
                localStorage.setItem('sphinx-topic-filter', topic);
            });
        });
    }

    // Filter items by topic
    function filterByTopic(activeTopic) {
        const items = document.querySelectorAll('.toc-item');
        let hiddenCount = 0;
        
        items.forEach(item => {
            const itemTopics = (item.dataset.topic || '').split(/\s+/).filter(Boolean);
            const shouldShow = activeTopic === 'all' || itemTopics.includes(activeTopic);
            
            if (!shouldShow) {
                item.style.display = 'none';
                hiddenCount++;
            } else {
                item.style.display = '';
            }
        });
        
        console.log('[sidebar-filters] Filtered for "' + activeTopic + '", hiding ' + hiddenCount + ' items');
    }

    // Apply saved filter on page load
    function applySavedFilter() {
        const savedTopic = localStorage.getItem('sphinx-topic-filter') || 'all';
        const button = document.querySelector(`.filter-tab button[data-topic="${savedTopic}"]`);
        
        if (button) {
            console.log('[sidebar-filters] Applying saved filter: ' + savedTopic);
            button.click();
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM already loaded
        init();
    }
})();
