import React from 'react';

import { Helmet } from '../../src';
import { render, unmount } from '../utils';
import { HELMET_ATTRIBUTE } from '../../src/constants';

Helmet.defaultProps.defer = false;

describe('alternate link tags', () => {
  afterEach(() => {
    unmount();
  });

  it('should remove alternate link tags when component unmounts', () => {
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

    // Verify the tag was added
    let alternateTags = [
      ...document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}][rel="alternate"]`),
    ];
    expect(alternateTags.length).toBe(1);
    expect(alternateTags[0].getAttribute('hreflang')).toBe('en');
    expect(alternateTags[0].getAttribute('href')).toBe('http://localhost/en');

    // Unmount (simulate page change)
    unmount();

    // Verify the tag was removed
    alternateTags = [
      ...document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}][rel="alternate"]`),
    ];
    expect(alternateTags.length).toBe(0);
  });

  it('should update alternate link tags when props change', () => {
    // First render with one alternate link
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

    // Verify the tag was added
    let alternateTags = [
      ...document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}][rel="alternate"]`),
    ];
    expect(alternateTags.length).toBe(1);
    expect(alternateTags[0].getAttribute('hreflang')).toBe('en');

    // Render with a different alternate link
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

    // Verify the tag was updated
    alternateTags = [
      ...document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}][rel="alternate"]`),
    ];
    expect(alternateTags.length).toBe(1);
    expect(alternateTags[0].getAttribute('hreflang')).toBe('fr');
    expect(alternateTags[0].getAttribute('href')).toBe('http://localhost/fr');
  });

  it('should remove alternate link tags when rendered without them', () => {
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

    // Verify the tag was added
    let alternateTags = [
      ...document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}][rel="alternate"]`),
    ];
    expect(alternateTags.length).toBe(1);

    // Render without alternate link
    render(<Helmet />);

    // Verify the tag was removed
    alternateTags = [
      ...document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}][rel="alternate"]`),
    ];
    expect(alternateTags.length).toBe(0);
  });
});
