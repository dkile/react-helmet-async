import React from 'react';

import { Helmet } from '../../src';
import { render, unmount } from '../utils';
import { HELMET_ATTRIBUTE } from '../../src/constants';

// Using default defer value (true) to simulate real-world behavior
// Helmet.defaultProps.defer = false;

describe('navigation link tags test', () => {
  afterEach(() => {
    unmount();
  });

  it('should update canonical and alternate links correctly during page navigation', async () => {
    // Helper function to wait for DOM updates
    const waitForDomUpdate = () => new Promise(resolve => setTimeout(resolve, 100));
    
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
    
    // Check tags after first render
    let canonicalTags = [...document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}][rel="canonical"]`)];
    let alternateTags = [...document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}][rel="alternate"]`)];
    
    console.log('After first page render:');
    console.log('Canonical tags:', canonicalTags.map(tag => tag.outerHTML));
    console.log('Alternate tags:', alternateTags.map(tag => tag.outerHTML));
    
    expect(canonicalTags.length).toBe(1);
    expect(alternateTags.length).toBe(2);
    expect(canonicalTags[0].getAttribute('href')).toBe('https://thecodit.com/kr-ko/dashboard');

    // Simulate navigation to second page (kr-ko/settings)
    console.log('\nRendering second page (kr-ko/settings)');
    render(
      <Helmet>
        <link rel="canonical" href="https://thecodit.com/kr-ko/settings" />
        <link rel="alternate" href="https://thecodit.com/kr-ko/settings" hreflang="ko" />
        <link rel="alternate" href="https://thecodit.com/kr-en/settings" hreflang="en" />
      </Helmet>
    );

    // Wait for DOM updates
    await waitForDomUpdate();

    // Check tags after second render
    canonicalTags = [...document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}][rel="canonical"]`)];
    alternateTags = [...document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}][rel="alternate"]`)];
    
    console.log('After second page render:');
    console.log('Canonical tags:', canonicalTags.map(tag => tag.outerHTML));
    console.log('Alternate tags:', alternateTags.map(tag => tag.outerHTML));
    
    expect(canonicalTags.length).toBe(1);
    expect(alternateTags.length).toBe(2);
    expect(canonicalTags[0].getAttribute('href')).toBe('https://thecodit.com/kr-ko/settings');

    // Simulate navigation to third page (kr-en/profile)
    console.log('\nRendering third page (kr-en/profile)');
    render(
      <Helmet>
        <link rel="canonical" href="https://thecodit.com/kr-en/profile" />
        <link rel="alternate" href="https://thecodit.com/kr-ko/profile" hreflang="ko" />
        <link rel="alternate" href="https://thecodit.com/kr-en/profile" hreflang="en" />
      </Helmet>
    );

    // Wait for DOM updates
    await waitForDomUpdate();

    // Check tags after third render
    canonicalTags = [...document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}][rel="canonical"]`)];
    alternateTags = [...document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}][rel="alternate"]`)];
    
    console.log('After third page render:');
    console.log('Canonical tags:', canonicalTags.map(tag => tag.outerHTML));
    console.log('Alternate tags:', alternateTags.map(tag => tag.outerHTML));
    
    expect(canonicalTags.length).toBe(1);
    expect(alternateTags.length).toBe(2);
    expect(canonicalTags[0].getAttribute('href')).toBe('https://thecodit.com/kr-en/profile');
    
    // Get all alternate hrefs
    const alternateHrefs = alternateTags.map(tag => tag.getAttribute('href'));
    expect(alternateHrefs).toContain('https://thecodit.com/kr-ko/profile');
    expect(alternateHrefs).toContain('https://thecodit.com/kr-en/profile');
  });
});
