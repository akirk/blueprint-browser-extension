// Blueprint Playground Launcher Content Script

function transformGitHubUrl(url) {
  // Transform GitHub URLs to raw.githubusercontent.com format
  const githubRegex = /^https?:\/\/github\.com\/([^\/]+)\/([^\/]+)\/blob\/(.+)$/;
  const match = url.match(githubRegex);
  
  if (match) {
    const [, owner, repo, path] = match;
    return `https://raw.githubusercontent.com/${owner}/${repo}/${path}`;
  }
  
  return url;
}

function hasNearbyPlayButton(link, targetHref) {
  // Find the closest containing p or td element
  const container = link.closest('p, td') || link.parentNode;
  
  if (!container) {
    return false;
  }
  
  // Check all existing play buttons within this container
  const existingButtons = container.querySelectorAll('.blueprint-playground-btn');
  
  for (const button of existingButtons) {
    // Get the URL this button would open
    const buttonUrl = button.dataset.blueprintUrl;
    if (buttonUrl === targetHref) {
      return true;
    }
  }
  
  return false;
}

function createPlayButton(originalUrl) {
  const button = document.createElement('button');
  button.className = 'blueprint-playground-btn';
  button.innerHTML = '▶️ Launch in Playground';
  button.title = 'Open this blueprint in WordPress Playground';
  
  // Store the original URL for deduplication checking
  button.dataset.blueprintUrl = originalUrl;
  
  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const transformedUrl = transformGitHubUrl(originalUrl);
    const playgroundUrl = `https://playground.wordpress.net/?blueprint-url=${encodeURIComponent(transformedUrl)}`;
    
    window.open(playgroundUrl, '_blank');
  });
  
  return button;
}

function findBlueprintLinks() {
  // Find all links that end with ".json"
  const allJsonLinks = document.querySelectorAll('a[href$=".json"]');
  
  // Filter to only blueprint files
  const links = Array.from(allJsonLinks).filter(link => {
    const href = link.href || link.getAttribute('href');
    if (!href) return false;
    
    const filename = href.split('/').pop() || '';
    return filename.includes('blueprint');
  });
  
  links.forEach(link => {
    // Skip if already processed
    if (link.dataset.blueprintProcessed) {
      return;
    }
    
    const href = link.href || link.getAttribute('href');
    if (!href) return;
    
    // Skip GitHub edit links - only process blob links or non-GitHub links
    if (href.includes('github.com') && href.includes('/edit/')) {
      link.dataset.blueprintProcessed = 'true';
      return;
    }
    
    // Check if there's already a button for this URL in the nearby DOM hierarchy
    if (hasNearbyPlayButton(link, href)) {
      link.dataset.blueprintProcessed = 'true';
      return;
    }
    
    // Mark as processed
    link.dataset.blueprintProcessed = 'true';
    
    // Create and insert play button
    const playButton = createPlayButton(href);
    
    // Insert button after the link
    if (link.parentNode) {
      link.parentNode.insertBefore(playButton, link.nextSibling);
      
      // Add a small space between link and button
      const space = document.createTextNode(' ');
      link.parentNode.insertBefore(space, playButton);
    }
  });
}

// Initial scan
findBlueprintLinks();

// Watch for dynamically added content
const observer = new MutationObserver((mutations) => {
  let shouldScan = false;
  
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      // Check if any added nodes contain links
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName === 'A' || node.querySelector('a')) {
            shouldScan = true;
          }
        }
      });
    }
  });
  
  if (shouldScan) {
    // Debounce the scanning to avoid excessive calls
    setTimeout(findBlueprintLinks, 100);
  }
});

// Start observing
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Also scan when the page is fully loaded (in case content loads after initial scan)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', findBlueprintLinks);
} else {
  // Page is already loaded, scan again after a short delay
  setTimeout(findBlueprintLinks, 500);
}