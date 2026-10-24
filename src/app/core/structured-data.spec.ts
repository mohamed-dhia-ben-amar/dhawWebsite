import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { site } from '../../content/en/site';
import { StructuredData, personSchema } from './structured-data';

describe('personSchema', () => {
  it('describes the owner as a schema.org Person', () => {
    const schema = personSchema(site.seo.person, 'https://mohameddhia.dev/en/');
    expect(schema).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Mohamed Dhia Ben Amar',
      jobTitle: 'Full-Stack Software Engineer',
      url: 'https://mohameddhia.dev/en/',
      email: 'mailto:mohameddhiabenamar@gmail.com',
      address: { '@type': 'PostalAddress', addressLocality: 'Tunis', addressCountry: 'TN' },
      worksFor: { '@type': 'Organization', name: 'Minotore' },
    });
    expect(schema.sameAs).toEqual([
      'https://github.com/mohamed-dhia-ben-amar',
      'https://linkedin.com/in/mohameddhia-benamar',
    ]);
  });
});

describe('StructuredData', () => {
  it('adds one JSON-LD script per id, replaces it, and removes it', () => {
    const data = TestBed.inject(StructuredData);
    const head = TestBed.inject(DOCUMENT).head;
    data.set('x', { a: 1 });
    data.set('x', { a: 2 });
    const scripts = head.querySelectorAll('script[type="application/ld+json"]#x');
    expect(scripts).toHaveLength(1);
    expect(JSON.parse(scripts[0].textContent ?? '')).toEqual({ a: 2 });
    data.remove('x');
    expect(head.querySelector('#x')).toBeNull();
  });

  it('escapes "<" so content cannot close the script element', () => {
    const data = TestBed.inject(StructuredData);
    data.set('y', { name: '</script><script>alert(1)</script>' });
    const script = TestBed.inject(DOCUMENT).getElementById('y');
    expect(script?.textContent).not.toContain('</script>');
    expect(JSON.parse(script?.textContent ?? '').name).toBe('</script><script>alert(1)</script>');
    data.remove('y');
  });
});
