import React from 'react';

import { Helmet } from '../../src';
import { render, unmount } from '../utils';
import { HELMET_ATTRIBUTE } from '../../src/constants';

Helmet.defaultProps.defer = false;

describe('debug alternate link tags', () => {
  afterEach(() => {
    unmount();
  });

  it('should add alternate link tags', () => {
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
    console.log(
      'All link tags:',
      allLinkTags.map(tag => tag.outerHTML)
    );

    // Verify the tag was added
    const alternateTags = [
      ...document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}][rel="alternate"]`),
    ];
    console.log(
      'Alternate tags:',
      alternateTags.map(tag => tag.outerHTML)
    );

    expect(allLinkTags.length).toBeGreaterThan(0);
  });
});
