import React from 'react';

import { Helmet } from '../../src';
import { render, unmount } from '../utils';
import { HELMET_ATTRIBUTE } from '../../src/constants';

Helmet.defaultProps.defer = false;

describe('debug alternate link issue', () => {
  afterEach(() => {
    unmount();
  });

  it('should identify how alternate links are processed', () => {
    // First render with alternate link
    render(
      <Helmet
        link={[
          {
            rel: 'alternate',
            hreflang: 'en',
            href: 'http://localhost/en',
          },
        ]}
      />
    );

    // Check all link tags
    const allLinkTags = [...document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`)];
    console.log('All link tags:', allLinkTags.map(tag => ({
      outerHTML: tag.outerHTML,
      isEqualNode: tag.isEqualNode(document.createElement('link')),
    })));
    
    // Now render with a different alternate link
    render(
      <Helmet
        link={[
          {
            rel: 'alternate',
            hreflang: 'fr',
            href: 'http://localhost/fr',
          },
        ]}
      />
    );
    
    // Check all link tags after update
    const updatedLinkTags = [...document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`)];
    console.log('Updated link tags:', updatedLinkTags.map(tag => ({
      outerHTML: tag.outerHTML,
      isEqualNode: tag.isEqualNode(document.createElement('link')),
    })));
    
    // Now render with no link tags
    render(<Helmet />);
    
    // Check all link tags after removal
    const finalLinkTags = [...document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`)];
    console.log('Final link tags:', finalLinkTags.map(tag => ({
      outerHTML: tag.outerHTML,
      isEqualNode: tag.isEqualNode(document.createElement('link')),
    })));
    
    expect(true).toBe(true);
  });
});
