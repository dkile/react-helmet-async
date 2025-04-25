import React from 'react';

import { Helmet } from '../../src';
import { render, unmount } from '../utils';
import { HELMET_ATTRIBUTE } from '../../src/constants';

// Using default defer value (true) to simulate real-world behavior
// Helmet.defaultProps.defer = false;

describe('complex navigation link tags test', () => {
  afterEach(() => {
    unmount();
  });

  it('should handle rapid navigation changes correctly', async () => {
    // Helper function to wait for DOM updates
    const waitForDomUpdate = (ms = 50) => new Promise(resolve => setTimeout(resolve, ms));
    
    // Simulate first page (kr-ko/dashboard)
    console.log('Rendering first page (kr-ko/dashboard)');
    render(
      <Helmet>
        <link rel="canonical" href="https://thecodit.com/kr-ko/dashboard" />
        <link rel="alternate" href="https://thecodit.com/kr-ko/dashboard" hreflang="ko" />
        <link rel="alternate" href="https://thecodit.com/kr-en/dashboard" hreflang="en" />
      </Helmet>
    );

    // Wait for DOM updates
    await waitForDomUpdate();
    
    // Simulate rapid navigation to second page without waiting for first to complete
    console.log('\nRapidly rendering second page (kr-ko/settings)');
    render(
      <Helmet>
        <link rel="canonical" href="https://thecodit.com/kr-ko/settings" />
        <link rel="alternate" href="https://thecodit.com/kr-ko/settings" hreflang="ko" />
        <link rel="alternate" href="https://thecodit.com/kr-en/settings" hreflang="en" />
      </Helmet>
    );

    // Wait for DOM updates
    await waitForDomUpdate();

    // Simulate rapid navigation to third page
    console.log('\nRapidly rendering third page (kr-en/profile)');
    render(
      <Helmet>
        <link rel="canonical" href="https://thecodit.com/kr-en/profile" />
        <link rel="alternate" href="https://thecodit.com/kr-ko/profile" hreflang="ko" />
        <link rel="alternate" href="https://thecodit.com/kr-en/profile" hreflang="en" />
      </Helmet>
    );

    // Wait longer for all updates to complete
    await waitForDomUpdate(200);

    // Check final state of tags
    const canonicalTags = [...document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}][rel="canonical"]`)];
    const alternateTags = [...document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}][rel="alternate"]`)];
    
    console.log('After rapid navigation:');
    console.log('Canonical tags:', canonicalTags.map(tag => tag.outerHTML));
    console.log('Alternate tags:', alternateTags.map(tag => tag.outerHTML));
    
    // Verify no duplicate tags
    expect(canonicalTags.length).toBe(1);
    expect(alternateTags.length).toBe(2);
    
    // Verify correct final values
    expect(canonicalTags[0].getAttribute('href')).toBe('https://thecodit.com/kr-en/profile');
    
    // Get all alternate hrefs
    const alternateHrefs = alternateTags.map(tag => tag.getAttribute('href'));
    expect(alternateHrefs).toContain('https://thecodit.com/kr-ko/profile');
    expect(alternateHrefs).toContain('https://thecodit.com/kr-en/profile');
  });

  it('should handle nested Helmet components correctly', async () => {
    // Helper function to wait for DOM updates
    const waitForDomUpdate = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));
    
    // Simulate nested Helmet components (like in a complex app)
    console.log('Rendering nested Helmet components');
    render(
      <>
        <Helmet>
          {/* Base Helmet (like from a layout component) */}
          <link rel="canonical" href="https://thecodit.com/kr-ko/dashboard" />
          <link rel="alternate" href="https://thecodit.com/kr-ko/dashboard" hreflang="ko" />
        </Helmet>
        <Helmet>
          {/* Page-specific Helmet that might override some tags */}
          <link rel="alternate" href="https://thecodit.com/kr-en/dashboard" hreflang="en" />
        </Helmet>
      </>
    );

    // Wait for DOM updates
    await waitForDomUpdate();
    
    // Check tags after first render
    let canonicalTags = [...document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}][rel="canonical"]`)];
    let alternateTags = [...document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}][rel="alternate"]`)];
    
    console.log('After nested components render:');
    console.log('Canonical tags:', canonicalTags.map(tag => tag.outerHTML));
    console.log('Alternate tags:', alternateTags.map(tag => tag.outerHTML));
    
    expect(canonicalTags.length).toBe(1);
    expect(alternateTags.length).toBe(2);

    // Simulate navigation with nested components
    console.log('\nNavigating to new page with nested components');
    render(
      <>
        <Helmet>
          {/* Base Helmet (like from a layout component) */}
          <link rel="canonical" href="https://thecodit.com/kr-en/profile" />
          <link rel="alternate" href="https://thecodit.com/kr-ko/profile" hreflang="ko" />
        </Helmet>
        <Helmet>
          {/* Page-specific Helmet that might override some tags */}
          <link rel="alternate" href="https://thecodit.com/kr-en/profile" hreflang="en" />
        </Helmet>
      </>
    );

    // Wait for DOM updates
    await waitForDomUpdate(200);

    // Check tags after navigation
    canonicalTags = [...document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}][rel="canonical"]`)];
    alternateTags = [...document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}][rel="alternate"]`)];
    
    console.log('After navigation with nested components:');
    console.log('Canonical tags:', canonicalTags.map(tag => tag.outerHTML));
    console.log('Alternate tags:', alternateTags.map(tag => tag.outerHTML));
    
    // Verify no duplicate tags
    expect(canonicalTags.length).toBe(1);
    expect(alternateTags.length).toBe(2);
    
    // Verify correct final values
    expect(canonicalTags[0].getAttribute('href')).toBe('https://thecodit.com/kr-en/profile');
    
    // Get all alternate hrefs
    const alternateHrefs = alternateTags.map(tag => tag.getAttribute('href'));
    expect(alternateHrefs).toContain('https://thecodit.com/kr-ko/profile');
    expect(alternateHrefs).toContain('https://thecodit.com/kr-en/profile');
  });
});
