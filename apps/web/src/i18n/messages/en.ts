import type { Messages } from './tr'

// UI copy (English). Must match the structure of tr.ts exactly.
export const en: Messages = {
  meta: {
    tagline: 'Mastery in modern carpet manufacturing',
    description:
      'Karar Halı is a modern carpet manufacturer managing every step in-house, from design and weaving to quality control and export.',
  },
  nav: {
    home: 'Home',
    about: 'About',
    collections: 'Collections',
    production: 'Production',
    contact: 'Contact',
  },
  common: {
    getQuote: 'Get a Quote',
    skipToContent: 'Skip to content',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    mainMenu: 'Main menu',
    mobileMenu: 'Mobile menu',
    homeLink: (name) => `${name} home`,
    language: 'Language',
    backHome: 'Back to home',
  },
  footer: {
    pages: 'Pages',
    contact: 'Contact',
    rights: 'All rights reserved.',
    demo: 'This is a demo site for presentation purposes; all content is fictional.',
  },
  contactInfo: {
    address: 'Organized Industrial Zone, 4th Street No: 12, Şehitkamil / Gaziantep, Türkiye',
    hours: 'Monday – Friday, 08:30 – 18:00 (GMT+3)',
  },
  home: {
    hero: {
      eyebrow: 'Weaving carpets since 1987',
      titleStart: 'Knot by knot,',
      titleAccent: 'modern',
      titleEnd: 'craft.',
      text: 'We manage the entire process in our own facilities, from design and weaving to quality control and shipping, producing rugs for homes, hotels and offices in over 40 countries.',
      primary: 'Explore collections',
      secondary: 'Our facility',
      swatchTitle: (name) => `${name} collection`,
    },
    collections: {
      eyebrow: 'Collections',
      title: 'A weave for every space',
      description:
        'A wide range from classic medallions to minimalist flatweaves, from kilims to outdoor series.',
      cta: 'View all',
    },
    production: {
      eyebrow: 'Production',
      title: 'From yarn to shipment, under one roof',
      description:
        'Every step of our six-stage production process is carried out in our own facility by our own team.',
      cta: 'See the process',
    },
    values: {
      eyebrow: 'Our values',
      title: 'Principles that carry craft into the future',
    },
  },
  cta: {
    title: 'Partner with us for dealership, export and project solutions.',
    text: 'Let us prepare a quote for your hotel, office and retail projects with custom sizes, patterns and colours.',
    button: 'Request a quote',
  },
  about: {
    metaDescription: 'The story, values and journey of Karar Halı since 1987.',
    eyebrow: 'About us',
    title: 'Three generations of weaving know-how in a modern factory.',
    description:
      'Our story, from a 12-loom workshop to an integrated production facility exporting to over 40 countries.',
    storyEyebrow: 'Our story',
    storyTitle: 'Scaling a craft',
    story: [
      'Karar Halı was founded in 1987 as a small family workshop in Gaziantep. Today it produces 3.5 million m² of carpet a year on 45,000 m² of covered space with more than 450 employees.',
      'We combine the experience of our master weavers with our digital design lab and high-precision looms, delivering consistent quality to the residential, hospitality, office and retail sectors.',
      'We measure energy, water and raw material efficiency at every stage of production and place sustainability at the heart of how we work.',
    ],
    milestonesEyebrow: 'Milestones',
    milestonesTitle: 'Our journey',
    valuesEyebrow: 'Our values',
    valuesTitle: 'The principles that define us',
  },
  collections: {
    metaDescription: 'Discover our classic, modern, kilim and outdoor carpet collections.',
    eyebrow: 'Collections',
    title: 'A wealth of pattern, texture and colour',
    description:
      'Every collection is developed in our own design studio and produced in our facility. Contact us for custom sizes and colours.',
    filterLabel: 'Filter by category',
    all: 'All',
    empty: 'There are no collections in this category yet.',
    categories: {
      classic: 'Classic',
      modern: 'Modern',
      kilim: 'Kilim',
      outdoor: 'Outdoor',
    },
  },
  collectionDetail: {
    back: 'All collections',
    collectionOf: (category) => `${category} collection`,
    swatchTitle: (name) => `${name} carpet pattern`,
    specs: {
      category: 'Category',
      material: 'Material',
      pileHeight: 'Pile height',
      technique: 'Technique',
    },
    sizes: 'Standard sizes',
    cta: 'Get a quote for this collection',
    othersEyebrow: 'Keep exploring',
    othersTitle: 'Other collections',
  },
  production: {
    metaDescription:
      'Our integrated carpet production facility, six-stage process and certifications.',
    eyebrow: 'Production',
    title: 'Integrated facility, controlled process.',
    description:
      'From yarn dyeing to packaging, every step is carried out by our own teams at our facility in the Gaziantep Organized Industrial Zone.',
    processEyebrow: 'Process',
    processTitle: 'A carpet’s journey in six steps',
    processDescription:
      'Measurable quality criteria are applied at every stage; products only move on after passing these checks.',
    facilityEyebrow: 'Facility',
    facilityTitle: 'Our production power in numbers',
    certEyebrow: 'Quality and sustainability',
    certTitle: 'Certifications',
    certDescription:
      'We manufacture to international standards and have our processes regularly audited by independent bodies.',
  },
  contact: {
    metaDescription: 'Contact Karar Halı for dealership, export and project enquiries.',
    eyebrow: 'Contact',
    title: 'Let’s talk about your project.',
    description:
      'Fill in the form for dealership, export or hotel/office projects and our sales team will get back to you within one business day.',
    info: {
      address: 'Address',
      phone: 'Phone',
      email: 'Email',
      hours: 'Business hours',
    },
    form: {
      name: 'Full name',
      email: 'Email',
      company: 'Company (optional)',
      subject: 'Subject',
      message: 'Your message',
      submit: 'Send Message',
      sending: 'Sending…',
    },
    subjects: {
      dealership: 'Dealership',
      export: 'Export',
      project: 'Project / Hotel',
      other: 'Other',
    },
    validation: {
      name: 'Please enter your name.',
      email: 'Please enter a valid email address.',
      message: 'Your message must be at least 10 characters.',
    },
    success: {
      title: 'Message received',
      text: 'Thank you. Our sales team will contact you shortly.',
      note: 'Note: This is a demo site; the form is not actually sent anywhere.',
    },
  },
  notFound: {
    metaTitle: 'Page not found',
    title: 'Page not found',
    text: 'The page you are looking for may have moved or never existed.',
  },
  error: {
    title: 'Something went wrong',
    text: 'Please refresh the page or try again later.',
  },
}
