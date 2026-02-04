/**
 * Sidebar Topic Filters for Sphinx Documentation
 * Provides topic-based filtering for navigation sidebar
 */

(function() {
    'use strict';
    
    // Topic definitions
    const topics = {
        'all': 'All Topics',
        'hardware': 'Hardware',
        'software': 'Software',
        'api': 'API Documents',
        'release-notes': 'Release Notes',
        'host-app-notes': 'Host Application Notes',
        'quick-ref': 'Quick Reference Guide'
    };

    // Map document names to topics (normalized to lowercase)
    const docTopicMap = {
        'index': ['all'],
        'introduction': ['all', 'software'],
        'getting-started': ['all', 'software'],
        'hardware-specs': ['all', 'hardware'],
        'hardware-specs copy': ['all', 'hardware'],
        'green tea studio': ['all', 'software'],
        'green tea studio key features': ['all', 'software'],
        'api-reference': ['all', 'api'],
        'api-documents': ['all', 'api'],
        'release-notes': ['all', 'release-notes'],
        'host-application-notes': ['all', 'host-app-notes'],
        'application-notes': ['all', 'host-app-notes'],
        'quick-reference': ['all', 'quick-ref'],
        'quick-reference-guide': ['all', 'quick-ref']
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

        // Create and insert filter UI at the bottom
        const filterContainer = createFilterContainer();
        menu.appendChild(filterContainer);

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
        
        const label = document.createElement('label');
        label.className = 'sidebar-filters-label';
        label.textContent = 'Filter Topics: ';
        container.appendChild(label);

        // Create select dropdown
        const select = document.createElement('select');
        select.className = 'sidebar-filters-select';
        select.id = 'topic-filter-select';

        // Add options
        Object.entries(topics).forEach(([key, label], index) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = label;
            if (index === 0) option.selected = true;
            select.appendChild(option);
        });

        container.appendChild(select);
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
        const select = document.querySelector('#topic-filter-select');
        if (!select) {
            console.warn('[sidebar-filters] Select element not found');
            return;
        }
        
        select.addEventListener('change', function(e) {
            const topic = this.value;
            
            console.log('[sidebar-filters] Filter changed: ' + topic);
            
            // Filter items
            filterByTopic(topic);
            
            // Save preference
            localStorage.setItem('sphinx-topic-filter', topic);
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
        const select = document.querySelector('#topic-filter-select');
        
        if (select) {
            console.log('[sidebar-filters] Applying saved filter: ' + savedTopic);
            select.value = savedTopic;
            filterByTopic(savedTopic);
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
