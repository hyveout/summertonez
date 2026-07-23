// Product catalog — swap price / desc / sizes / add real image paths + Shopify variant IDs here.
// The `shopifyVariantId` field is what you'll use when you wire up Shopify (see product.html comment).

const PRODUCTS = [
  {
    id: 'war-in-my-head',
    title: 'War In My Head',
    price: 150,
    image: 'assets/war-in-my-head.png',
    desc: 'A raw, sprayed-typography graphic tee. Direct-to-garment print on heavyweight black cotton. Cut boxy, hangs oversized.',
    sizes: ['S', 'M', 'L', 'XL'],
    soldSizes: [],
    cat: 'tees',
    status: 'new',
    shopifyVariantId: null, // TODO: fill in from Shopify (per size)
  },
  {
    id: 'war-in-my-head-2',
    title: 'War In My Head',
    price: 150,
    image: 'assets/war-in-my-head.png',
    desc: 'A raw, sprayed-typography graphic tee. Direct-to-garment print on heavyweight black cotton. Cut boxy, hangs oversized.',
    sizes: ['S', 'M', 'L', 'XL'],
    soldSizes: [],
    cat: 'tees',
    status: 'new',
    shopifyVariantId: null,
  },
  {
    id: 'war-in-my-head-3',
    title: 'War In My Head',
    price: 150,
    image: 'assets/war-in-my-head.png',
    desc: 'A raw, sprayed-typography graphic tee. Direct-to-garment print on heavyweight black cotton. Cut boxy, hangs oversized.',
    sizes: ['S', 'M', 'L', 'XL'],
    soldSizes: [],
    cat: 'tees',
    status: 'new',
    shopifyVariantId: null,
  },
];
